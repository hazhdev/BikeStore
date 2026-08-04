import type { FastifyInstance, FastifyReply } from "fastify";

import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";
import { loginSchema, registerSchema } from "./auth.schema";
import { buildTokenPayload, loginUser, registerUser } from "./auth.service";
import type { LoginBody, RegisterBody } from "./auth.types";

/**
 * Роуты — только HTTP: какой путь, какая схема, какой код ответа.
 * Ни SQL, ни бизнес-правил здесь нет.
 */
export function authRoutes(app: FastifyInstance) {
  const handleError = (reply: FastifyReply, error: unknown) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    app.log.error(error);
    return reply.code(500).send({ message: "Внутренняя ошибка сервера" });
  };

  app.post<{ Body: RegisterBody }>(
    "/register",
    { schema: registerSchema },
    async (request, reply) => {
      try {
        const user = await registerUser(request.body);
        const token = app.jwt.sign(buildTokenPayload(user), {
          expiresIn: env.tokenTtl,
        });

        return reply.code(201).send({ user, token });
      } catch (error) {
        return handleError(reply, error);
      }
    },
  );

  app.post<{ Body: LoginBody }>(
    "/login",
    { schema: loginSchema },
    async (request, reply) => {
      try {
        const user = await loginUser(request.body);
        const token = app.jwt.sign(buildTokenPayload(user), {
          expiresIn: env.tokenTtl,
        });

        return reply.send({ user, token });
      } catch (error) {
        return handleError(reply, error);
      }
    },
  );
}
