import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getFilters } from "@/shared/api/products";
import type { Facets } from "@/shared/types/product";
import { FiltersSidebar } from "@/features/filters/ui/FiltersSidebar";

import { ProductCard } from "@/entities/product/ui/ProductCard";
import { getProducts } from "@/shared/api/products";
import type { Product } from "@/shared/types/product";
import { Nav } from "@/shared/ui/Nav/nav";
import "./CatalogPage.scss";
import { getCategories } from "@/shared/api/categories";
import type { CategoryTree } from "@/shared/types/category";

/**
 * Значение из адреса — в число для запроса.
 * "50000" → 50000, параметра нет (null) → undefined.
 * Через Number() напрямую нельзя: Number(null) даёт 0,
 * и фильтр «от 0» включился бы сам собой и не выключался.
 */
function toNumber(value: string | null): number | undefined {
  if (value === null) {
    return undefined;
  }

  return Number(value);
}

export function CatalogPage() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const brands = searchParams.getAll("brand");
  const colors = searchParams.getAll("color");
  const frames = searchParams.getAll("frame");
  const priceMin = toNumber(searchParams.get("priceMin"));
  const priceMax = toNumber(searchParams.get("priceMax"));

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [facets, setFacets] = useState<Facets | null>(null);
  const [categories, setCategories] = useState<CategoryTree[]>([]);

  useEffect(() => {
    getProducts({
      category: categorySlug,
      brands,
      colors,
      frames,
      priceMin,
      priceMax,
    })
      .then((data) => setProducts(data.items))
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [categorySlug, searchParams]);

  useEffect(() => {
    getFilters({
      category: categorySlug,
      brands,
      colors,
      frames,
      priceMin,
      priceMax,
    })
      .then(setFacets)
      .catch(console.error);
  }, [categorySlug, searchParams]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.categories))
      .catch(console.error);
  }, []);

  return (
    <>
      <Nav />

      <main className="catalog">
        <h1 className="catalog__title">Каталог товаров</h1>

        {isLoading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {!isLoading && !error && (
          <div className="catalog__body">
            {facets && (
              <FiltersSidebar facets={facets} categories={categories} />
            )}

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
