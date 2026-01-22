import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
