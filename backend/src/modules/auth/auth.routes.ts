import type { FastifyInstance } from "fastify";

import { env } from "../../config/env";
import { loginSchema, registerSchema } from "./auth.schema";
import { buildTokenPayload, loginUser, registerUser } from "./auth.service";
import type { LoginBody, RegisterBody } from "./auth.types";

/**
 * Роуты — только HTTP: какой путь, какая схема, какой код ответа.
 * Ни SQL, ни бизнес-правил здесь нет.
 *
 * try/catch не нужен: AppError из сервиса ловит общий обработчик в app.ts.
 */
export function authRoutes(app: FastifyInstance) {
  app.post<{ Body: RegisterBody }>(
    "/register",
    { schema: registerSchema },
    async (request, reply) => {
      const user = await registerUser(request.body);
      const token = app.jwt.sign(buildTokenPayload(user), {
        expiresIn: env.tokenTtl,
      });

      return reply.code(201).send({ user, token });
    },
  );

  app.post<{ Body: LoginBody }>(
    "/login",
    { schema: loginSchema },
    async (request, reply) => {
      const user = await loginUser(request.body);
      const token = app.jwt.sign(buildTokenPayload(user), {
        expiresIn: env.tokenTtl,
      });

      return reply.send({ user, token });
    },
  );
}
