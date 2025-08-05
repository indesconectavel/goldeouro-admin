import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const adminToken = import.meta.env.VITE_ADMIN_TOKEN;

    if (token === adminToken) {
      localStorage.setItem('adminToken', token);
      navigate('/relatorio-semanal');
    } else {
      setError('Token inválido. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-yellow-600">
          Painel Gol de Ouro
        </h2>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Digite o token de admin"
          className="w-full px-4 py-2 border rounded mb-4"
        />
        {error && (
          <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
