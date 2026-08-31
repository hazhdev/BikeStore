import { db } from "../../config/db";
import type {
  ProductDetail,
  ProductFilters,
  ProductImage,
  ProductListItem,
  ProductSort,
  ProductVariant,
} from "./products.types";

/**
 * Поля карточки в списке. Наличие считается через EXISTS по вариантам:
 * товар "в наличии", если хотя бы у одного размера stock > 0.
 */
const LIST_FIELDS = `
  p.id,
  p.slug,
  p.name,
  p.price,
  p.old_price     AS "oldPrice",
  p.rating,
  p.rating_count  AS "ratingCount",
  p.country,
  p.country_code  AS "countryCode",
  b.slug          AS "brandSlug",
  b.name          AS "brandName",
  c.slug          AS "categorySlug",
  c.name          AS "categoryName",
  fm.slug         AS "frameSlug",
  fm.name         AS "frameName",
  (
    SELECT i.path FROM product_images i
    WHERE i.product_id = p.id AND i.is_main
    LIMIT 1
  )               AS image,
  EXISTS (
    SELECT 1 FROM product_variants v
    WHERE v.product_id = p.id AND v.stock > 0
  )               AS "inStock"
`;

const JOINS = `
  FROM products p
  LEFT JOIN brands          b  ON b.id  = p.brand_id
  LEFT JOIN categories      c  ON c.id  = p.category_id
  LEFT JOIN frame_materials fm ON fm.id = p.frame_material_id
`;

/**
 * Собирает условия WHERE и массив значений параллельно.
 *
 * Ключевая сложность модуля: фильтров может прийти ноль, а может шесть,
 * и номера $1, $2... должны совпадать с позициями в массиве. Поэтому
 * условие и значение всегда добавляются вместе, а номер берётся из
 * текущей длины массива.
 */
function buildWhere(filters: ProductFilters, exclude?: FacetKey) {
  const conditions: string[] = ["p.is_active = true"];
  const values: unknown[] = [];

  const add = (sql: (n: number) => string, value: unknown) => {
    values.push(value);
    conditions.push(sql(values.length));
  };

  // категория: показываем товары и самой категории, и её подкатегорий —
  // клик по "Велосипеды" должен показать горные, шоссейные и детские
  if (filters.category && exclude !== "category") {
    add(
      (n) => `p.category_id IN (
        SELECT id FROM categories WHERE slug = $${n}
        UNION
        SELECT child.id FROM categories child
        JOIN categories parent ON parent.id = child.parent_id
        WHERE parent.slug = $${n}
      )`,
      filters.category,
    );
  }

  if (filters.brand?.length && exclude !== "brand") {
    add((n) => `b.slug = ANY($${n}::text[])`, filters.brand);
  }

  if (filters.frame?.length && exclude !== "frame") {
    add((n) => `fm.slug = ANY($${n}::text[])`, filters.frame);
  }

  // цвет и размер живут в вариантах, поэтому проверяем через EXISTS
  if (filters.color?.length && exclude !== "color") {
    add(
      (n) => `EXISTS (
        SELECT 1 FROM product_variants v
        JOIN colors col ON col.id = v.color_id
        WHERE v.product_id = p.id AND col.slug = ANY($${n}::text[])
      )`,
      filters.color,
    );
  }

  if (filters.size?.length && exclude !== "size") {
    add(
      (n) => `EXISTS (
        SELECT 1 FROM product_variants v
        WHERE v.product_id = p.id AND v.size = ANY($${n}::text[])
      )`,
      filters.size,
    );
  }

  if (filters.priceMin !== undefined && exclude !== "price") {
    add((n) => `p.price >= $${n}`, filters.priceMin);
  }

  if (filters.priceMax !== undefined && exclude !== "price") {
    add((n) => `p.price <= $${n}`, filters.priceMax);
  }

  if (filters.inStock) {
    conditions.push(`EXISTS (
      SELECT 1 FROM product_variants v
      WHERE v.product_id = p.id AND v.stock > 0
    )`);
  }

  if (filters.q) {
    // ILIKE — поиск без учёта регистра. % по краям = "содержит"
    add((n) => `p.name ILIKE $${n}`, `%${filters.q}%`);
  }

  return { where: `WHERE ${conditions.join(" AND ")}`, values };
}

/** Сортировки заданы списком, а не подставляются из запроса:
 *  имя колонки нельзя передать через $1, и склейка тут открыла бы инъекцию */
const ORDER_BY: Record<ProductSort, string> = {
  popular: "p.rating_count DESC, p.id",
  rating: "p.rating DESC, p.id",
  price_asc: "p.price ASC, p.id",
  price_desc: "p.price DESC, p.id",
  newest: "p.created_at DESC, p.id",
};

