import type { PoolClient } from "pg";
import { db } from "../../config/db";

const categories = [
  {
    slug: "bicycles",
    name: "Велосипеды",
    children: [
      { slug: "mountain", name: "Горные велосипеды" },
      { slug: "road", name: "Шоссейные велосипеды" },
      { slug: "kids", name: "Детские велосипеды" },
    ],
  },
  {
    slug: "parts",
    name: "Запчасти",
    children: [
      { slug: "wheels", name: "Колёса" },
      { slug: "chains", name: "Цепи" },
      { slug: "brakes", name: "Тормоза" },
    ],
  },
  {
    slug: "equipment",
    name: "Экипировка",
    children: [
      { slug: "jackets", name: "Велокуртки" },
      { slug: "shorts", name: "Велотрусы" },
      { slug: "thermal", name: "Термобелье" },
      { slug: "shoes", name: "Велообувь" },
      { slug: "helmets", name: "Велошлемы" },
      { slug: "gloves", name: "Велоперчатки" },
      { slug: "glasses", name: "Очки" },
    ],
  },
  {
    slug: "accessories",
    name: "Аксессуары",
    children: [
      { slug: "bags", name: "Сумки" },
      { slug: "lights", name: "Фонари" },
    ],
  },
  {
    slug: "trainers",
    name: "Велостанки",
    children: [],
  },
];

async function seedCategories(client: PoolClient) {
  for (const [parentIndex, parent] of categories.entries()) {
    const result = await client.query<{ id: number }>(
      `INSERT INTO categories (slug, name, sort_order)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [parent.slug, parent.name, parentIndex],
    );

    const parentId = result.rows[0].id;

    for (const [childIndex, child] of parent.children.entries()) {
      await client.query(
        `INSERT INTO categories (slug, name, parent_id, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [child.slug, child.name, parentId, childIndex],
      );
    }
  }

  console.log("категории засеяны");
}

// Бренды и модели велосипедов

const brands = [
  {
    slug: "bianchi",
    name: "Bianchi",
    country: "Italy",
    logo_path: null,
  },
  {
    slug: "trek",
    name: "Trek",
    country: "USA",
    logo_path: null,
  },
  {
    slug: "scott",
    name: "Scott",
    country: "Switzerland",
    logo_path: null,
  },
  {
    slug: "orbea",
    name: "Orbea",
    country: "Spain",
    logo_path: null,
  },
  {
    slug: "look",
    name: "Look",
    country: "France",
    logo_path: null,
  },
];

async function seedBrands(client: PoolClient) {
  for (const brand of brands) {
    await client.query(
      `INSERT INTO brands (slug, name, country, logo_path)
             VALUES ($1, $2, $3, $4)`,
      [brand.slug, brand.name, brand.country, brand.logo_path],
    );
  }
}

// материалы рамы

const frameMaterials = [
  { slug: "carbon", name: "Карбон" },
  { slug: "aluminium", name: "Алюминий" },
  { slug: "steel", name: "Сталь" },
  { slug: "titanium", name: "Титан" },
];

async function seedFrameMaterials(client: PoolClient) {
  for (const material of frameMaterials) {
    await client.query(
      `INSERT INTO frame_materials (slug, name)
       VALUES ($1, $2)`,
      [material.slug, material.name],
    );
  }
}

// цвета
// hex нужен, чтобы фильтр в каталоге рисовал цветной кружок

const colors = [
  { slug: "black", name: "Чёрный", hex: "#000000" },
  { slug: "white", name: "Белый", hex: "#FFFFFF" },
  { slug: "grey", name: "Серый", hex: "#808080" },
  { slug: "silver", name: "Серебристый", hex: "#C0C0C0" },
  { slug: "red", name: "Красный", hex: "#E53935" },
  { slug: "orange", name: "Оранжевый", hex: "#F57520" },
  { slug: "yellow", name: "Жёлтый", hex: "#FDD835" },
  { slug: "green", name: "Зелёный", hex: "#43A047" },
  { slug: "blue", name: "Синий", hex: "#1E88E5" },
  { slug: "celeste", name: "Бирюзовый", hex: "#5FD5C8" },
];

