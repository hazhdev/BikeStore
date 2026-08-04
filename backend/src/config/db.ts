import pg from "pg";
import { env } from "./env";

const { Pool } = pg;

/**
 * Один пул соединений на всё приложение.
 * Пул — это набор заранее открытых подключений к базе: открывать
 * новое на каждый запрос дорого, поэтому их переиспользуют.
 */
export const db = new Pool({
  connectionString: env.databaseUrl,
});
