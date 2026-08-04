/**
 * Схемы валидации входящих данных.
 * Fastify проверяет тело запроса ДО того, как оно дойдёт до кода:
 * не прошло проверку — клиент получит 400, обработчик даже не запустится.
 */

const EMAIL_PATTERN = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";

export const registerSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password", "newpass"],
    // никаких лишних полей: попытка прислать "role": "admin" отлетит с 400
    additionalProperties: false,
    properties: {
      name: { type: "string", minLength: 2, maxLength: 100 },
      email: { type: "string", pattern: EMAIL_PATTERN, maxLength: 255 },
      password: { type: "string", minLength: 6 },
      newpass: { type: "string", minLength: 6 },
    },
  },
};

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email: { type: "string", minLength: 2, maxLength: 255 },
      password: { type: "string", minLength: 5 },
    },
  },
};
