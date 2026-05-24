import { Routes, Route } from "react-router-dom";
import { LoginForm } from "./features/auth/ui/LoginForm/login";
import { RegisterForm } from "@/features/auth/ui/RegisterForm/register";
import "./index.scss";
import { Navigate } from "react-router-dom";
import { NewPassword } from "./features/auth/ui/NewPasswoed/newPass";
import { Profile } from "./pages/ProfilePage/Profile";
import { Home } from "./pages/HomePage/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/newPassword" element={<NewPassword />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/home" element={<Home />}></Route>
    </Routes>
  );
}

export default App;
