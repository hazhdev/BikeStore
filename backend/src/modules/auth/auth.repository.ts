import { db } from "../../config/db";
import type { PublicUser, UserRow } from "./auth.types";

/**
 * Репозиторий — единственный слой, который знает SQL.
 * Ни роуты, ни сервис не должны видеть текст запросов:
 * захотим сменить базу — переписываем только этот файл.
 */

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result = await db.query<UserRow>(
    `
      SELECT id, name, email, role, password_hash
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function insertUser(
  name: string,
  email: string,
  passwordHash: string,
): Promise<PublicUser> {
  const result = await db.query<PublicUser>(
    `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, role
    `,
    [name, email, passwordHash],
  );

  return result.rows[0];
}
