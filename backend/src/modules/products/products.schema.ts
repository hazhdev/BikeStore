/**
 * Схема query-строки каталога.
 *
 * Главное здесь — верхний предел у limit. Без него клиент напишет
 * ?limit=1000000 и положит базу одним запросом.
 *
 * Фильтры-списки (brand, color...) приходят как ?brand=trek&brand=scott,
 * поэтому объявлены массивами строк.
 */

const stringArray = {
  type: "array",
  items: { type: "string", maxLength: 100 },
  maxItems: 20,
};

export const productListSchema = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 60, default: 12 },
      sort: {
        type: "string",
        enum: ["popular", "rating", "price_asc", "price_desc", "newest"],
        default: "popular",
      },
      category: { type: "string", maxLength: 100 },
      brand: stringArray,
      color: stringArray,
      frame: stringArray,
      size: stringArray,
      priceMin: { type: "number", minimum: 0 },
      priceMax: { type: "number", minimum: 0 },
      inStock: { type: "boolean" },
      q: { type: "string", maxLength: 200 },
    },
  },
};

export const productSlugSchema = {
  params: {
    type: "object",
    required: ["slug"],
    additionalProperties: false,
    properties: {
      slug: { type: "string", minLength: 1, maxLength: 255 },
    },
  },
};
