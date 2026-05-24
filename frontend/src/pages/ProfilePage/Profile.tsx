import type { AppDispatch } from "@/app/store/store";
import { logout } from "@/features/auth/model/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "./Prifile.module.scss";

export function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <h1>Профиль</h1>

      <button className={style.logout} onClick={handleClick}>
        Выйти
      </button>
    </div>
  );
}
