import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../config/env';
import { safeNavigate, isRouteActive } from '../utils/navigation';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import ResponsiveWrapper from './ResponsiveWrapper';
import Sidebar from './Sidebar'; // Versão original para fallback
import {
  Home,
  Users,
  BarChart2,
  DollarSign,
  Shield,
  List,
  FileText,
  TrendingUp,
  Download,
  Ban,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const SidebarResponsive = () => {
  const { device, isDesktop } = useDeviceDetection();
  
  // Desktop sempre usa versão original (validada)
  if (isDesktop) {
    return <Sidebar />;
  }

  // Mobile e Tablet usam versão responsiva
  return (
    <ResponsiveWrapper
      featureName="RESPONSIVE_SIDEBAR"
      fallback={<Sidebar />}
      desktopFallback={<Sidebar />}
    >
      <SidebarMobileTablet />
    </ResponsiveWrapper>
  );
};

const SidebarMobileTablet = () => {
  const location = useLocation();
  const { device, windowSize } = useDeviceDetection();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    painel: true,
    usuarios: false,
    estatisticas: false,
    relatorios: false,
    sistema: false,
  });

  const toggleSidebar = () => {
    console.log(`📱 Toggle sidebar ${device}:`, isOpen);
    setIsOpen(!isOpen);
  };

  const toggleSection = (section) =>
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const linkClasses = (path) => {
    const active = isRouteActive(path);
    return `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      active
        ? 'bg-yellow-500 text-black shadow-lg'
        : 'text-white hover:bg-yellow-600 hover:text-black'
    }`;
  };

  const handleNavigation = (path) => {
    try {
      // Fechar sidebar após navegação em mobile/tablet
      if (isOpen) {
        setIsOpen(false);
      }
      safeNavigate(path);
    } catch (error) {
      console.error('Erro na navegação:', error);
    }
  };

  // Tamanhos responsivos do logo
  const getLogoSize = () => {
    if (device === 'mobile') {
      return {
        container: 'w-36 h-36', // 150px com padding
        image: 'w-32 h-32', // 150px de largura
        text: 'text-lg'
      };
    } else if (device === 'tablet') {
      return {
        container: 'w-48 h-48', // 200px com padding
        image: 'w-44 h-44', // 200px de largura
        text: 'text-xl'
      };
    }
    return {
      container: 'w-52 h-52',
      image: 'w-48 h-48',
      text: 'text-2xl'
    };
  };

  const logoSize = getLogoSize();

  return (
    <>
      {/* Estilos CSS específicos para mobile/tablet */}
      <style jsx>{`
        @media (max-width: 1023px) {
          .sidebar-responsive {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-right: 1px solid #475569;
          }
          
          .sidebar-responsive button {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          .sidebar-responsive button:active {
            transform: scale(0.95);
          }
        }
      `}</style>
      
      {/* Botões toggle para mobile e tablet - LADO DIREITO */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }}
          className="text-white bg-yellow-500 hover:bg-yellow-600 p-3 rounded-lg shadow-lg transition-colors duration-200"
          title={isOpen ? "Fechar Menu" : "Abrir Menu"}
          aria-label={isOpen ? "Fechar Menu de Navegação" : "Abrir Menu de Navegação"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay para mobile e tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar responsiva */}
      <aside
        className={`sidebar-responsive fixed top-0 left-0 h-screen w-64 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header fixo */}
        <div className="p-6 border-b border-gray-600">
          <div className="text-center">
            <div className={`mx-auto mb-4 ${logoSize.container} flex items-center justify-center shadow-lg`}>
              <img
                src="/logo-gol.png"
                alt="Logo Gol de Ouro"
                className={`${logoSize.image} object-contain`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className={`${logoSize.container} bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg`} style={{display: 'none'}}>
                <div className={`${device === 'mobile' ? 'w-24 h-24' : device === 'tablet' ? 'w-32 h-32' : 'w-40 h-40'} bg-white rounded-full flex items-center justify-center`}>
                  <div className={`${device === 'mobile' ? 'w-20 h-20' : device === 'tablet' ? 'w-28 h-28' : 'w-32 h-32'} bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center`}>
                    <span className={`text-white font-bold ${device === 'mobile' ? 'text-lg' : device === 'tablet' ? 'text-xl' : 'text-4xl'}`}>GO</span>
                  </div>
                </div>
              </div>
            </div>
            <h1 className={`${logoSize.text} font-bold text-yellow-400`}>GOL DE OURO</h1>
            <p className={`${device === 'mobile' ? 'text-sm' : 'text-base'} text-gray-400`}>Sistema de Apostas</p>
          </div>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="flex flex-col gap-2 text-sm text-white">
            {/* Painel */}
            <div>
            <button
              onClick={() => toggleSection('painel')}
              className="flex items-center justify-between w-full px-4 py-2 font-semibold hover:bg-yellow-600 rounded"
            >
              <span className="flex items-center gap-3">
                <Home size={18} />
                Painel
              </span>
              {expanded.painel ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expanded.painel && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Link 
                  to="/painel" 
                  className={linkClasses('/painel')}
                  onClick={() => handleNavigation('/painel')}
                >
                  Painel de Controle
                </Link>
              </div>
            )}
          </div>

          {/* Usuários */}
          <div>
            <button
              onClick={() => toggleSection('usuarios')}
              className="flex items-center justify-between w-full px-4 py-2 font-semibold hover:bg-yellow-600 rounded"
            >
              <span className="flex items-center gap-3">
                <Users size={18} />
                Usuários
              </span>
              {expanded.usuarios ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expanded.usuarios && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Link 
                  to="/lista-usuarios" 
                  className={linkClasses('/lista-usuarios')}
                  onClick={() => handleNavigation('/lista-usuarios')}
                >
                  Lista de Usuários
                </Link>
                <Link 
                  to="/relatorio-usuarios" 
                  className={linkClasses('/relatorio-usuarios')}
                  onClick={() => handleNavigation('/relatorio-usuarios')}
                >
                  Relatório dos Usuários
                </Link>
                <Link 
                  to="/relatorio-por-usuario" 
                  className={linkClasses('/relatorio-por-usuario')}
                  onClick={() => handleNavigation('/relatorio-por-usuario')}
                >
                  Relatório Individual
                </Link>
                <Link 
                  to="/usuarios-bloqueados" 
                  className={linkClasses('/usuarios-bloqueados')}
                  onClick={() => handleNavigation('/usuarios-bloqueados')}
                >
                  Usuários Bloqueados
                </Link>
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div>
            <button
              onClick={() => toggleSection('estatisticas')}
              className="flex items-center justify-between w-full px-4 py-2 font-semibold hover:bg-yellow-600 rounded"
            >
              <span className="flex items-center gap-3">
                <BarChart2 size={18} />
                Estatísticas
              </span>
              {expanded.estatisticas ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expanded.estatisticas && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Link 
                  to="/estatisticas" 
                  className={linkClasses('/estatisticas')}
                  onClick={() => handleNavigation('/estatisticas')}
                >
                  Estatísticas
                </Link>
                <Link 
                  to="/estatisticas-gerais" 
                  className={linkClasses('/estatisticas-gerais')}
                  onClick={() => handleNavigation('/estatisticas-gerais')}
                >
                  Estatísticas Gerais
                </Link>
                <Link 
                  to="/top-jogadores" 
                  className={linkClasses('/top-jogadores')}
                  onClick={() => handleNavigation('/top-jogadores')}
                >
                  Top Jogadores
                </Link>
                <Link 
                  to="/fila" 
                  className={linkClasses('/fila')}
                  onClick={() => handleNavigation('/fila')}
                >
                  Fila de Chute
                </Link>
                <Link 
                  to="/jogo" 
                  className={linkClasses('/jogo')}
                  onClick={() => handleNavigation('/jogo')}
                >
                  🎮 Jogar
                </Link>
              </div>
            )}
          </div>

          {/* Relatórios */}
          <div>
            <button
              onClick={() => toggleSection('relatorios')}
              className="flex items-center justify-between w-full px-4 py-2 font-semibold hover:bg-yellow-600 rounded"
            >
              <span className="flex items-center gap-3">
                <FileText size={18} />
                Relatórios
              </span>
              {expanded.relatorios ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expanded.relatorios && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Link 
                  to="/relatorio-financeiro" 
                  className={linkClasses('/relatorio-financeiro')}
                  onClick={() => handleNavigation('/relatorio-financeiro')}
                >
                  Financeiro
                </Link>
                <Link 
                  to="/transacoes" 
                  className={linkClasses('/transacoes')}
                  onClick={() => handleNavigation('/transacoes')}
                >
                  Transações
                </Link>
                <Link 
                  to="/saque-usuarios" 
                  className={linkClasses('/saque-usuarios')}
                  onClick={() => handleNavigation('/saque-usuarios')}
                >
                  Saques
                </Link>
                <Link 
                  to="/relatorio-geral" 
                  className={linkClasses('/relatorio-geral')}
                  onClick={() => handleNavigation('/relatorio-geral')}
                >
                  Relatório Geral
                </Link>
                <Link 
                  to="/relatorio-semanal" 
                  className={linkClasses('/relatorio-semanal')}
                  onClick={() => handleNavigation('/relatorio-semanal')}
                >
                  Relatório Semanal
                </Link>
              </div>
            )}
          </div>

          {/* Sistema */}
          <div>
            <button
              onClick={() => toggleSection('sistema')}
              className="flex items-center justify-between w-full px-4 py-2 font-semibold hover:bg-yellow-600 rounded"
            >
              <span className="flex items-center gap-3">
                <Settings size={18} />
                Sistema
              </span>
              {expanded.sistema ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expanded.sistema && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Link 
                  to="/chutes" 
                  className={linkClasses('/chutes')}
                  onClick={() => handleNavigation('/chutes')}
                >
                  Chutes Recentes
                </Link>
                <Link 
                  to="/logs" 
                  className={linkClasses('/logs')}
                  onClick={() => handleNavigation('/logs')}
                >
                  Logs do Sistema
                </Link>
                <Link 
                  to="/backup" 
                  className={linkClasses('/backup')}
                  onClick={() => handleNavigation('/backup')}
                >
                  Backup
                </Link>
                <Link 
                  to="/configuracoes" 
                  className={linkClasses('/configuracoes')}
                  onClick={() => handleNavigation('/configuracoes')}
                >
                  Configurações
                </Link>
                <Link 
                  to="/exportar-dados" 
                  className={linkClasses('/exportar-dados')}
                  onClick={() => handleNavigation('/exportar-dados')}
                >
                  Exportar Dados
                </Link>
              </div>
            )}
          </div>
          </nav>

          {/* Botão de Fechar Sidebar */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-gray-600 rounded-lg transition-colors font-medium"
            >
              <X size={18} />
              Fechar Menu
            </button>
          </div>

          {/* Botão de Logout */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-colors font-medium"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarResponsive;
