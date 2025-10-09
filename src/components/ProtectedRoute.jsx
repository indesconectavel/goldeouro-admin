import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../js/auth";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação apenas no cliente
    if (typeof window !== 'undefined') {
      setIsAuth(isAuthenticated());
      setIsLoading(false);
    }
  }, []);

  // Mostrar loading durante verificação
  if (isLoading) {
    return <div>Verificando autenticação...</div>;
  }

  // Redirecionar se não autenticado
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
