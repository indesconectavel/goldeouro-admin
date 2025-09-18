import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  Shield
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Simular autenticação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.email === 'admin@goldeouro.com' && formData.password === 'admin123') {
        setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
        
        // Simular redirecionamento
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        setMessage({ type: 'error', text: 'Email ou senha incorretos' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao fazer login' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Gol de Ouro</h1>
          <p className="text-gray-400">Painel de Administração</p>
        </div>

        {/* Card de Login */}
        <Card className="bg-slate-800 border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">Fazer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mensagem de feedback */}
              {message.text && (
                <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                  message.type === 'success' ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="admin@goldeouro.com"
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botão de Login */}
              <Button
                type="submit"
                disabled={loading || !formData.email || !formData.password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Informações de Demo */}
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Credenciais de Demo</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <div><strong>Email:</strong> admin@goldeouro.com</div>
                <div><strong>Senha:</strong> admin123</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2024 Gol de Ouro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;