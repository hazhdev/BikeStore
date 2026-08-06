/** Товар в списке каталога — без характеристик, только для карточки */
export type ProductListItem = {
  id: number;
  slug: string;
  name: string;
  price: string;
  oldPrice: string | null;
  rating: string;
  ratingCount: number;
  country: string | null;
  brandSlug: string | null;
  brandName: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  frameSlug: string | null;
  frameName: string | null;
  image: string | null;
  inStock: boolean;
};

/** Вариант товара: размер + цвет + наличие */
export type ProductVariant = {
  id: number;
  sku: string | null;
  size: string | null;
  colorSlug: string | null;
  colorName: string | null;
  colorHex: string | null;
  stock: number;
  priceDiff: string;
};

export type ProductImage = {
  id: number;
  path: string;
  alt: string | null;
  isMain: boolean;
};

/** Полная карточка товара */
export type ProductDetail = ProductListItem & {
  description: string | null;
  specs: Record<string, unknown>;
  variants: ProductVariant[];
  images: ProductImage[];
};

export type ProductSort =
  | "popular"
  | "rating"
  | "price_asc"
  | "price_desc"
  | "newest";

/** Что приходит в query-строке каталога */
export type ProductFilters = {
  category?: string;
  brand?: string[];
  color?: string[];
  frame?: string[];
  size?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  q?: string;
};

export type ProductListQuery = ProductFilters & {
  page?: number;
  limit?: number;
  sort?: ProductSort;
};

export type PaginatedProducts = {
  items: ProductListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
