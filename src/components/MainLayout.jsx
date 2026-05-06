import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { isAuthenticated } from '../js/auth';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação apenas no cliente
    if (typeof window !== 'undefined') {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);
      setIsLoading(false);
      
      if (!authStatus) {
        navigate('/login', { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  // Mostrar loading durante verificação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-lg">Verificando autenticação...</div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuth) {
    return null;
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
