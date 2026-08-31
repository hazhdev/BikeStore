import type { CategoriesResponse } from "../types/category";
import { apiClient } from "./client";

export function getCategories() {
  return apiClient<CategoriesResponse>(`/categories`);
}
