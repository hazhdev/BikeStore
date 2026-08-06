import type { FastifyInstance } from "fastify";

import { productListSchema, productSlugSchema } from "./products.schema";
import {
  getProductBySlug,
  getProductFacets,
  getProductList,
  getSimilarProducts,
} from "./products.service";
import type { ProductListQuery } from "./products.types";

export function productsRoutes(app: FastifyInstance) {
  // каталог: фильтры, сортировка, пагинация
  app.get<{ Querystring: ProductListQuery }>(
    "/products",
    { schema: productListSchema },
    async (request) => {
      return getProductList(request.query);
    },
  );

  // границы цены и счётчики для блока фильтров.
  // Объявлен ДО /products/:slug — иначе "filters" мог бы попасть в slug
  app.get<{ Querystring: ProductListQuery }>(
    "/products/filters",
    { schema: productListSchema },
    async (request) => {
      return getProductFacets(request.query);
    },
  );

  // карточка товара со всеми характеристиками, вариантами и картинками
  app.get<{ Params: { slug: string } }>(
    "/products/:slug",
    { schema: productSlugSchema },
    async (request) => {
      const product = await getProductBySlug(request.params.slug);
      return { product };
    },
  );

  // блок «Похожие товары» на странице товара
  app.get<{ Params: { slug: string } }>(
    "/products/:slug/similar",
    { schema: productSlugSchema },
    async (request) => {
      const products = await getSimilarProducts(request.params.slug);
      return { products };
    },
  );
}
