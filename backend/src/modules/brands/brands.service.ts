import { AppError } from "../../shared/errors/AppError";
import { findAll, findBySlug } from "./brands.repository";
import type { Brand } from "./brands.types";

export async function getBrands(): Promise<Brand[]> {
  return findAll();
}

export async function getBrandBySlug(slug: string): Promise<Brand> {
  const brand = await findBySlug(slug);

  if (!brand) {
    throw new AppError(404, "Бренд не найден");
  }

  return brand;
}
