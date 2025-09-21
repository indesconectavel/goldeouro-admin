import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import GridTemplate from '../templates/GridTemplate';

const Configuracoes = () => {
  const [configuracoes, setConfiguracoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchConfiguracoes() {
      try {
        const result = await postData('/admin/configuracoes', {});
        setConfiguracoes(result);
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        // Dados fictícios como fallback
        setConfiguracoes({
          taxaPlataforma: 5.0,
          limiteSaqueMinimo: 10.0,
          limiteSaqueMaximo: 1000.0,
          tempoPartida: 30,
          maxJogadores: 2,
          notificacoesEmail: true,
          notificacoesPush: true,
          manutencao: false,
          versao: '1.0.0'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchConfiguracoes();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await postData('/admin/configuracoes/salvar', configuracoes);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Usando dados fictícios.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar as configurações?')) {
      setConfiguracoes({
        taxaPlataforma: 5.0,
        limiteSaqueMinimo: 10.0,
        limiteSaqueMaximo: 1000.0,
        tempoPartida: 30,
        maxJogadores: 2,
        notificacoesEmail: true,
        notificacoesPush: true,
        manutencao: false,
        versao: '1.0.0'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando configurações...</div>
      </div>
    );
  }

  if (!configuracoes) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-400">Erro ao carregar configurações.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Configurações da Plataforma</h1>
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Resetar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <p className="text-gray-300 mb-6">
        Ajuste parâmetros administrativos, regras de jogo, taxas da plataforma e limites de saque.
      </p>

      {/* Cards de Resumo */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Taxa da Plataforma" 
          value={`${configuracoes.taxaPlataforma}%`} 
          color="yellow" 
        />
        <CardTemplate 
          title="Limite Mínimo" 
          value={`R$ ${configuracoes.limiteSaqueMinimo}`} 
          color="green" 
        />
        <CardTemplate 
          title="Limite Máximo" 
          value={`R$ ${configuracoes.limiteSaqueMaximo}`} 
          color="red" 
        />
        <CardTemplate 
          title="Versão" 
          value={configuracoes.versao} 
          color="blue" 
        />
      </GridTemplate>

      {/* Configurações Financeiras */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Configurações Financeiras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Taxa da Plataforma (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={configuracoes.taxaPlataforma}
              onChange={(e) => setConfiguracoes({...configuracoes, taxaPlataforma: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Limite Mínimo de Saque (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={configuracoes.limiteSaqueMinimo}
              onChange={(e) => setConfiguracoes({...configuracoes, limiteSaqueMinimo: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Limite Máximo de Saque (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={configuracoes.limiteSaqueMaximo}
              onChange={(e) => setConfiguracoes({...configuracoes, limiteSaqueMaximo: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Configurações de Jogo */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Configurações de Jogo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Tempo da Partida (segundos)
            </label>
            <input
              type="number"
              value={configuracoes.tempoPartida}
              onChange={(e) => setConfiguracoes({...configuracoes, tempoPartida: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Máximo de Jogadores
            </label>
            <input
              type="number"
              value={configuracoes.maxJogadores}
              onChange={(e) => setConfiguracoes({...configuracoes, maxJogadores: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Configurações de Notificações */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Configurações de Notificações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notificacoesEmail"
              checked={configuracoes.notificacoesEmail}
              onChange={(e) => setConfiguracoes({...configuracoes, notificacoesEmail: e.target.checked})}
              className="mr-3"
            />
            <label htmlFor="notificacoesEmail" className="text-gray-300">
              Notificações por Email
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notificacoesPush"
              checked={configuracoes.notificacoesPush}
              onChange={(e) => setConfiguracoes({...configuracoes, notificacoesPush: e.target.checked})}
              className="mr-3"
            />
            <label htmlFor="notificacoesPush" className="text-gray-300">
              Notificações Push
            </label>
          </div>
        </div>
      </div>

      {/* Configurações do Sistema */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Configurações do Sistema</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="manutencao"
            checked={configuracoes.manutencao}
            onChange={(e) => setConfiguracoes({...configuracoes, manutencao: e.target.checked})}
            className="mr-3"
          />
          <label htmlFor="manutencao" className="text-gray-300">
            Modo de Manutenção
          </label>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Quando ativado, o sistema ficará indisponível para usuários.
        </p>
      </div>
    </div>
  );
};

export default Configuracoes;