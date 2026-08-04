// HTTP-слой товаров.
//
// Маршруты:
//   GET    /products              — каталог: фильтры, сортировка, пагинация
//   GET    /products/:slug        — карточка товара
//   GET    /products/:slug/similar — похожие товары
//   POST   /products              — создать   (requireAuth + requireRole("admin"))
//   PATCH  /products/:id          — изменить  (то же)
//   DELETE /products/:id          — удалить   (то же)
//
// Подключить в app.ts:  app.register(productsRoutes, { prefix: "/api" })
