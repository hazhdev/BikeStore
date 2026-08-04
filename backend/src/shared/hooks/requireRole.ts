import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * Проверка роли. Ставится ПОСЛЕ requireAuth:
 *
 *   app.delete("/products/:id", {
 *     preHandler: [requireAuth, requireRole("admin")],
 *   }, handler)
 *
 * Роль берётся из подписанного токена, а не из тела запроса —
 * подделать её клиент не может.
 */
export function requireRole(...allowed: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { role?: string } | undefined;

    if (!user?.role || !allowed.includes(user.role)) {
      return reply.code(403).send({ message: "Недостаточно прав" });
    }
  };
}
