import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ProductCard } from "@/entities/product/ui/ProductCard";
import { getProducts } from "@/shared/api/products";
import type { Product } from "@/shared/types/product";
import { Nav } from "@/shared/ui/Nav/nav";
import "./CatalogPage.scss";

export function CatalogPage() {
  const { categorySlug } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts(categorySlug)
      .then((data) => setProducts(data.items))
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [categorySlug]);

  return (
    <>
      <Nav />

      <main className="catalog">
        <h1 className="catalog__title">Каталог товаров</h1>

        {isLoading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {!isLoading && !error && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
