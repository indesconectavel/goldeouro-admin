import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken, setUser } from "../js/auth";
import StandardLoader from "../components/StandardLoader";
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle } from "lucide-react";
import logo from "../assets/logo.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://goldeouro-backend-v2.fly.dev";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({
    length: false,
    hasSpecial: false,
    hasNumber: false
  });

  useEffect(() => {
    // Verificar se já está autenticado
    if (getToken()) {
      navigate("/painel");
    }
  }, [navigate]);

  useEffect(() => {
    // Validação em tempo real da senha
    const password = formData.password;
    setValidation({
      length: password.length >= 6,
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /\d/.test(password)
    });
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro quando usuário digita
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Informe email e senha.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const payload = await response.json();
      if (!response.ok || !payload?.token) {
        setError(payload?.message || "Falha na autenticação.");
        return;
      }

      setToken(payload.token);
      if (payload?.user) {
        setUser(payload.user);
      }

      if (formData.rememberMe) {
        localStorage.setItem("admin-remember", "true");
      } else {
        localStorage.removeItem("admin-remember");
      }

      navigate("/painel");
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setError("Erro de conexão com o backend.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = () => {
    const { length, hasSpecial, hasNumber } = validation;
    const score = [length, hasSpecial, hasNumber].filter(Boolean).length;
    
    if (score === 0) return { text: "Muito fraca", color: "text-red-400" };
    if (score === 1) return { text: "Fraca", color: "text-orange-400" };
    if (score === 2) return { text: "Média", color: "text-yellow-400" };
    if (score === 3) return { text: "Forte", color: "text-green-400" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{
        backgroundImage: `url('/images/Gol_de_Ouro_Bg01.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Gol de Ouro Logo" 
              className="w-48 h-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Painel Administrativo</h1>
          <p className="text-gray-300 text-sm">Gol de Ouro - Sistema de Apostas</p>
        </div>

        {/* Card de Login */}
        <div className="card p-8 w-full max-w-md mx-auto bg-white/10 border border-yellow-500/30 rounded-lg backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de Email */}
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">
                Email do Administrador
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent backdrop-blur-sm"
                placeholder="admin@goldeouro.lol"
                required
                disabled={loading}
              />
            </div>

            {/* Campo de Senha */}
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">
                Senha de Administrador
          </label>
              <div className="relative">
          <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent backdrop-blur-sm pr-12"
                  placeholder="Digite sua senha"
            required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Indicador de Força da Senha */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-400">Força:</span>
                    <span className={passwordStrength.color}>{passwordStrength.text}</span>
                  </div>
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= [validation.length, validation.hasSpecial, validation.hasNumber].filter(Boolean).length
                            ? passwordStrength.color.replace('text-', 'bg-')
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox Lembrar */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-yellow-500 bg-white/10 border-yellow-500/30 rounded focus:ring-yellow-500 focus:ring-2"
                disabled={loading}
              />
              <label className="ml-2 text-sm text-gray-300">
                Lembrar de mim
              </label>
            </div>

            {/* Mensagem de Erro */}
          {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
          )}

            {/* Botão de Login */}
          <button
            type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <StandardLoader message="" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Entrar no Painel</span>
                </>
              )}
          </button>

            {/* Informações de Segurança */}
            <div className="text-center">
              <p className="text-xs text-gray-400">Use credenciais admin válidas do backend.</p>
            </div>
        </form>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>SSL Seguro</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Autenticação</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-yellow-400" />
              <span>Monitorado</span>
            </div>
          </div>
        </div>

        {/* Aviso de Segurança */}
        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300 text-center">
            <strong>Aviso:</strong> Esta é uma área restrita. Todas as atividades são monitoradas e registradas.
          </p>
        </div>
      </div>
    </div>
  );
}