import fastify, { type FastifyError } from "fastify";

import { authRoutes } from "./modules/auth/auth.routes";
import { brandsRoutes } from "./modules/brands/brands.routes";
import { categoriesRoutes } from "./modules/categories/categories.routes";
import { productsRoutes } from "./modules/products/products.routes";
import { registerPlugins } from "./plugins";
import { AppError } from "./shared/errors/AppError";

/**
 * Сборка приложения: плагины + модули.
 * Здесь НЕТ запуска сервера — это отдельная забота (server.ts).
 * Такое разделение позволит потом писать тесты: тесты собирают
 * приложение и дёргают его напрямую, без реального порта.
 */
export function buildApp() {
  const app = fastify({ logger: true });

  registerPlugins(app);

  /**
   * Один обработчик ошибок на всё приложение.
   * Роутам больше не нужен try/catch: сервис бросает AppError,
   * Fastify ловит его здесь и превращает в ответ.
   */
  // тип ошибки указан явно: в Fastify 5 по умолчанию тут unknown
  app.setErrorHandler<FastifyError>((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    // ошибки валидации схемы Fastify помечает статусом сам
    if (error.statusCode && error.statusCode < 500) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    request.log.error(error);
    return reply.code(500).send({ message: "Внутренняя ошибка сервера" });
  });

  app.register(authRoutes, { prefix: "/api" });
  app.register(categoriesRoutes, { prefix: "/api" });
  app.register(brandsRoutes, { prefix: "/api" });
  app.register(productsRoutes, { prefix: "/api" });

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
