// Logout.tsx - Logout client-side para evitar 404
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Limpar tokens/sessão
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2) Redirecionar via client-side (sem reload)
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Saindo do sistema...</p>
      </div>
    </div>
  );
}
