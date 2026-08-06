import type { FastifyInstance } from "fastify";

import { getBySlug, getCategoryTree } from "./categories.service";

/**
 * HTTP-слой: пути и коды ответов. Ни SQL, ни бизнес-правил.
 *
 * try/catch здесь не нужен: ошибки ловит общий обработчик в app.ts.
 * Сервис бросает AppError — Fastify сам превращает его в ответ.
 */
export function categoriesRoutes(app: FastifyInstance) {
  // дерево категорий для меню и фильтров каталога
  app.get("/categories", async () => {
    const categories = await getCategoryTree();
    return { categories };
  });

  // одна категория по slug
  app.get<{ Params: { slug: string } }>(
    "/categories/:slug",
    async (request) => {
      const category = await getBySlug(request.params.slug);
      return { category };
    },
  );
}
