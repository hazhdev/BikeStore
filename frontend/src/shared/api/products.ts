import { apiClient } from "./client";
import type { ProductsResponse } from "../types/product";

export function getProducts(category?: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  const query = params.toString();
  const path = query ? `/products?${query}` : "/products";

  return apiClient<ProductsResponse>(path);
}
