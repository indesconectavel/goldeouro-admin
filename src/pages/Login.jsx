import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validação básica
      if (!password) {
        setError('Senha é obrigatória');
        return;
      }

      // Token admin hardcoded para desenvolvimento
      const adminToken = 'adm_8d1e3c7a5b9f2a4c6e0d1f3b7a9c5e2d';
      
      // Verificação de credenciais admin
      if (password === adminToken) {
        // Login bem-sucedido
        const success = login(adminToken);
        if (success) {
          navigate('/painel');
        } else {
          setError('Erro ao salvar token');
        }
      } else {
        setError('Senha incorreta');
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
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