async function seedColors(client: PoolClient) {
  for (const color of colors) {
    await client.query(
      `INSERT INTO colors (slug, name, hex)
       VALUES ($1, $2, $3)`,
      [color.slug, color.name, color.hex],
    );
  }
}

// продукты
// slug совпадает с именем файла картинки — так их проще связать

const products = [
  {
    slug: "look-977",
    name: "Look 977 BLACK FLUO YELLOW GREEN XT 2x11S AMC 2018",
    description:
      "Профессиональный гоночный хардтейл для кросс-кантри. Карбоновая рама, оборудование Shimano XT.",
    price: 649110,
    old_price: null,
    categorySlug: "mountain",
    brandSlug: "look",
    country: "France",
    frameSlug: "carbon",
    rating: 4.8,
    rating_count: 12,
    specs: {
      Год: 2018,
      "Диаметр колеса": "29",
      Вилка: "Rockshox SID",
      Трансмиссия: "Shimano XT 2x11",
      "Тип тормозов": "Дисковые гидравлические",
    },
  },
  {
    slug: "scott-scale-700-sl",
    name: "Scott Scale 700 SL 2016",
    description:
      "Лёгкий карбоновый хардтейл для марафонов. Колёса 27.5, вес рамы менее 1 кг.",
    price: 629100,
    old_price: null,
    categorySlug: "mountain",
    brandSlug: "scott",
    country: "Switzerland",
    frameSlug: "carbon",
    rating: 4.7,
    rating_count: 9,
    specs: {
      Год: 2016,
      "Диаметр колеса": "27.5",
      Вилка: "Fox 32 Float",
      Трансмиссия: "Shimano XTR 2x11",
      "Тип тормозов": "Дисковые гидравлические",
    },
  },
  {
    slug: "scott-scale-700-rs",
    name: "Scott Scale 700 RS 2016",
    description:
      "Гоночный хардтейл с карбоновой рамой и агрессивной геометрией для кросс-кантри.",
    price: 435600,
    old_price: 532000,
    categorySlug: "mountain",
    brandSlug: "scott",
    country: "Switzerland",
    frameSlug: "carbon",
    rating: 4.6,
    rating_count: 15,
    specs: {
      Год: 2016,
      "Диаметр колеса": "27.5",
      Вилка: "Rockshox Reba",
      Трансмиссия: "Shimano SLX 2x10",
      "Тип тормозов": "Дисковые гидравлические",
    },
  },
  {
    slug: "orbea-alma-h30",
    name: "Orbea ALMA H30 2021",
    description:
      "Алюминиевый хардтейл для кросс-кантри. Надёжное оборудование, лёгкая рама.",
    price: 153400,
    old_price: 163211,
    categorySlug: "mountain",
    brandSlug: "orbea",
    country: "Spain",
    frameSlug: "aluminium",
    rating: 4.5,
    rating_count: 23,
    specs: {
      Год: 2021,
      "Диаметр колеса": "29",
      Вилка: "Rockshox Judy",
      Трансмиссия: "Shimano Deore 1x11",
      "Тип тормозов": "Дисковые гидравлические",
    },
  },
  {
    slug: "trek-marlin-4-anthracite",
    name: "Trek Marlin 4 Matte Anthracite ATB 29 2022",
    description:
      "Универсальный горный велосипед для города и лёгкого бездорожья. Колёса 29 дюймов.",
    price: 71499,
    old_price: null,
    categorySlug: "mountain",
    brandSlug: "trek",
    country: "USA",
    frameSlug: "aluminium",
    rating: 4.3,
    rating_count: 41,
    specs: {
      Год: 2022,
      "Диаметр колеса": "29",
      Вилка: "SR Suntour XCE",
      Трансмиссия: "Shimano Tourney 3x7",
      "Тип тормозов": "Дисковые механические",
    },
  },
  {
    slug: "trek-marlin-5-lithium",
    name: "Trek Marlin 5 Lithium Grey Chrome ATB 27.5 2022",
    description:
      "Горный велосипед начального уровня с дисковыми тормозами и амортизационной вилкой.",
    price: 84499,
    old_price: null,
    categorySlug: "mountain",
    brandSlug: "trek",
    country: "USA",
    frameSlug: "aluminium",
    rating: 4.4,
    rating_count: 37,
    specs: {
      Год: 2022,
      "Диаметр колеса": "27.5",
      Вилка: "SR Suntour XCT",
      Трансмиссия: "Shimano Altus 3x8",
      "Тип тормозов": "Дисковые гидравлические",
    },
  },
  {
    slug: "trek-dual-sport-2",
    name: "Trek Dual Sport 2 Mulsanne Hybd 2022",
    description:
      "Гибридный велосипед для города и грунтовых дорог. Быстрый на асфальте, уверенный на грунте.",
    price: 90968,
    old_price: null,
    categorySlug: "road",
    brandSlug: "trek",
    country: "USA",
    frameSlug: "aluminium",
    rating: 4.5,
    rating_count: 18,
    specs: {
      Год: 2022,
      "Диаметр колеса": "700C",
      Вилка: "SR Suntour NEX",
      Трансмиссия: "Shimano Acera 3x9",
      "Тип тормозов": "Дисковые гидравлические",
    },
  },
  {
    slug: "bianchi-aria-tt",
    name: "Bianchi Aria TT 2021",
    description:
      "Разделочный велосипед для триатлона. Аэродинамическая карбоновая рама, фирменный цвет celeste.",
    price: 512000,
    old_price: null,
    categorySlug: "road",
    brandSlug: "bianchi",
    country: "Italy",
    frameSlug: "carbon",
    rating: 4.9,
    rating_count: 7,
    specs: {
      Год: 2021,
      "Диаметр колеса": "700C",
      Вилка: "Bianchi Aero Carbon",
      Трансмиссия: "Shimano Ultegra 2x11",
      "Тип тормозов": "Ободные",
    },
  },
  {
    slug: "orbea-rude-10",
    name: "Orbea RUDE 10 Чёрный 2022",
    description:
      "BMX для трюковой езды. Прочная стальная рама, усиленные колёса 20 дюймов.",
    price: 89100,
    old_price: 99000,
    categorySlug: "kids",
    brandSlug: "orbea",
    country: "Spain",
    frameSlug: "steel",
    rating: 4.2,
    rating_count: 5,
    specs: {
      Год: 2022,
      "Диаметр колеса": "20",
      Вилка: "Жёсткая стальная",
      Трансмиссия: "Односкоростная",
      "Тип тормозов": "U-brake",
    },
  },
];

