import { LoginForm } from "@/features/auth/ui/LoginForm/login";
import { RegisterForm } from "@/features/auth/ui/RegisterForm/register";
import { Navigate, Route, Routes } from "react-router-dom";
import { NewPassword } from "@/features/auth/ui/NewPasswoed/newPass";
import { Profile } from "@/pages/ProfilePage/Profile";
import { Home } from "@/pages/HomePage/Home";
import { CatalogPage } from "@/pages/CatalogPage/CatalogPage";
import { AuthProvider } from "./authProvider";

export const AppProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/newPassword" element={<NewPassword />}></Route>
      <Route
        path="/profile"
        element={
          <AuthProvider>
            <Profile />
          </AuthProvider>
        }
      ></Route>
      <Route path="/home" element={<Home />}></Route>

      {/* два пути на одну страницу: в react-router нельзя
          объявить параметр необязательным одной строкой */}
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/:categorySlug" element={<CatalogPage />} />
    </Routes>
  );
};
