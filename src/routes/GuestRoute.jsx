import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}