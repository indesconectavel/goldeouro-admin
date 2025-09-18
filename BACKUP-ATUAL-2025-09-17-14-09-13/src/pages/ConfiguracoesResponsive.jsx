import React, { useState, useEffect } from 'react';
import { validateForm } from '../utils/validation';
import securityLogger from '../utils/securityLogger';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import Configuracoes from './Configuracoes';

const ConfiguracoesResponsive = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <Configuracoes />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_CONFIGURACOES"
      fallback={<Configuracoes />}
      desktopFallback={<Configuracoes />}
    >
      <ConfiguracoesMobileTablet />
    </ResponsiveWrapper>
  );
};

const ConfiguracoesMobileTablet = () => {
  const { device, isMobile } = useDeviceDetection();
  const [configuracoes, setConfiguracoes] = useState({
    // Configurações de Jogo
    valorMinimoAposta: 10.00,
    valorMaximoAposta: 1000.00,
    taxaPlataforma: 5.0,
    premioPorJogo: 5.00,
    premioGolDeOuro: 50.00,
    
    // Configurações de Saque
    limiteMinimoSaque: 50.00,
    limiteMaximoSaque: 5000.00,
    taxaSaque: 2.0,
    tempoProcessamentoSaque: 24,
    
    // Configurações de Segurança
    maxTentativasLogin: 5,
    tempoBloqueioLogin: 30,
    sessaoExpiracao: 24,
    
    // Configurações de Notificação
    emailNotificacoes: true,
    smsNotificacoes: false,
    pushNotificacoes: true,
    
    // Configurações de Manutenção
    modoManutencao: false,
    mensagemManutencao: 'Sistema em manutenção. Volte em breve!',
    horarioManutencao: '02:00-04:00'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleInputChange = (field, value) => {
    setConfiguracoes(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setErrors({});
      
      // Log de segurança
      securityLogger.logSecurityError(
        new Error('Configurações update attempt'),
        { timestamp: new Date().toISOString() }
      );
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Configurações salvas com sucesso!');
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setErrors({ submit: 'Erro ao salvar configurações' });
    } finally {
      setLoading(false);
    }
  };

  // Mobile: Layout em cards
  if (isMobile) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-yellow-400 mb-2">Configurações do Sistema</h1>
            <p className="text-gray-400 text-sm">Gerencie as configurações do sistema</p>
          </div>

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Configurações de Jogo */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4">🎮 Configurações de Jogo</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Valor Mínimo da Aposta</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.valorMinimoAposta}
                    onChange={(e) => handleInputChange('valorMinimoAposta', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Valor Máximo da Aposta</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.valorMaximoAposta}
                    onChange={(e) => handleInputChange('valorMaximoAposta', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Taxa da Plataforma (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={configuracoes.taxaPlataforma}
                    onChange={(e) => handleInputChange('taxaPlataforma', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prêmio por Jogo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.premioPorJogo}
                    onChange={(e) => handleInputChange('premioPorJogo', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prêmio Gol de Ouro</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.premioGolDeOuro}
                    onChange={(e) => handleInputChange('premioGolDeOuro', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Saque */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4">💰 Configurações de Saque</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Limite Mínimo de Saque</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.limiteMinimoSaque}
                    onChange={(e) => handleInputChange('limiteMinimoSaque', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Limite Máximo de Saque</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.limiteMaximoSaque}
                    onChange={(e) => handleInputChange('limiteMaximoSaque', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Taxa de Saque (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={configuracoes.taxaSaque}
                    onChange={(e) => handleInputChange('taxaSaque', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tempo de Processamento (horas)</label>
                  <input
                    type="number"
                    value={configuracoes.tempoProcessamentoSaque}
                    onChange={(e) => handleInputChange('tempoProcessamentoSaque', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Segurança */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4">🔒 Configurações de Segurança</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Máximo de Tentativas de Login</label>
                  <input
                    type="number"
                    value={configuracoes.maxTentativasLogin}
                    onChange={(e) => handleInputChange('maxTentativasLogin', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tempo de Bloqueio (minutos)</label>
                  <input
                    type="number"
                    value={configuracoes.tempoBloqueioLogin}
                    onChange={(e) => handleInputChange('tempoBloqueioLogin', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Expiração da Sessão (horas)</label>
                  <input
                    type="number"
                    value={configuracoes.sessaoExpiracao}
                    onChange={(e) => handleInputChange('sessaoExpiracao', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Notificação */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4">🔔 Configurações de Notificação</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Notificações por Email</span>
                  <input
                    type="checkbox"
                    checked={configuracoes.emailNotificacoes}
                    onChange={(e) => handleInputChange('emailNotificacoes', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#1a1a1a] border-[#2c3e50] rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Notificações por SMS</span>
                  <input
                    type="checkbox"
                    checked={configuracoes.smsNotificacoes}
                    onChange={(e) => handleInputChange('smsNotificacoes', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#1a1a1a] border-[#2c3e50] rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Notificações Push</span>
                  <input
                    type="checkbox"
                    checked={configuracoes.pushNotificacoes}
                    onChange={(e) => handleInputChange('pushNotificacoes', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#1a1a1a] border-[#2c3e50] rounded"
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Manutenção */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4">🔧 Configurações de Manutenção</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Modo de Manutenção</span>
                  <input
                    type="checkbox"
                    checked={configuracoes.modoManutencao}
                    onChange={(e) => handleInputChange('modoManutencao', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#1a1a1a] border-[#2c3e50] rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mensagem de Manutenção</label>
                  <textarea
                    value={configuracoes.mensagemManutencao}
                    onChange={(e) => handleInputChange('mensagemManutencao', e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Horário de Manutenção</label>
                  <input
                    type="text"
                    value={configuracoes.horarioManutencao}
                    onChange={(e) => handleInputChange('horarioManutencao', e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white text-sm"
                    placeholder="HH:MM-HH:MM"
                  />
                </div>
              </div>
            </div>

            {/* Botão de Salvar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Tablet: Layout em grid
  return (
    <div className="bg-[#000717] text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Configurações do Sistema</h1>
          <p className="text-gray-400 text-lg">Gerencie as configurações do sistema</p>
        </div>

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configurações de Jogo */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-6">🎮 Configurações de Jogo</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Valor Mínimo da Aposta</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.valorMinimoAposta}
                    onChange={(e) => handleInputChange('valorMinimoAposta', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Valor Máximo da Aposta</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.valorMaximoAposta}
                    onChange={(e) => handleInputChange('valorMaximoAposta', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Taxa da Plataforma (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={configuracoes.taxaPlataforma}
                    onChange={(e) => handleInputChange('taxaPlataforma', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prêmio por Jogo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.premioPorJogo}
                    onChange={(e) => handleInputChange('premioPorJogo', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prêmio Gol de Ouro</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.premioGolDeOuro}
                    onChange={(e) => handleInputChange('premioGolDeOuro', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Saque */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-6">💰 Configurações de Saque</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Limite Mínimo de Saque</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.limiteMinimoSaque}
                    onChange={(e) => handleInputChange('limiteMinimoSaque', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Limite Máximo de Saque</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.limiteMaximoSaque}
                    onChange={(e) => handleInputChange('limiteMaximoSaque', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Taxa de Saque (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={configuracoes.taxaSaque}
                    onChange={(e) => handleInputChange('taxaSaque', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tempo de Processamento (horas)</label>
                  <input
                    type="number"
                    value={configuracoes.tempoProcessamentoSaque}
                    onChange={(e) => handleInputChange('tempoProcessamentoSaque', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Segurança */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-6">🔒 Configurações de Segurança</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Máximo de Tentativas de Login</label>
                  <input
                    type="number"
                    value={configuracoes.maxTentativasLogin}
                    onChange={(e) => handleInputChange('maxTentativasLogin', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tempo de Bloqueio (minutos)</label>
                  <input
                    type="number"
                    value={configuracoes.tempoBloqueioLogin}
                    onChange={(e) => handleInputChange('tempoBloqueioLogin', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Expiração da Sessão (horas)</label>
                  <input
                    type="number"
                    value={configuracoes.sessaoExpiracao}
                    onChange={(e) => handleInputChange('sessaoExpiracao', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Notificação */}
            <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-6">🔔 Configurações de Notificação</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Notificações por Email</span>
                  <input
                    type="checkbox"
                    checked={configuracoes.emailNotificacoes}
                    onChange={(e) => handleInputChange('emailNotificacoes', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#1a1a1a] border-[#2c3e50] rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Notificações por SMS</span>
                  <input
                    type="checkbox"
                    checked={configuracoes.smsNotificacoes}
                    onChange={(e) => handleInputChange('smsNotificacoes', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#1a1a1a] border-[#2c3e50] rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Notificações Push</span>
                  <input
                    type="checkbox"
                    checked={configuracoes.pushNotificacoes}
                    onChange={(e) => handleInputChange('pushNotificacoes', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#1a1a1a] border-[#2c3e50] rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Manutenção */}
          <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">🔧 Configurações de Manutenção</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Modo de Manutenção</span>
                  <input
                    type="checkbox"
                    checked={configuracoes.modoManutencao}
                    onChange={(e) => handleInputChange('modoManutencao', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-[#1a1a1a] border-[#2c3e50] rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Horário de Manutenção</label>
                  <input
                    type="text"
                    value={configuracoes.horarioManutencao}
                    onChange={(e) => handleInputChange('horarioManutencao', e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                    placeholder="HH:MM-HH:MM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Mensagem de Manutenção</label>
                <textarea
                  value={configuracoes.mensagemManutencao}
                  onChange={(e) => handleInputChange('mensagemManutencao', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2c3e50] rounded text-white"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Botão de Salvar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfiguracoesResponsive;
