import { apiClient } from "./client";
import type { Facets, ProductsResponse } from "../types/product";

/**
 * Фильтры каталога одним объектом, а не списком аргументов:
 * впереди ещё размер, материал, цена, наличие, сортировка и страница —
 * девять параметров подряд удержать в голове невозможно.
 */
export type ProductQuery = {
  category?: string;
  brands?: string[];
  colors?: string[];
  frames?: string[];
  priceMin?: number;
  priceMax?: number;
};

function buildQuery(query: ProductQuery): string {
  const params = new URLSearchParams();

  if (query.category) {
    params.set("category", query.category);
  }

  if (query.priceMin !== undefined) {
    params.set("priceMin", String(query.priceMin));
  }

  if (query.priceMax !== undefined) {
    params.set("priceMax", String(query.priceMax));
  }

  query.brands?.forEach((brand) => params.append("brand", brand));
  query.colors?.forEach((color) => params.append("color", color));
  query.frames?.forEach((frame) => params.append("frame", frame));

  return params.toString();
}

export function getProducts(query: ProductQuery = {}) {
  const search = buildQuery(query);
  const path = search ? `/products?${search}` : "/products";

  return apiClient<ProductsResponse>(path);
}

export function getFilters(query: ProductQuery = {}) {
  const search = buildQuery(query);
  const path = search ? `/products/filters?${search}` : "/products/filters";

  return apiClient<Facets>(path);
}
