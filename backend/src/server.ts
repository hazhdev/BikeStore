import { buildApp } from "./app";
import { env } from "./config/env";

/**
 * Точка входа. Единственная задача — поднять собранное приложение
 * на порту и красиво упасть, если не вышло.
 */
const app = buildApp();

app.listen({ port: env.port, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
