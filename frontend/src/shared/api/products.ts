import { apiClient } from "./client";
import type { Facets, ProductsResponse } from "../types/product";

/**
 * Собирает строку запроса из фильтров.
 * append, а не set: у одного имени может быть несколько значений
 * (?brand=trek&brand=scott), а set затирал бы предыдущее.
 */
function buildQuery(category?: string, brands?: string[]): string {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  brands?.forEach((brand) => params.append("brand", brand));

  return params.toString();
}

export function getProducts(category?: string, brands?: string[]) {
  const query = buildQuery(category, brands);
  const path = query ? `/products?${query}` : "/products";

  return apiClient<ProductsResponse>(path);
}

export function getFilters(category?: string, brands?: string[]) {
  const query = buildQuery(category, brands);
  const path = query ? `/products/filters?${query}` : "/products/filters";

  return apiClient<Facets>(path);
}
