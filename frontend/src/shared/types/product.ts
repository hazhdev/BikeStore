export type Product = {
  id: number;
  slug: string;
  name: string;
  price: string; // ← строка, не число!
  oldPrice: string | null;
  rating: string;
  ratingCount: number;
  country: string | null;
  countryCode: string | null;
  brandSlug: string | null;
  brandName: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  frameSlug: string | null;
  frameName: string | null;
  image: string | null; // ← у восьми товаров null
  inStock: boolean;
};

export type ProductsResponse = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FacetOption = {
  slug: string;
  name: string;
  count: number;
};

export type Facets = {
  price: { min: number; max: number };
  brands: FacetOption[];
  frames: FacetOption[];
  colors: (FacetOption & { hex: string | null })[];
  sizes: { value: string; count: number }[];
};
