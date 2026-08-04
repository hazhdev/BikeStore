/** Пользователь в том виде, в каком его отдаём наружу — без хеша пароля */
export type PublicUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

/** Строка из таблицы users, как её вернула база */
export type UserRow = PublicUser & {
  password_hash: string;
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  newpass: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

/** Что кладём внутрь JWT */
export type TokenPayload = {
  id: number;
  email: string;
  role: string;
};
