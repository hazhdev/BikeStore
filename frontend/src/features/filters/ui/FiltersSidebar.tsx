import { useSearchParams } from "react-router-dom";

import type { Facets } from "@/shared/types/product";
import "./FiltersSidebar.scss";

type FiltersSidebarProps = {
  facets: Facets;
};

export function FiltersSidebar({ facets }: FiltersSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedBrands = searchParams.getAll("brand");

  function toggleBrand(slug: string) {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll("brand");

    next.delete("brand");

    const updated = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];

    updated.forEach((item) => next.append("brand", item));

    setSearchParams(next);
  }

  return (
    <aside className="filters">
      <details className="filters__group" open>
        <summary className="filters__summary">Бренд</summary>

        <ul className="filters__list">
          {facets.brands.map((brand) => (
            <li key={brand.slug}>
              <label className="filters__item">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => toggleBrand(brand.slug)}
                />
                <span className="filters__name">{brand.name}</span>
                <span className="filters__count">{brand.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
