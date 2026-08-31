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

export type CategoriesResponse = {
  categories: CategoryTree[];
};
