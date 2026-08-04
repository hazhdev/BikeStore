import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { Navigate } from "react-router-dom";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
