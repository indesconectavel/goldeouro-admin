import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../js/auth';
import { safeNavigate, isRouteActive } from '../utils/navigation';
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

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    painel: true, // Apenas Painel expandido por padrão
    usuarios: false,
    estatisticas: false,
    relatorios: false,
    sistema: false,
  });

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };
  const toggleSection = (section) =>
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleLogout = () => {
    try {
      logout();
      setIsOpen(false);
      navigate('/login', { replace: true });
      setTimeout(() => {
        window.location.href = '/login';
      }, 50);
    } catch (error) {
      console.error('Erro durante logout:', error);
      window.location.href = '/login';
    }
  };

  const linkClasses = (path) => {
    const active = isRouteActive(path);
    return `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      active
        ? 'bg-yellow-500 text-black shadow-lg'
        : 'text-white hover:bg-yellow-600 hover:text-black'
    }`;
  };

  // Função para navegação segura
  const handleNavigation = (path) => {
    try {
      // Fechar sidebar em mobile após navegação
      if (isOpen) {
        setIsOpen(false);
      }
      
      // Usar React Router navigate
      navigate(path);
    } catch (error) {
      console.error('Erro na navegação:', error);
    }
  };

  return (
    <>
      {/* Estilos CSS para mobile */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          .sidebar {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border-right: 1px solid #333;
          }
          
          .sidebar button {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          .sidebar button:active {
            transform: scale(0.95);
          }
        }
      `}</style>
      
      {/* Botão mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }}
          className="text-white bg-yellow-500 hover:bg-yellow-600 p-3 rounded-lg shadow-lg transition-colors duration-200"
          title="Abrir/Fechar Menu"
          aria-label="Abrir/Fechar Menu de Navegação"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed top-0 left-0 h-screen w-64 p-6 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-52 h-52 flex items-center justify-center shadow-lg">
            <img
              src="/logo-gol.png"
              alt="Logo Gol de Ouro"
              className="w-48 h-48 object-contain"
              onError={(e) => {
                // Fallback para logo em CSS se a imagem não carregar
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg" style={{display: 'none'}}>
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">GO</span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-yellow-400">GOL DE OURO</h1>
          <p className="text-base text-gray-400">Sistema de Apostas</p>
        </div>

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
                >
                  Lista de Usuários
                </Link>
                <Link 
                  to="/relatorio-usuarios" 
                  className={linkClasses('/relatorio-usuarios')}
                >
                  Relatório dos Usuários
                </Link>
                <Link 
                  to="/lista-usuarios" 
                  title="Abra o relatório individual pelo link na lista de usuários"
                  className={linkClasses('/lista-usuarios')}
                >
                  Relatório Individual
                </Link>
                <Link 
                  to="/usuarios-bloqueados" 
                  className={linkClasses('/usuarios-bloqueados')}
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
                >
                  Estatísticas
                </Link>
                <Link 
                  to="/estatisticas-gerais" 
                  className={linkClasses('/estatisticas-gerais')}
                >
                  Estatísticas Gerais
                </Link>
                <Link 
                  to="/top-jogadores" 
                  className={linkClasses('/top-jogadores')}
                >
                  Top Jogadores
                </Link>
                <Link 
                  to="/fila" 
                  className={linkClasses('/fila')}
                >
                  Fila de Chute
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
                >
                  Financeiro
                </Link>
                <Link 
                  to="/transacoes" 
                  className={linkClasses('/transacoes')}
                >
                  Transações
                </Link>
                <Link 
                  to="/saque-usuarios" 
                  className={linkClasses('/saque-usuarios')}
                >
                  Saques
                </Link>
                <Link 
                  to="/relatorio-geral" 
                  className={linkClasses('/relatorio-geral')}
                >
                  Relatório Geral
                </Link>
                <Link 
                  to="/relatorio-semanal" 
                  className={linkClasses('/relatorio-semanal')}
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
                >
                  Chutes Recentes
                </Link>
                <Link 
                  to="/auditoria" 
                  className={linkClasses('/auditoria')}
                >
                  Auditoria
                </Link>
                <Link 
                  to="/logs" 
                  className={linkClasses('/logs')}
                >
                  Logs do Sistema
                </Link>
                <Link 
                  to="/backup" 
                  className={linkClasses('/backup')}
                >
                  Backup
                </Link>
                <Link 
                  to="/configuracoes" 
                  className={linkClasses('/configuracoes')}
                >
                  Configurações
                </Link>
                <Link 
                  to="/exportar-dados" 
                  className={linkClasses('/exportar-dados')}
                >
                  Exportar Dados
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Botão de Logout */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
