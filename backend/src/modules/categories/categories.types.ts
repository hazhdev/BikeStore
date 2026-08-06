// Типы модуля: как выглядит категория внутри приложения.
//
// Что описать:
//   Category      — id, slug, название, parentId (для вложенности), порядок
//   CategoryTree  — категория со списком дочерних (для меню и фильтров)
//
// Категории вложенные: Велосипеды → Горные / Шоссейные / Детские.
// Смотри burgerMenuItems в frontend/src/shared/ui/Nav/NavDate.ts

export type Category = {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
  sortOrder: number;
};

export type CategoryTree = Category & {
  children: CategoryTree[];
};
