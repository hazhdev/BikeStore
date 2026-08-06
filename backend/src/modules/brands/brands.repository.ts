import { db } from "../../config/db";
import type { Brand } from "./brands.types";

const BRAND_FIELDS = `
  id,
  slug,
  name,
  country,
  logo_path AS "logoPath"
`;

export async function findAll(): Promise<Brand[]> {
  const result = await db.query<Brand>(
    `SELECT ${BRAND_FIELDS}
     FROM brands
     ORDER BY name`,
  );

  return result.rows;
}

export async function findBySlug(slug: string): Promise<Brand | null> {
  const result = await db.query<Brand>(
    `SELECT ${BRAND_FIELDS}
     FROM brands
     WHERE slug = $1`,
    [slug],
  );

  return result.rows[0] ?? null;
}
