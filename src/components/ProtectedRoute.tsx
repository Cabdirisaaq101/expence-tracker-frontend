import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // 🕓 only while checking token
  }

  return user ? children : <Navigate to="/login" replace />;
}
