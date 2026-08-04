import fastify from "fastify";

import { authRoutes } from "./modules/auth/auth.routes";
import { registerPlugins } from "./plugins";

/**
 * Сборка приложения: плагины + модули.
 * Здесь НЕТ запуска сервера — это отдельная забота (server.ts).
 * Такое разделение позволит потом писать тесты: тесты собирают
 * приложение и дёргают его напрямую, без реального порта.
 */
export function buildApp() {
  const app = fastify({ logger: true });

  registerPlugins(app);

  app.register(authRoutes, { prefix: "/api" });

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
