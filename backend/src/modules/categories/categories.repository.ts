import { db } from "../../config/db";
import type { Category } from "./categories.types";

// Слой доступа к данным. ЕДИНСТВЕННОЕ место в модуле, где есть SQL.
// Все значения только через $1, $2 — никакой склейки строк.

const CATEGORY_FIELDS = `
  id,
  slug,
  name,
  parent_id  AS "parentId",
  sort_order AS "sortOrder"
`;

export async function findAll(): Promise<Category[]> {
  const result = await db.query<Category>(
    `SELECT ${CATEGORY_FIELDS}
     FROM categories
     ORDER BY sort_order, name`,
  );

  return result.rows;
}

// Тип возврата приписан руками: без него TypeScript считает,
// что rows[0] всегда есть, и null из типа выпадает
export async function findBySlug(slug: string): Promise<Category | null> {
  const result = await db.query<Category>(
    `SELECT ${CATEGORY_FIELDS}
     FROM categories
     WHERE slug = $1`,
    [slug],
  );

  return result.rows[0] ?? null;
}
