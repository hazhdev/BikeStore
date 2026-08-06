import type { FastifyInstance } from "fastify";

import { getBrandBySlug, getBrands } from "./brands.service";

export function brandsRoutes(app: FastifyInstance) {
  // список брендов для фильтра каталога
  app.get("/brands", async () => {
    const brands = await getBrands();
    return { brands };
  });

  app.get<{ Params: { slug: string } }>("/brands/:slug", async (request) => {
    const brand = await getBrandBySlug(request.params.slug);
    return { brand };
  });
}