async function seedProducts(client: PoolClient) {
  for (const product of products) {
    await client.query(
      `INSERT INTO products (
         slug, name, description, price, old_price,
         category_id, brand_id, country, frame_material_id,
         rating, rating_count, specs
       )
       VALUES (
         $1, $2, $3, $4, $5,
         (SELECT id FROM categories      WHERE slug = $6),
         (SELECT id FROM brands          WHERE slug = $7),
         $8,
         (SELECT id FROM frame_materials WHERE slug = $9),
         $10, $11, $12
       )`,
      [
        product.slug,
        product.name,
        product.description,
        product.price,
        product.old_price,
        product.categorySlug,
        product.brandSlug,
        product.country,
        product.frameSlug,
        product.rating,
        product.rating_count,
        product.specs,
      ],
    );
  }

  console.log("товары засеяны");
}

// варианты: размер + цвет + наличие
// часть строк со stock: 0 — иначе не проверить фильтр «только в наличии»

const variants = [
  { productSlug: "look-977", size: "M", colorSlug: "black", stock: 2 },
  { productSlug: "look-977", size: "L", colorSlug: "black", stock: 0 },
  { productSlug: "look-977", size: "XL", colorSlug: "black", stock: 1, priceDiff: 15000 },

  { productSlug: "scott-scale-700-sl", size: "M", colorSlug: "yellow", stock: 3 },
  { productSlug: "scott-scale-700-sl", size: "L", colorSlug: "yellow", stock: 0 },

  { productSlug: "scott-scale-700-rs", size: "S", colorSlug: "orange", stock: 1 },
  { productSlug: "scott-scale-700-rs", size: "M", colorSlug: "orange", stock: 4 },

  { productSlug: "orbea-alma-h30", size: "M", colorSlug: "white", stock: 5 },
  { productSlug: "orbea-alma-h30", size: "L", colorSlug: "white", stock: 2 },

  { productSlug: "trek-marlin-4-anthracite", size: "S", colorSlug: "grey", stock: 0 },
  { productSlug: "trek-marlin-4-anthracite", size: "M", colorSlug: "grey", stock: 7 },
  { productSlug: "trek-marlin-4-anthracite", size: "L", colorSlug: "grey", stock: 3 },

  { productSlug: "trek-marlin-5-lithium", size: "M", colorSlug: "silver", stock: 6 },
  { productSlug: "trek-marlin-5-lithium", size: "L", colorSlug: "silver", stock: 0 },

  { productSlug: "trek-dual-sport-2", size: "M", colorSlug: "black", stock: 4 },
  { productSlug: "trek-dual-sport-2", size: "L", colorSlug: "black", stock: 2 },

  { productSlug: "bianchi-aria-tt", size: "M", colorSlug: "celeste", stock: 1 },
  { productSlug: "bianchi-aria-tt", size: "L", colorSlug: "celeste", stock: 0 },

  // у BMX один размер — size остаётся null
  { productSlug: "orbea-rude-10", size: null, colorSlug: "black", stock: 3 },
];

