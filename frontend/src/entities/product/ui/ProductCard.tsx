import { Link } from "react-router-dom";

import type { Product } from "@/shared/types/product";
import "./ProductCard.scss";

type ProductCardProps = {
  product: Product;
};

const FILES_URL = import.meta.env.VITE_FILES_URL;

/** "649110.00" → "649 110 ₽" */
function formatPrice(value: string): string {
  return `${new Intl.NumberFormat("ru-RU").format(Number(value))} ₽`;
}

/** Флаг страны эмодзи — в макете он стоит слева над названием */
const FLAGS: Record<string, string> = {
  France: "🇫🇷",
  USA: "🇺🇸",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  Switzerland: "🇨🇭",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link className="product-card__link" to={`/product/${product.slug}`}>
        {/* мета вынесена НАД картинкой: aspect-ratio у image-box
            должен относиться только к фото, иначе картинке достаётся
            меньше места, чем задано пропорцией */}
        <div className="product-card__meta">
          {/* одна ветка — показать или ничего, поэтому && */}
          {product.country && (
            <span className="product-card__flag">
              {FLAGS[product.country] ?? product.country}
            </span>
          )}

          {product.inStock ? (
            <span className="product-card__stock product-card__stock--in">
              В наличии
            </span>
          ) : (
            <span className="product-card__stock product-card__stock--out">
              Распродано
            </span>
          )}
        </div>

        <div className="product-card__image-box">
          {/* две ветки — картинка или заглушка, поэтому тернарный оператор */}
          {product.image ? (
            <img
              className="product-card__image"
              src={`${FILES_URL}/${product.image}`}
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <div className="product-card__no-image">Нет фото</div>
          )}
        </div>

        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__prices">
          <span className="product-card__price">
            {formatPrice(product.price)}
          </span>

          {product.oldPrice && (
            <span className="product-card__old-price">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
