// Схемы валидации.
//
// Что описать:
//   querystring для GET /products: page, limit, category, brand, color,
//     frameMaterial, size, priceMin, priceMax, inStock, sort
//   params для GET /products/:slug
//   тело для создания и изменения товара (админ)
//
// Осторожно с page и limit: задать максимум для limit,
// иначе клиент запросит миллион строк одним запросом.
