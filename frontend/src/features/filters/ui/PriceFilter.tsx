import { useEffect, useState } from "react";

export function PriceFilter() {
  const [max, setMax] = useState<number>();
  const [min, setMin] = useState<number>();

  return (
    <div className="price__filter">
      <input type="number" onChange={(e) => setMax(e.target.value)} />
      <input type="number" onChange={(e) => setMin(e.target.value)} />
    </div>
  );
}
