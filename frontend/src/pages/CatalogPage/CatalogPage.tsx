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

export function CatalogPage() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const brands = searchParams.getAll("brand");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [facets, setFacets] = useState<Facets | null>(null);

  useEffect(() => {
    getProducts(categorySlug, brands)
      .then((data) => setProducts(data.items))
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [categorySlug, searchParams]);

  useEffect(() => {
    getFilters(categorySlug, brands).then(setFacets).catch(console.error);
  }, [categorySlug, searchParams]);

  return (
    <>
      <Nav />

      <main className="catalog">
        <h1 className="catalog__title">Каталог товаров</h1>

        {isLoading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {!isLoading && !error && (
          <div className="catalog__body">
            {facets && <FiltersSidebar facets={facets} />}

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
