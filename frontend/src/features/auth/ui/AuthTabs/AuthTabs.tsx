import { Link } from "react-router-dom";
import "./AuthTabs.scss";

type AuthTabsProps = {
  active: "login" | "register";
};

export default function AuthTabs({ active }: AuthTabsProps) {
  return (
    <div className="form__btn">
      <Link
        to="/login"
        className={`login_btn ${active === "login" ? "active" : ""}`}
      >
        Войти
      </Link>

      <Link
        to="/register"
        className={`register_btn ${active === "register" ? "active" : ""}`}
      >
        Регистрация
      </Link>
    </div>
  );
}
