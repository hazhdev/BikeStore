import { Input } from "@/shared/ui/Input/input";

export function NewPassword() {
  return (
    <>
      <h1>Забыли пароль?</h1>
      <p>
        Укажите свой email или имя пользователя. Ссылку на создание нового
        пароля вы получите по электронной почте.
      </p>
      <Input type="email" />
    </>
  );
}
