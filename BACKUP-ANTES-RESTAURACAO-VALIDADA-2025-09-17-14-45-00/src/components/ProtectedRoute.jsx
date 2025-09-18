import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth";

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Simular verificação assíncrona (para futuras implementações reais)
    const checkAuth = async () => {
      try {
        // TODO: Trocar por verificação real de token (API call)
        const authenticated = isAuthenticated();
        setIsAuth(authenticated);
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar conteúdo protegido se autenticado
  return children;
}
