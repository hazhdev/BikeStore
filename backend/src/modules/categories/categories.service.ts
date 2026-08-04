// Бизнес-логика. Не знает ни про HTTP, ни про SQL.
//
// Что понадобится:
//   getCategoryTree() — взять плоский список из репозитория
//                       и собрать из него дерево по parentId
//   getBySlug(slug)   — вернуть категорию или бросить AppError(404)
//
// Ошибки — через AppError из shared/errors/AppError.ts
