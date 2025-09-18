import React, { useState, useEffect } from 'react';
import securityLogger from '../utils/securityLogger';

const Backup = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dados fictícios de backup
  const mockBackups = [
    {
      id: 1,
      name: 'backup-completo-2025-09-07-17-30-00',
      type: 'completo',
      size: '2.4 MB',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'concluido',
      description: 'Backup completo do sistema incluindo dados, configurações e logs'
    },
    {
      id: 2,
      name: 'backup-dados-2025-09-07-15-00-00',
      type: 'dados',
      size: '1.8 MB',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'concluido',
      description: 'Backup apenas dos dados dos usuários e transações'
    },
    {
      id: 3,
      name: 'backup-configuracoes-2025-09-07-12-00-00',
      type: 'configuracoes',
      size: '0.3 MB',
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      status: 'concluido',
      description: 'Backup das configurações do sistema'
    },
    {
      id: 4,
      name: 'backup-logs-2025-09-07-10-00-00',
      type: 'logs',
      size: '0.8 MB',
      createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      status: 'concluido',
      description: 'Backup dos logs do sistema'
    },
    {
      id: 5,
      name: 'backup-completo-2025-09-07-08-00-00',
      type: 'completo',
      size: '2.1 MB',
      createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
      status: 'erro',
      description: 'Backup completo do sistema (falhou)'
    }
  ];

  useEffect(() => {
    setBackups(mockBackups);
  }, []);

  const handleCreateBackup = async (type) => {
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      // Log de segurança
      securityLogger.logSecurityError(
        new Error('Backup creation attempt'),
        { type, timestamp: new Date().toISOString() }
      );

      // Simular criação de backup
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newBackup = {
        id: Date.now(),
        name: `backup-${type}-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`,
        type,
        size: type === 'completo' ? '2.4 MB' : type === 'dados' ? '1.8 MB' : '0.5 MB',
        createdAt: new Date().toISOString(),
        status: 'concluido',
        description: `Backup ${type} criado com sucesso`
      };

      setBackups(prev => [newBackup, ...prev]);
      setSuccess(`Backup ${type} criado com sucesso!`);

      // Limpar sucesso após 5 segundos
      setTimeout(() => setSuccess(''), 5000);

    } catch (error) {
      console.error('Erro ao criar backup:', error);
      setError('Erro ao criar backup');
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    setRestoring(backupId);
    setError('');
    setSuccess('');

    try {
      // Log de segurança
      securityLogger.logSecurityError(
        new Error('Backup restore attempt'),
        { backupId, timestamp: new Date().toISOString() }
      );

      // Simular restauração
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess('Backup restaurado com sucesso!');

      // Limpar sucesso após 5 segundos
      setTimeout(() => setSuccess(''), 5000);

    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      setError('Erro ao restaurar backup');
    } finally {
      setRestoring(null);
    }
  };

  const handleDownloadBackup = (backup) => {
    // Log de segurança
    securityLogger.logSecurityError(
      new Error('Backup download attempt'),
      { backupId: backup.id, backupName: backup.name }
    );

    // Simular download
    const blob = new Blob(['Backup data'], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backup.name}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    setSuccess(`Download do backup ${backup.name} iniciado!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteBackup = async (backupId) => {
    if (!window.confirm('Tem certeza que deseja excluir este backup?')) {
      return;
    }

    try {
      // Log de segurança
      securityLogger.logSecurityError(
        new Error('Backup deletion attempt'),
        { backupId, timestamp: new Date().toISOString() }
      );

      setBackups(prev => prev.filter(backup => backup.id !== backupId));
      setSuccess('Backup excluído com sucesso!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Erro ao excluir backup:', error);
      setError('Erro ao excluir backup');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido': return 'text-green-400 bg-green-500/20';
      case 'erro': return 'text-red-400 bg-red-500/20';
      case 'processando': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'completo': return '💾';
      case 'dados': return '📊';
      case 'configuracoes': return '⚙️';
      case 'logs': return '📝';
      default: return '📁';
    }
  };

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">💾 Backup do Sistema</h1>
          <p className="text-gray-400">Gerencie backups dos dados, configurações e logs do sistema</p>
        </div>

        {/* Mensagens de Feedback */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Ações de Backup */}
        <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-yellow-400 mb-6">🔄 Criar Novo Backup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleCreateBackup('completo')}
              disabled={creating}
              className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              <div className="text-2xl mb-2">💾</div>
              <div className="text-sm">Backup Completo</div>
              <div className="text-xs text-gray-300">Dados + Config + Logs</div>
            </button>

            <button
              onClick={() => handleCreateBackup('dados')}
              disabled={creating}
              className="p-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">Backup de Dados</div>
              <div className="text-xs text-gray-300">Usuários + Transações</div>
            </button>

            <button
              onClick={() => handleCreateBackup('configuracoes')}
              disabled={creating}
              className="p-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm">Backup Config</div>
              <div className="text-xs text-gray-300">Configurações</div>
            </button>

            <button
              onClick={() => handleCreateBackup('logs')}
              disabled={creating}
              className="p-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm">Backup de Logs</div>
              <div className="text-xs text-gray-300">Logs do Sistema</div>
            </button>
          </div>

          {creating && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-yellow-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                <span>Criando backup...</span>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Backups */}
        <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400 mb-6">📋 Backups Disponíveis</h2>
          
          {backups.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Nenhum backup encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getTypeIcon(backup.type)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{backup.name}</h3>
                        <p className="text-sm text-gray-400">{backup.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Criado: {new Date(backup.createdAt).toLocaleString('pt-BR')}
                          </span>
                          <span className="text-xs text-gray-500">Tamanho: {backup.size}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(backup.status)}`}>
                            {backup.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadBackup(backup)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition duration-200"
                      >
                        📥 Download
                      </button>
                      
                      <button
                        onClick={() => handleRestoreBackup(backup.id)}
                        disabled={restoring === backup.id || backup.status === 'erro'}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded transition duration-200"
                      >
                        {restoring === backup.id ? '🔄 Restaurando...' : '🔄 Restaurar'}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition duration-200"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estatísticas de Backup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">📊 Estatísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Backups:</span>
                <span className="text-white font-semibold">{backups.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Backups Completos:</span>
                <span className="text-white font-semibold">
                  {backups.filter(b => b.type === 'completo').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Último Backup:</span>
                <span className="text-white font-semibold">
                  {backups.length > 0 ? new Date(backups[0].createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">💾 Espaço em Disco</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Usado:</span>
                <span className="text-white font-semibold">4.2 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Disponível:</span>
                <span className="text-white font-semibold">95.8 MB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '4.2%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#1A202C] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">⚙️ Configurações</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Backup Automático:</span>
                <span className="text-green-400 font-semibold">Ativo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Frequência:</span>
                <span className="text-white font-semibold">Diário</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Retenção:</span>
                <span className="text-white font-semibold">30 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;