export async function findMany(
  filters: ProductFilters,
  sort: ProductSort,
  limit: number,
  offset: number,
): Promise<ProductListItem[]> {
  const { where, values } = buildWhere(filters);

  const result = await db.query<ProductListItem>(
    `SELECT ${LIST_FIELDS}
     ${JOINS}
     ${where}
     ORDER BY ${ORDER_BY[sort]}
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset],
  );

  return result.rows;
}

export async function countMany(filters: ProductFilters): Promise<number> {
  const { where, values } = buildWhere(filters);

  const result = await db.query<{ count: string }>(
    `SELECT count(*) AS count ${JOINS} ${where}`,
    values,
  );

  return Number(result.rows[0].count);
}

export async function findBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const result = await db.query<ProductDetail>(
    `SELECT ${LIST_FIELDS}, p.description, p.specs
     ${JOINS}
     WHERE p.slug = $1`,
    [slug],
  );

  const product = result.rows[0];

  if (!product) {
    return null;
  }

  const [variants, images] = await Promise.all([
    findVariants(product.id),
    findImages(product.id),
  ]);

  return { ...product, variants, images };
}

export async function findVariants(
  productId: number,
): Promise<ProductVariant[]> {
  const result = await db.query<ProductVariant>(
    `SELECT
       v.id,
       v.sku,
       v.size,
       col.slug AS "colorSlug",
       col.name AS "colorName",
       col.hex  AS "colorHex",
       v.stock,
       v.price_diff AS "priceDiff"
     FROM product_variants v
     LEFT JOIN colors col ON col.id = v.color_id
     WHERE v.product_id = $1
     ORDER BY v.size, col.name`,
    [productId],
  );

  return result.rows;
}

export async function findImages(productId: number): Promise<ProductImage[]> {
  const result = await db.query<ProductImage>(
    `SELECT id, path, alt, is_main AS "isMain"
     FROM product_images
     WHERE product_id = $1
     ORDER BY is_main DESC, sort_order`,
    [productId],
  );

  return result.rows;
}

/** Похожие товары: та же категория, кроме самого товара.
 *  Принимает slug, а не id — чтобы не тянуть репозиторий категорий */
export async function findSimilar(
  productId: number,
  categorySlug: string | null,
  limit: number,
): Promise<ProductListItem[]> {
  const result = await db.query<ProductListItem>(
    `SELECT ${LIST_FIELDS}
     ${JOINS}
     WHERE p.is_active = true
       AND p.id <> $1
       AND ($2::text IS NULL OR c.slug = $2)
     ORDER BY p.rating DESC, p.id
     LIMIT $3`,
    [productId, categorySlug, limit],
  );

  return result.rows;
}

/**
 * Ключ фильтра, который надо ИСКЛЮЧИТЬ при подсчёте.
 *
 * Зачем: считая, сколько товаров у каждого бренда, нельзя применять
 * уже выбранный фильтр по бренду — иначе в списке останется один
 * выбранный, и переключиться будет некуда. Это называется фасетным
 * подсчётом: каждый фильтр считается с учётом всех остальных, кроме себя.
 */
type FacetKey =
  | "category"
  | "brand"
  | "color"
  | "frame"
  | "size"
  | "price";

export async function findPriceRange(
  filters: ProductFilters,
): Promise<{ min: number; max: number }> {
  const { where, values } = buildWhere(filters, "price");

  const result = await db.query<{ min: string | null; max: string | null }>(
    `SELECT min(p.price) AS min, max(p.price) AS max ${JOINS} ${where}`,
    values,
  );

  const row = result.rows[0];

  return {
    min: Number(row.min ?? 0),
    max: Number(row.max ?? 0),
  };
}

export async function countByBrand(filters: ProductFilters) {
  const { where, values } = buildWhere(filters, "brand");

  const result = await db.query<{
    slug: string;
    name: string;
    count: string;
  }>(
    `SELECT b.slug, b.name, count(*) AS count
     ${JOINS} ${where} AND b.id IS NOT NULL
     GROUP BY b.slug, b.name
     ORDER BY b.name`,
    values,
  );

  return result.rows.map((r) => ({ ...r, count: Number(r.count) }));
}

export async function countByFrame(filters: ProductFilters) {
  const { where, values } = buildWhere(filters, "frame");

  const result = await db.query<{
    slug: string;
    name: string;
    count: string;
  }>(
    `SELECT fm.slug, fm.name, count(*) AS count
     ${JOINS} ${where} AND fm.id IS NOT NULL
     GROUP BY fm.slug, fm.name
     ORDER BY fm.name`,
    values,
  );

  return result.rows.map((r) => ({ ...r, count: Number(r.count) }));
}

export async function countByColor(filters: ProductFilters) {
  const { where, values } = buildWhere(filters, "color");

  // DISTINCT p.id: у товара несколько вариантов одного цвета,
  // без него он посчитался бы дважды
  const result = await db.query<{
    slug: string;
    name: string;
    hex: string | null;
    count: string;
  }>(
    `SELECT col.slug, col.name, col.hex, count(DISTINCT p.id) AS count
     ${JOINS}
     JOIN product_variants v ON v.product_id = p.id
     JOIN colors col         ON col.id = v.color_id
     ${where}
     GROUP BY col.slug, col.name, col.hex
     ORDER BY col.name`,
    values,
  );

  return result.rows.map((r) => ({ ...r, count: Number(r.count) }));
}

export async function countBySize(filters: ProductFilters) {
  const { where, values } = buildWhere(filters, "size");

  const result = await db.query<{ value: string; count: string }>(
    `SELECT v.size AS value, count(DISTINCT p.id) AS count
     ${JOINS}
     JOIN product_variants v ON v.product_id = p.id
     ${where} AND v.size IS NOT NULL
     GROUP BY v.size
     ORDER BY v.size`,
    values,
  );

  return result.rows.map((r) => ({ ...r, count: Number(r.count) }));
}
