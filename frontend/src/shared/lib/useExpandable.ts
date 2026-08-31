import { useState } from "react";

/**
 * Показывает первые `limit` элементов и прячет остальные
 * за кнопкой «Показать ещё».
 *
 * Вынесено в хук, потому что нужно в каждом блоке фильтров:
 * категории, бренды, цвета, размеры, материалы. Логика одна,
 * разметка у всех разная — поэтому хук, а не компонент.
 */
export function useExpandable<T>(items: T[], limit = 5) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visible = isExpanded ? items : items.slice(0, limit);
  const hiddenCount = items.length - limit;

  return {
    visible,
    isExpanded,
    // кнопку показываем, только если есть что прятать
    canExpand: hiddenCount > 0,
    hiddenCount,
    toggle: () => setIsExpanded((prev) => !prev),
  };
}
