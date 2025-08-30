import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../auth';
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

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSection = (section) =>
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
      location.pathname === path
        ? 'bg-yellow-500 text-white'
        : 'text-white hover:bg-yellow-600'
    }`;

  return (
    <>
      {/* Botão mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="text-white bg-yellow-500 p-2 rounded shadow"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#111827] p-6 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="mb-8 text-center">
          <img
            src="/logo-gol.png"
            alt="Logomarca Gol de Ouro"
            className="mx-auto mb-2"
            style={{ width: '150px', height: '150px' }}
          />
          <h1 className="text-xl font-bold text-yellow-400">Gol de Ouro</h1>
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
                <Link to="/painel" className={linkClasses('/painel')}>
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
                <Link to="/lista-usuarios" className={linkClasses('/lista-usuarios')}>
                  Lista de Usuários
                </Link>
                <Link to="/relatorio-usuarios" className={linkClasses('/relatorio-usuarios')}>
                  Relatório dos Usuários
                </Link>
                <Link to="/relatorio-por-usuario" className={linkClasses('/relatorio-por-usuario')}>
                  Relatório Individual
                </Link>
                <Link to="/usuarios-bloqueados" className={linkClasses('/usuarios-bloqueados')}>
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
                <Link to="/estatisticas" className={linkClasses('/estatisticas')}>
                  Estatísticas
                </Link>
                <Link to="/estatisticas-gerais" className={linkClasses('/estatisticas-gerais')}>
                  Estatísticas Gerais
                </Link>
                <Link to="/top-jogadores" className={linkClasses('/top-jogadores')}>
                  Top Jogadores
                </Link>
                <Link to="/fila" className={linkClasses('/fila')}>
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
                <Link to="/relatorio-financeiro" className={linkClasses('/relatorio-financeiro')}>
                  Financeiro
                </Link>
                <Link to="/transacoes" className={linkClasses('/transacoes')}>
                  Transações
                </Link>
                <Link to="/saque-usuarios" className={linkClasses('/saque-usuarios')}>
                  Saques
                </Link>
                <Link to="/relatorio-geral" className={linkClasses('/relatorio-geral')}>
                  Relatório Geral
                </Link>
                <Link to="/relatorio-semanal" className={linkClasses('/relatorio-semanal')}>
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
                <Link to="/chutes" className={linkClasses('/chutes')}>
                  Chutes Recentes
                </Link>
                <Link to="/logs" className={linkClasses('/logs')}>
                  Logs do Sistema
                </Link>
                <Link to="/backup" className={linkClasses('/backup')}>
                  Backup
                </Link>
                <Link to="/configuracoes" className={linkClasses('/configuracoes')}>
                  Configurações
                </Link>
                <Link to="/exportar-dados" className={linkClasses('/exportar-dados')}>
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
