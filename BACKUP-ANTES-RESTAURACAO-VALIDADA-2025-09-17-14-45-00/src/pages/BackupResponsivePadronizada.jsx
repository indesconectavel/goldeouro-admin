// src/pages/BackupResponsivePadronizada.jsx

import React, { useState, useEffect } from 'react';
import securityLogger from '../utils/securityLogger';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import StandardPageLayout from '../components/StandardPageLayout';
import ResponsiveCard, { SectionCard } from '../components/ResponsiveCard';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ResponsiveTable, { StatusBadge } from '../components/ResponsiveTable';
import Backup from './Backup';

const BackupResponsivePadronizada = () => {
  const { device, isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <Backup />;
  }

  // Mobile e Tablet usam versão responsiva padronizada
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_BACKUP"
      fallback={<Backup />}
      desktopFallback={<Backup />}
    >
      <BackupMobileTabletPadronizada />
    </ResponsiveWrapper>
  );
};

const BackupMobileTabletPadronizada = () => {
  const { device, isMobile } = useDeviceDetection();
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simular busca de backups
      const mockBackups = [
        {
          id: 1,
          name: 'backup_2025_01_09_001.sql',
          size: '2.5 MB',
          created_at: new Date().toISOString(),
          status: 'completed',
          type: 'full'
        },
        {
          id: 2,
          name: 'backup_2025_01_08_001.sql',
          size: '2.3 MB',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          type: 'full'
        },
        {
          id: 3,
          name: 'backup_2025_01_07_001.sql',
          size: '2.1 MB',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed',
          type: 'incremental'
        },
        {
          id: 4,
          name: 'backup_2025_01_06_001.sql',
          size: '2.4 MB',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          status: 'failed',
          type: 'full'
        }
      ];
      setBackups(mockBackups);
    } catch (error) {
      console.error('Erro ao buscar backups:', error);
      setError('Erro ao carregar lista de backups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      securityLogger.log('BACKUP_CREATE_ATTEMPT', { device, timestamp: new Date().toISOString() });
      
      // Simular criação de backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup = {
        id: Date.now(),
        name: `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.sql`,
        size: '2.6 MB',
        created_at: new Date().toISOString(),
        status: 'completed',
        type: 'full'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      securityLogger.log('BACKUP_CREATE_SUCCESS', { backupId: newBackup.id });
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      setError('Erro ao criar backup');
      securityLogger.log('BACKUP_CREATE_ERROR', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = (backup) => {
    try {
      securityLogger.log('BACKUP_DOWNLOAD_ATTEMPT', { backupId: backup.id });
      // Simular download
      console.log('Downloading backup:', backup.name);
      securityLogger.log('BACKUP_DOWNLOAD_SUCCESS', { backupId: backup.id });
    } catch (error) {
      console.error('Erro ao baixar backup:', error);
      securityLogger.log('BACKUP_DOWNLOAD_ERROR', { error: error.message });
    }
  };

  const handleDeleteBackup = (backup) => {
    try {
      securityLogger.log('BACKUP_DELETE_ATTEMPT', { backupId: backup.id });
      setBackups(prev => prev.filter(b => b.id !== backup.id));
      securityLogger.log('BACKUP_DELETE_SUCCESS', { backupId: backup.id });
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
      securityLogger.log('BACKUP_DELETE_ERROR', { error: error.message });
    }
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (value, backup) => (
        <div className="font-medium text-white">{backup.name}</div>
      )
    },
    {
      key: 'size',
      label: 'Tamanho',
      render: (value, backup) => (
        <div className="text-gray-300">{backup.size}</div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value, backup) => (
        <StatusBadge 
          status={backup.type === 'full' ? 'Completo' : 'Incremental'} 
          className={backup.type === 'full' ? 'bg-blue-600' : 'bg-purple-600'}
        />
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, backup) => (
        <StatusBadge 
          status={backup.status === 'completed' ? 'Concluído' : 'Falhou'} 
          className={backup.status === 'completed' ? 'bg-green-600' : 'bg-red-600'}
        />
      )
    },
    {
      key: 'created_at',
      label: 'Criado em',
      render: (value, backup) => (
        <div className="text-gray-300 text-sm">
          {new Date(backup.created_at).toLocaleDateString('pt-BR')}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (value, backup) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleDownloadBackup(backup)}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Baixar
          </button>
          <button
            onClick={() => handleDeleteBackup(backup)}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      )
    }
  ];

  // Estatísticas para cards
  const stats = [
    {
      title: 'Total de Backups',
      value: backups.length,
      icon: '💾',
      color: 'text-blue-400'
    },
    {
      title: 'Backups Completos',
      value: backups.filter(b => b.type === 'full').length,
      icon: '📦',
      color: 'text-green-400'
    },
    {
      title: 'Backups Incrementais',
      value: backups.filter(b => b.type === 'incremental').length,
      icon: '🔄',
      color: 'text-purple-400'
    },
    {
      title: 'Backups Concluídos',
      value: backups.filter(b => b.status === 'completed').length,
      icon: '✅',
      color: 'text-green-400'
    }
  ];

  return (
    <StandardPageLayout
      title="💾 Gerenciamento de Backup"
      description="Gerencie backups do sistema e dados"
    >
      {/* Cards de Estatísticas */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Estatísticas</h2>
        <ResponsiveGrid columns="auto" gap="default">
          {stats.map((stat, index) => (
            <ResponsiveCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              className={stat.color}
            />
          ))}
        </ResponsiveGrid>
      </div>

      {/* Ações de Backup */}
      <div className="mb-8">
        <SectionCard title="🔧 Ações">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <p className="text-gray-300 flex-1">
              Crie um novo backup do sistema
            </p>
            <button
              onClick={handleCreateBackup}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Criando...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Criar Backup
                </>
              )}
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Lista de Backups */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Lista de Backups ({backups.length})
        </h2>
        <SectionCard title="Backups">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Nenhum backup encontrado</p>
            </div>
          ) : (
            <ResponsiveTable
              data={backups}
              columns={columns}
              mobileView="cards"
              emptyMessage="Nenhum backup encontrado"
              onRowClick={(backup) => console.log('Clicou em:', backup)}
            />
          )}
        </SectionCard>
      </div>
    </StandardPageLayout>
  );
};

export default BackupResponsivePadronizada;
