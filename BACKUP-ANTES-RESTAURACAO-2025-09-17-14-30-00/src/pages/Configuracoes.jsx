import React, { useState, useEffect } from 'react';
import { validateForm } from '../utils/validation';
import securityLogger from '../utils/securityLogger';

const Configuracoes = () => {
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

  // Validação de formulário
  const validationRules = {
    valorMinimoAposta: { type: 'currency', label: 'Valor Mínimo da Aposta', required: true },
    valorMaximoAposta: { type: 'currency', label: 'Valor Máximo da Aposta', required: true },
    taxaPlataforma: { type: 'currency', label: 'Taxa da Plataforma', required: true },
    premioPorJogo: { type: 'currency', label: 'Prêmio por Jogo', required: true },
    premioGolDeOuro: { type: 'currency', label: 'Prêmio Gol de Ouro', required: true },
    limiteMinimoSaque: { type: 'currency', label: 'Limite Mínimo de Saque', required: true },
    limiteMaximoSaque: { type: 'currency', label: 'Limite Máximo de Saque', required: true },
    taxaSaque: { type: 'currency', label: 'Taxa de Saque', required: true },
    tempoProcessamentoSaque: { type: 'number', label: 'Tempo de Processamento', required: true, minLength: 1 },
    maxTentativasLogin: { type: 'number', label: 'Máximo de Tentativas de Login', required: true, minLength: 1 },
    tempoBloqueioLogin: { type: 'number', label: 'Tempo de Bloqueio', required: true, minLength: 1 },
    sessaoExpiracao: { type: 'number', label: 'Expiração da Sessão', required: true, minLength: 1 }
  };

  const handleInputChange = (field, value) => {
    setConfiguracoes(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      // Validar formulário
      const validation = validateForm(configuracoes, validationRules);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      // Log de segurança
      securityLogger.logSecurityError(
        new Error('Configuration update attempt'),
        { configuracoes: Object.keys(configuracoes) }
      );

      // Simular salvamento (em produção, enviar para API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Configurações salvas com sucesso!');
      
      // Limpar sucesso após 3 segundos
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setErrors({ submit: 'Erro ao salvar configurações' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfiguracoes({
      valorMinimoAposta: 10.00,
      valorMaximoAposta: 1000.00,
      taxaPlataforma: 5.0,
      premioPorJogo: 5.00,
      premioGolDeOuro: 50.00,
      limiteMinimoSaque: 50.00,
      limiteMaximoSaque: 5000.00,
      taxaSaque: 2.0,
      tempoProcessamentoSaque: 24,
      maxTentativasLogin: 5,
      tempoBloqueioLogin: 30,
      sessaoExpiracao: 24,
      emailNotificacoes: true,
      smsNotificacoes: false,
      pushNotificacoes: true,
      modoManutencao: false,
      mensagemManutencao: 'Sistema em manutenção. Volte em breve!',
      horarioManutencao: '02:00-04:00'
    });
    setErrors({});
    setSuccess('');
  };

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">⚙️ Configurações da Plataforma</h1>
          <p className="text-gray-400">Gerencie parâmetros administrativos, regras de jogo e configurações de segurança</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Configurações de Jogo */}
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">🎮 Configurações de Jogo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor Mínimo da Aposta (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={configuracoes.valorMinimoAposta}
                  onChange={(e) => handleInputChange('valorMinimoAposta', parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.valorMinimoAposta && (
                  <p className="text-red-400 text-sm mt-1">{errors.valorMinimoAposta}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor Máximo da Aposta (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={configuracoes.valorMaximoAposta}
                  onChange={(e) => handleInputChange('valorMaximoAposta', parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.valorMaximoAposta && (
                  <p className="text-red-400 text-sm mt-1">{errors.valorMaximoAposta}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Taxa da Plataforma (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.taxaPlataforma}
                  onChange={(e) => handleInputChange('taxaPlataforma', parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.taxaPlataforma && (
                  <p className="text-red-400 text-sm mt-1">{errors.taxaPlataforma}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prêmio por Jogo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={configuracoes.premioPorJogo}
                  onChange={(e) => handleInputChange('premioPorJogo', parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.premioPorJogo && (
                  <p className="text-red-400 text-sm mt-1">{errors.premioPorJogo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prêmio Gol de Ouro (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={configuracoes.premioGolDeOuro}
                  onChange={(e) => handleInputChange('premioGolDeOuro', parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.premioGolDeOuro && (
                  <p className="text-red-400 text-sm mt-1">{errors.premioGolDeOuro}</p>
                )}
              </div>
            </div>
          </div>

          {/* Configurações de Saque */}
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">💰 Configurações de Saque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Limite Mínimo de Saque (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={configuracoes.limiteMinimoSaque}
                  onChange={(e) => handleInputChange('limiteMinimoSaque', parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.limiteMinimoSaque && (
                  <p className="text-red-400 text-sm mt-1">{errors.limiteMinimoSaque}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Limite Máximo de Saque (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={configuracoes.limiteMaximoSaque}
                  onChange={(e) => handleInputChange('limiteMaximoSaque', parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.limiteMaximoSaque && (
                  <p className="text-red-400 text-sm mt-1">{errors.limiteMaximoSaque}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Taxa de Saque (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.taxaSaque}
                  onChange={(e) => handleInputChange('taxaSaque', parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.taxaSaque && (
                  <p className="text-red-400 text-sm mt-1">{errors.taxaSaque}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tempo de Processamento (horas)
                </label>
                <input
                  type="number"
                  value={configuracoes.tempoProcessamentoSaque}
                  onChange={(e) => handleInputChange('tempoProcessamentoSaque', parseInt(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.tempoProcessamentoSaque && (
                  <p className="text-red-400 text-sm mt-1">{errors.tempoProcessamentoSaque}</p>
                )}
              </div>
            </div>
          </div>

          {/* Configurações de Segurança */}
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">🔒 Configurações de Segurança</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de Tentativas de Login
                </label>
                <input
                  type="number"
                  value={configuracoes.maxTentativasLogin}
                  onChange={(e) => handleInputChange('maxTentativasLogin', parseInt(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.maxTentativasLogin && (
                  <p className="text-red-400 text-sm mt-1">{errors.maxTentativasLogin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tempo de Bloqueio (minutos)
                </label>
                <input
                  type="number"
                  value={configuracoes.tempoBloqueioLogin}
                  onChange={(e) => handleInputChange('tempoBloqueioLogin', parseInt(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.tempoBloqueioLogin && (
                  <p className="text-red-400 text-sm mt-1">{errors.tempoBloqueioLogin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiração da Sessão (horas)
                </label>
                <input
                  type="number"
                  value={configuracoes.sessaoExpiracao}
                  onChange={(e) => handleInputChange('sessaoExpiracao', parseInt(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {errors.sessaoExpiracao && (
                  <p className="text-red-400 text-sm mt-1">{errors.sessaoExpiracao}</p>
                )}
              </div>
            </div>
          </div>

          {/* Configurações de Notificação */}
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">📧 Configurações de Notificação</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={configuracoes.emailNotificacoes}
                  onChange={(e) => handleInputChange('emailNotificacoes', e.target.checked)}
                  className="w-5 h-5 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300">Notificações por Email</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={configuracoes.smsNotificacoes}
                  onChange={(e) => handleInputChange('smsNotificacoes', e.target.checked)}
                  className="w-5 h-5 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300">Notificações por SMS</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={configuracoes.pushNotificacoes}
                  onChange={(e) => handleInputChange('pushNotificacoes', e.target.checked)}
                  className="w-5 h-5 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300">Notificações Push</span>
              </label>
            </div>
          </div>

          {/* Configurações de Manutenção */}
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">🔧 Configurações de Manutenção</h2>
            <div className="space-y-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={configuracoes.modoManutencao}
                  onChange={(e) => handleInputChange('modoManutencao', e.target.checked)}
                  className="w-5 h-5 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300">Modo de Manutenção</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mensagem de Manutenção
                </label>
                <textarea
                  value={configuracoes.mensagemManutencao}
                  onChange={(e) => handleInputChange('mensagemManutencao', e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horário de Manutenção
                </label>
                <input
                  type="text"
                  value={configuracoes.horarioManutencao}
                  onChange={(e) => handleInputChange('horarioManutencao', e.target.value)}
                  placeholder="Ex: 02:00-04:00"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Mensagens de Feedback */}
          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200"
            >
              🔄 Resetar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-semibold rounded-lg transition duration-200"
            >
              {loading ? '💾 Salvando...' : '💾 Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Configuracoes;
