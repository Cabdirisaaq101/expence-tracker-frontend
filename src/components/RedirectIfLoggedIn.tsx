import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RedirectIfLoggedIn({ children }: { children: ReactNode }) {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
