import bcrypt from "bcrypt";

import { AppError } from "../../shared/errors/AppError";
import { findUserByEmail, insertUser } from "./auth.repository";
import type {
  LoginBody,
  PublicUser,
  RegisterBody,
  TokenPayload,
} from "./auth.types";

const SALT_ROUNDS = 10;

/** Код ошибки Postgres при нарушении UNIQUE-ограничения */
const UNIQUE_VIOLATION = "23505";

/**
 * Сервис — бизнес-логика. Он ничего не знает ни про HTTP,
 * ни про SQL: получил данные, проверил правила, вернул результат
 * или бросил AppError.
 */

export async function registerUser(data: RegisterBody): Promise<PublicUser> {
  if (data.password !== data.newpass) {
    throw new AppError(400, "Пароли не совпадают");
  }

  const email = data.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  try {
    return await insertUser(data.name.trim(), email, passwordHash);
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      throw new AppError(409, "Пользователь с такой почтой уже существует");
    }

    throw error;
  }
}

export async function loginUser(data: LoginBody): Promise<PublicUser> {
  const email = data.email.trim().toLowerCase();
  const row = await findUserByEmail(email);

  // Ответ одинаковый и когда почты нет, и когда пароль неверный, —
  // иначе перебором можно узнать, кто зарегистрирован на сайте
  if (!row) {
    throw new AppError(401, "Неверная почта или пароль");
  }

  const isPasswordValid = await bcrypt.compare(data.password, row.password_hash);

  if (!isPasswordValid) {
    throw new AppError(401, "Неверная почта или пароль");
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
}

export function buildTokenPayload(user: PublicUser): TokenPayload {
  return { id: user.id, email: user.email, role: user.role };
}
