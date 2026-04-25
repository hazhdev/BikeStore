import type { AppDispatch, RootState } from "@/app/store/store";
import AuthTabs from "@/features/auth/ui/AuthTabs/AuthTabs";
import { Button } from "@/shared/ui/Button/button";
import { Input } from "@/shared/ui/Input/input";
import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RegisterFetch } from "../../model/login/authThunks";
import { BtnClose } from "@/shared/ui/Button/BtnClose";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpass, setNewpass] = useState("");
  const [isopen, setIsOpen] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error } = useSelector((state: RootState) => state.auth);

  const hundleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        RegisterFetch({ name, email, password, newpass }),
      ).unwrap();
      navigate("/profile");
    } catch (error) {}

    setName("");
    setEmail("");
    setPassword("");
    setNewpass("");
  };

  return (
    <>
      {isopen && (
        <div className="register_form">
          <BtnClose className="close_btn" onClose={() => setIsOpen(false)} />
          <AuthTabs active="register" />

          <form className="input_Register" onSubmit={hundleSubmit}>
            <label>
              Имя пользователя
              <Input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              E-mail
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Пароль
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Подтвердите пароль
              <Input
                type="newpass"
                value={newpass}
                onChange={(e) => setNewpass(e.target.value)}
              />
            </label>

            <Button
              className="submit"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Загрузка..." : "Регистрация"}
            </Button>

            <p>
              Уже регистрировались?
              <Link to="/login">Войти</Link>
            </p>

            {error && <p className="error">{error}</p>}
          </form>
        </div>
      )}
    </>
  );
}
