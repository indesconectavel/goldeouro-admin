import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getAdminToken } from '../config/env';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Detectar se estamos em produção
      const isProduction = window.location.hostname === 'admin.goldeouro.lol';
      
      if (isProduction) {
        // Em produção, verificar se há token válido
        const token = getAdminToken();
        
        if (!token || token !== 'G0ld3@0ur0_2025!') {
          // Sem token válido, redirecionar para login
          navigate('/login', { replace: true });
          return;
        }
        
        setIsAuthenticated(true);
      } else {
        // Em desenvolvimento, permitir acesso direto
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Será redirecionado para login
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 md:ml-64 transition-all duration-300 p-6">
        <div className="card" style={{
          padding: '2rem',
          minHeight: 'calc(100vh - 3rem)'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
