import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

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

        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/" className={linkClasses('/')}>
            <Home size={18} />
            Painel de Controle
          </Link>
          <Link to="/lista-usuarios" className={linkClasses('/lista-usuarios')}>
            <Users size={18} />
            Lista de Usuários
          </Link>
          <Link to="/relatorio-usuarios" className={linkClasses('/relatorio-usuarios')}>
            <FileText size={18} />
            Relatório dos Usuários
          </Link>
          <Link to="/relatorio-por-usuario" className={linkClasses('/relatorio-por-usuario')}>
            <Users size={18} />
            Relatório Individual
          </Link>
          <Link to="/relatorio-financeiro" className={linkClasses('/relatorio-financeiro')}>
            <Shield size={18} />
            Relatório Financeiro
          </Link>
          <Link to="/transacoes" className={linkClasses('/transacoes')}>
            <DollarSign size={18} />
            Transações
          </Link>
          <Link to="/saque-usuarios" className={linkClasses('/saque-usuarios')}>
            <Download size={18} />
            Relatório de Saques
          </Link>
          <Link to="/relatorio-geral" className={linkClasses('/relatorio-geral')}>
            <FileText size={18} />
            Relatório Geral
          </Link>
          <Link to="/relatorio-semanal" className={linkClasses('/relatorio-semanal')}>
            <FileText size={18} />
            Relatório Semanal
          </Link>
          <Link to="/estatisticas" className={linkClasses('/estatisticas')}>
            <BarChart2 size={18} />
            Estatísticas
          </Link>
          <Link to="/estatisticas-gerais" className={linkClasses('/estatisticas-gerais')}>
            <TrendingUp size={18} />
            Estatísticas Gerais
          </Link>
          <Link to="/fila" className={linkClasses('/fila')}>
            <List size={18} />
            Fila de Chute
          </Link>
          <Link to="/top-jogadores" className={linkClasses('/top-jogadores')}>
            <TrendingUp size={18} />
            Top Jogadores
          </Link>
          <Link to="/usuarios-bloqueados" className={linkClasses('/usuarios-bloqueados')}>
            <Ban size={18} />
            Usuários Bloqueados
          </Link>
          <Link to="/chutes" className={linkClasses('/chutes')}>
            <List size={18} />
            Chutes Recentes
          </Link>
          <Link to="/logs" className={linkClasses('/logs')}>
            <FileText size={18} />
            Logs do Sistema
          </Link>
          <Link to="/backup" className={linkClasses('/backup')}>
            <Shield size={18} />
            Backup
          </Link>
          <Link to="/configuracoes" className={linkClasses('/configuracoes')}>
            <Settings size={18} />
            Configurações
          </Link>
          <Link to="/exportar-dados" className={linkClasses('/exportar-dados')}>
            <Download size={18} />
            Exportar Dados
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