async function seedVariants(client: PoolClient) {
  for (const variant of variants) {
    // артикул: LOOK-977-M-BLACK
    const sku = [variant.productSlug, variant.size, variant.colorSlug]
      .filter(Boolean)
      .join("-")
      .toUpperCase();

    await client.query(
      `INSERT INTO product_variants (product_id, sku, size, color_id, stock, price_diff)
       VALUES (
         (SELECT id FROM products WHERE slug = $1),
         $2,
         $3,
         (SELECT id FROM colors WHERE slug = $4),
         $5,
         $6
       )`,
      [
        variant.productSlug,
        sku,
        variant.size,
        variant.colorSlug,
        variant.stock,
        "priceDiff" in variant ? variant.priceDiff : 0,
      ],
    );
  }

  console.log("варианты засеяны");
}

// картинки: slug товара совпадает с именем файла в uploads/products/

const images = [
  { productSlug: "look-977", alt: "Look 977, вид сбоку" },
  { productSlug: "scott-scale-700-sl", alt: "Scott Scale 700 SL, вид сбоку" },
  { productSlug: "scott-scale-700-rs", alt: "Scott Scale 700 RS, вид сбоку" },
  { productSlug: "orbea-alma-h30", alt: "Orbea Alma H30, вид сбоку" },
  { productSlug: "trek-marlin-4-anthracite", alt: "Trek Marlin 4, вид сбоку" },
  { productSlug: "trek-marlin-5-lithium", alt: "Trek Marlin 5, вид сбоку" },
  { productSlug: "trek-dual-sport-2", alt: "Trek Dual Sport 2, вид сбоку" },
  { productSlug: "bianchi-aria-tt", alt: "Bianchi Aria TT, вид сбоку" },
  { productSlug: "orbea-rude-10", alt: "Orbea Rude 10, вид сбоку" },
];

async function seedImages(client: PoolClient) {
  for (const image of images) {
    await client.query(
      `INSERT INTO product_images (product_id, path, alt, sort_order, is_main)
       VALUES (
         (SELECT id FROM products WHERE slug = $1),
         $2,
         $3,
         0,
         true
       )`,
      [image.productSlug, `products/${image.productSlug}.webp`, image.alt],
    );
  }

  console.log("картинки засеяны");
}

async function main() {
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `TRUNCATE categories, brands, colors, frame_materials, products
       RESTART IDENTITY CASCADE`,
    );

    // порядок важен: сначала справочники, потом то, что на них ссылается
    await seedCategories(client);
    await seedBrands(client);
    await seedColors(client);
    await seedFrameMaterials(client);
    await seedProducts(client);
    await seedVariants(client);
    await seedImages(client);

    await client.query("COMMIT");
    console.log("готово");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("упало, откатываю:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await db.end();
  }
}

main();
