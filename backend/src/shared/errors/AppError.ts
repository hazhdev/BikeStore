/**
 * Своя ошибка с HTTP-кодом.
 * Позволяет сервису сказать «это 409, почта занята», ничего не зная
 * про Fastify, reply и прочий HTTP. Роут ловит и превращает в ответ.
 */
export class AppError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}
