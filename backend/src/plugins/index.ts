import path from "node:path";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifyStatic from "@fastify/static";
import type { FastifyInstance } from "fastify";

import { env } from "../config/env";

/**
 * Все сторонние плагины в одном месте.
 *
 * Порядок важен: плагин, зарегистрированный позже, не виден тем,
 * что зарегистрированы раньше. Поэтому jwt подключается здесь,
 * до модулей с маршрутами.
 */
export function registerPlugins(app: FastifyInstance) {
  app.register(cors, {
    origin: env.corsOrigin,
    credentials: true,
  });

  app.register(cookie, {
    secret: env.cookieSecret,
  });

  app.register(jwt, {
    secret: env.jwtSecret,
  });

  // Раздача загруженных файлов: backend/uploads доступна как /uploads/...
  // Путь считаем от этого файла, а не от текущей папки запуска —
  // иначе сервер сломается, если запустить его не из backend/.
  app.register(fastifyStatic, {
    root: path.resolve(__dirname, "../../uploads"),
    prefix: "/uploads/",
    // список файлов в папке наружу не отдаём
    index: false,
    list: false,
  });
}
