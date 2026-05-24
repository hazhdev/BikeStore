import type { AppDispatch, RootState } from "@/app/store/store";
import AuthTabs from "@/features/auth/ui/AuthTabs/AuthTabs";
import { Button } from "@/shared/ui/Button/button";
import { Input } from "@/shared/ui/Input/input";
import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RegisterFetch } from "../../model/authThunks";
import { BtnClose } from "@/shared/ui/Button/BtnClose";
import "./register.scss";
import close from "@/shared/assets/icons/onClose.svg";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpass, setNewpass] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setFormError("");

    if (!name.trim() || !email.trim() || !password.trim() || !newpass.trim()) {
      setFormError("Заполните все поля");
      return;
    }

    if (password !== newpass) {
      setFormError("Пароли не совпадают");
      return;
    }

    try {
      await dispatch(
        RegisterFetch({
          name,
          email,
          password,
          newpass,
        }),
      ).unwrap();

      setName("");
      setEmail("");
      setPassword("");
      setNewpass("");

      navigate("/profile");
    } catch {
      setFormError("Ошибка регистрации");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="register_form">
          <BtnClose className="close_btn" onClose={handleClose}>
            <img src={close} alt="Закрыть" />
          </BtnClose>

          <AuthTabs active="register" />

          <form className="input_Register" onSubmit={handleSubmit}>
            <label>
              Имя пользователя
              <Input
                type="text"
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
                type="password"
                value={newpass}
                onChange={(e) => setNewpass(e.target.value)}
              />
            </label>

            <Button
              className="register__submit"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Загрузка..." : "Регистрация"}
            </Button>

            <p>
              Уже регистрировались?
              <Link to="/login"> Войти</Link>
            </p>

            {formError && <p className="error">{formError}</p>}
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      )}
    </>
  );
}
