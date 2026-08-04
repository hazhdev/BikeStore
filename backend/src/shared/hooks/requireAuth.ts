import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * Защита приватных маршрутов. Вешается так:
 *
 *   app.get("/orders", { preHandler: requireAuth }, handler)
 *
 * Проверяет подпись JWT из заголовка Authorization. Если токена нет,
 * он просрочен или подделан — до обработчика дело не дойдёт.
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.code(401).send({ message: "Требуется авторизация" });
  }
}
