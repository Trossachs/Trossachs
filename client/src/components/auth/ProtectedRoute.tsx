import { ReactNode } from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAdmin) {
    // Redirect to home page if not admin
    setLocation("/");
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}