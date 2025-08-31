import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validação básica
      if (!username || !password) {
        setError('Usuário e senha são obrigatórios');
        return;
      }

      // Verificação de credenciais admin
      if (password === import.meta.env.VITE_ADMIN_TOKEN) {
        // Login bem-sucedido
        setUser({ username, role: 'admin' });
        localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
        navigate('/painel');
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao fazer login');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Digite a senha para acessar:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Senha"
            required
          />
          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
