import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/app/store/store";
import { loginFetch } from "@/features/auth/model/authThunks";

import { Button } from "@/shared/ui/Button/button";
import { Input } from "@/shared/ui/Input/input";
import AuthTabs from "@/features/auth/ui/AuthTabs/AuthTabs";
import { BtnClose } from "@/shared/ui/Button/BtnClose";

import close from "@/shared/assets/icons/onClose.svg";
import "./login.scss";

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginFetch({ email, password })).unwrap();

      setEmail("");
      setPassword("");

      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/home");
  };

  return (
    <>
      {isOpen && (
        <div className="form">
          <BtnClose className="close_btn" onClose={handleClose}>
            <img src={close} alt="Закрыть" />
          </BtnClose>

          <AuthTabs active="login" />

          <form className="form_login" onSubmit={handleSubmit}>
            <label className="email">
              Почта пользователя
              <Input
                className="input_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="password">
              Пароль
              <Input
                className="input_password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <Button
              className="submit"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Загрузка..." : "Войти"}
            </Button>

            <div className="remember">
              <label className="remember_me">
                <Input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                Запомнить меня
              </label>

              <Link className="newPasword" to="/newPassword">
                Забыли пароль?
              </Link>
            </div>

            {error && <p className="error">{error}</p>}
          </form>
        </div>
      )}
    </>
  );
};
