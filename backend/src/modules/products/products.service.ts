import { AppError } from "../../shared/errors/AppError";
import {
  countMany,
  findBySlug,
  findMany,
  findSimilar,
} from "./products.repository";
import type {
  PaginatedProducts,
  ProductDetail,
  ProductListItem,
  ProductListQuery,
} from "./products.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const SIMILAR_LIMIT = 4;

export async function getProductList(
  query: ProductListQuery,
): Promise<PaginatedProducts> {
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? DEFAULT_LIMIT;
  const sort = query.sort ?? "popular";
  const offset = (page - 1) * limit;

  // два запроса вместо одного: товары текущей страницы и общее
  // количество для расчёта числа страниц. Идут параллельно
  const [items, total] = await Promise.all([
    findMany(query, sort, limit, offset),
    countMany(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const product = await findBySlug(slug);

  if (!product) {
    throw new AppError(404, "Товар не найден");
  }

  return product;
}

export async function getSimilarProducts(
  slug: string,
): Promise<ProductListItem[]> {
  const product = await getProductBySlug(slug);

  return findSimilar(product.id, product.categorySlug, SIMILAR_LIMIT);
}
