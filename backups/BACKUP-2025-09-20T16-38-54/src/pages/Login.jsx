import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../js/auth";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_TOKEN || password === "goldeouro123") {
      login();
      navigate("/painel");
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">GO</span>
          </div>
          <h1 className="text-2xl font-bold text-yellow-400">Painel Administrativo</h1>
          <p className="text-gray-300 text-sm mt-2">Gol de Ouro - Sistema de Apostas</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-yellow-300">
            Digite a senha para acessar:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent backdrop-blur-sm"
            placeholder="Senha de administrador"
            required
          />
          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}
