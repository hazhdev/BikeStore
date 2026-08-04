import "dotenv/config";

/**
 * Единственное место, где читаются переменные окружения.
 * Если чего-то не хватает — приложение падает сразу на старте,
 * а не через час в проде на случайном запросе.
 */
function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Переменная окружения ${name} не задана`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: required("DATABASE_URL"),
  cookieSecret: required("COOKIE_SECRET"),
  jwtSecret: required("JWT_SECRET"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  tokenTtl: process.env.TOKEN_TTL ?? "7d",
};
