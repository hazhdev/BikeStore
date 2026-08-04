// HTTP-слой: пути, схемы, коды ответов. Ни SQL, ни бизнес-правил.
//
// Маршруты:
//   GET    /categories        — дерево категорий для меню и фильтров
//   GET    /categories/:slug  — одна категория
//   POST   /categories        — создать   (requireAuth + requireRole("admin"))
//   PATCH  /categories/:id    — изменить  (то же)
//   DELETE /categories/:id    — удалить   (то же)
//
// Подключить в app.ts:  app.register(categoriesRoutes, { prefix: "/api" })
