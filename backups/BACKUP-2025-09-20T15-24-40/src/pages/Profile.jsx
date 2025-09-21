import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin Gol de Ouro',
    email: 'admin@goldeouro.com',
    role: 'admin',
    permissions: ['users', 'games', 'payments', 'withdrawals', 'notifications', 'system'],
    lastLogin: '2024-01-20 14:30:00',
    createdAt: '2024-01-01 00:00:00',
    isActive: true
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Simular alteração de senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPermissionBadge = (permission) => {
    const permissionLabels = {
      users: 'Usuários',
      games: 'Jogos',
      payments: 'Pagamentos',
      withdrawals: 'Saques',
      notifications: 'Notificações',
      system: 'Sistema'
    };
    
    return (
      <Badge className="bg-blue-600 text-blue-100">
        {permissionLabels[permission] || permission}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Perfil</h1>
        <Button onClick={handleSaveProfile} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

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

      {/* Informações do Perfil */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
              <Input
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <Input
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                type="email"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Função</label>
              <Input
                value={profile.role}
                disabled
                className="bg-slate-600 border-slate-500 text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <div className="flex items-center space-x-2">
                <Badge className={profile.isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}>
                  {profile.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Último Login</label>
              <Input
                value={profile.lastLogin}
                disabled
                className="bg-slate-600 border-slate-500 text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Criado em</label>
              <Input
                value={profile.createdAt}
                disabled
                className="bg-slate-600 border-slate-500 text-gray-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissões */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Permissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {profile.permissions.map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                {getPermissionBadge(permission)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alteração de Senha */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha Atual</label>
            <div className="relative">
              <Input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nova Senha</label>
            <div className="relative">
              <Input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Nova Senha</label>
            <div className="relative">
              <Input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <Button 
            onClick={handleChangePassword} 
            disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="bg-green-600 hover:bg-green-700"
          >
            <Lock className="w-4 h-4 mr-2" />
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </CardContent>
      </Card>

      {/* Configurações de Segurança */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Configurações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="text-white font-semibold">Autenticação de Dois Fatores</h3>
              <p className="text-gray-400 text-sm">Adicione uma camada extra de segurança à sua conta</p>
            </div>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-600">
              Configurar
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="text-white font-semibold">Sessões Ativas</h3>
              <p className="text-gray-400 text-sm">Gerencie suas sessões ativas em outros dispositivos</p>
            </div>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-600">
              Gerenciar
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="text-white font-semibold">Logs de Acesso</h3>
              <p className="text-gray-400 text-sm">Visualize o histórico de acessos à sua conta</p>
            </div>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-600">
              Visualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
