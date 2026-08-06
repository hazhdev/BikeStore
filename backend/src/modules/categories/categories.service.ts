import { AppError } from "../../shared/errors/AppError";
import { findAll, findBySlug } from "./categories.repository";
import type { Category, CategoryTree } from "./categories.types";

// Бизнес-логика. Не знает ни про HTTP, ни про SQL.

export async function getCategoryTree(): Promise<CategoryTree[]> {
  const categories = await findAll();

  // Первый проход: создаём узел для каждой категории.
  // Нужен отдельно, потому что в списке ребёнок может встретиться
  // раньше своего родителя.
  const categoryMap: Record<number, CategoryTree> = {};

  categories.forEach((category) => {
    categoryMap[category.id] = { ...category, children: [] };
  });

  // Второй проход: связываем узлы между собой
  const rootCategories: CategoryTree[] = [];

  categories.forEach((category) => {
    // именно !== null: у ноля тоже "ложное" значение,
    // и проверка на истинность однажды спрячет настоящий id
    if (category.parentId !== null) {
      const parentCategory = categoryMap[category.parentId];

      if (parentCategory) {
        parentCategory.children.push(categoryMap[category.id]);
      }
    } else {
      rootCategories.push(categoryMap[category.id]);
    }
  });

  return rootCategories;
}

export async function getBySlug(slug: string): Promise<Category> {
  const category = await findBySlug(slug);

  if (!category) {
    throw new AppError(404, "Категория не найдена");
  }

  return category;
}
