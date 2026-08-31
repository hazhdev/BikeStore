import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useExpandable } from "@/shared/lib/useExpandable";
import type { CategoryTree } from "@/shared/types/category";
import type { Facets } from "@/shared/types/product";
import "./FiltersSidebar.scss";

type FiltersSidebarProps = {
  facets: Facets;
  categories: CategoryTree[];
};

const LIMIT = 5;

/** квадратик у категории: у активной он закрашен */
function boxClass(isActive: boolean): string {
  return isActive ? "filters__box filters__box--checked" : "filters__box";
}

export function FiltersSidebar({ facets, categories }: FiltersSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  // категория лежит в адресе (/catalog/mountain), а не в query,
  // поэтому берём её useParams, а не useSearchParams
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const selectedBrands = searchParams.getAll("brand");
  const selectedColors = searchParams.getAll("color");
  const selectedFrames = searchParams.getAll("frame");

  // у каждого блока своё состояние «развёрнут / свёрнут»
  const cats = useExpandable(categories, LIMIT);
  const brands = useExpandable(facets.brands, LIMIT);
  const colors = useExpandable(facets.colors, LIMIT);
  const frames = useExpandable(facets.frames, LIMIT);

  function resetFilters() {
    navigate("/catalog");
  }

  function toggle(name: string, value: string) {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll(name);

    next.delete(name);

    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    updated.forEach((item) => next.append(name, item));

    setSearchParams(next);
  }

  return (
    <aside className="filters">
      <details className="filters__group" open>
        <summary className="filters__summary">Категории</summary>

        <ul className="filters__list">
          {cats.visible.map((parent) => (
            <li key={parent.slug}>
              <Link
                className="filters__item filters__link"
                to={`/catalog/${parent.slug}`}
                aria-current={categorySlug === parent.slug ? "page" : undefined}
              >
                <span className={boxClass(categorySlug === parent.slug)} />
                {parent.name}
              </Link>

              {parent.children.length > 0 && (
                <ul className="filters__sublist">
                  {parent.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        className="filters__item filters__link filters__link--child"
                        to={`/catalog/${child.slug}`}
                        aria-current={
                          categorySlug === child.slug ? "page" : undefined
                        }
                      >
                        <span
                          className={boxClass(categorySlug === child.slug)}
                        />
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {cats.canExpand && (
          <button className="filters__more" type="button" onClick={cats.toggle}>
            {cats.isExpanded ? "Свернуть" : `Показать ещё ${cats.hiddenCount}`}
          </button>
        )}
      </details>

      <details className="filters__group" open>
        <summary className="filters__summary">Бренд</summary>

        <ul className="filters__list">
          {brands.visible.map((brand) => (
            <li key={brand.slug}>
              <label className="filters__item">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => toggle("brand", brand.slug)}
                />
                <span className="filters__box" />
                <span className="filters__name">{brand.name}</span>
                <span className="filters__count">({brand.count})</span>
              </label>
            </li>
          ))}
        </ul>

        {brands.canExpand && (
          <button
            className="filters__more"
            type="button"
            onClick={brands.toggle}
          >
            {brands.isExpanded
              ? "Свернуть"
              : `Показать ещё ${brands.hiddenCount}`}
          </button>
        )}
      </details>

      <details className="filters__group" open>
        <summary className="filters__summary">Материал рамы</summary>

        <ul className="filters__list">
          {frames.visible.map((frame) => (
            <li key={frame.slug}>
              <label className="filters__item">
                <input
                  type="checkbox"
                  checked={selectedFrames.includes(frame.slug)}
                  onChange={() => toggle("frame", frame.slug)}
                />
                <span className="filters__box" />
                <span className="filters__name">{frame.name}</span>
                <span className="filters__count">({frame.count})</span>
              </label>
            </li>
          ))}
        </ul>

        {frames.canExpand && (
          <button
            className="filters__more"
            type="button"
            onClick={frames.toggle}
          >
            {frames.isExpanded
              ? "Свернуть"
              : `Показать ещё ${frames.hiddenCount}`}
          </button>
        )}
      </details>

      <details className="filters__group" open>
        <summary className="filters__summary">Цвет</summary>

        <ul className="filters__list-colors">
          {colors.visible.map((color) => (
            <li key={color.slug}>
              <label className="filters__item" title={color.name}>
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color.slug)}
                  onChange={() => toggle("color", color.slug)}
                />
                <span
                  className="filters__swatch"
                  style={{ background: color.hex ?? "#ccc" }}
                />
              </label>
            </li>
          ))}
        </ul>

        {colors.canExpand && (
          <button
            className="filters__more"
            type="button"
            onClick={colors.toggle}
          >
            {colors.isExpanded
              ? "Свернуть"
              : `Показать ещё ${colors.hiddenCount}`}
          </button>
        )}
      </details>

      <button className="filters__reset" type="button" onClick={resetFilters}>
        Сбросить фильтры
      </button>
    </aside>
  );
}
