import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../config/env';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Ícones SVG profissionais
  const Icons = {
    Home: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    Users: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    Chart: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    Game: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Report: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Settings: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    Export: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Logout: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    ChevronRight: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    Menu: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )
  };

  const menuItems = [
    {
      label: 'Painel',
      icon: Icons.Home,
      path: '/',
      submenu: [
        { label: 'Painel de Controle', path: '/' }
      ]
    },
    {
      label: 'Usuários',
      icon: Icons.Users,
      path: '/usuarios',
      submenu: [
        { label: 'Lista de Usuários', path: '/usuarios' },
        { label: 'Relatório dos Usuários', path: '/usuarios/relatorio' },
        { label: 'Relatório Individual', path: '/usuarios/individual' },
        { label: 'Usuários Bloqueados', path: '/usuarios/bloqueados' }
      ]
    },
    {
      label: 'Estatísticas',
      icon: Icons.Chart,
      path: '/metricas',
      submenu: [
        { label: 'Estatísticas', path: '/metricas' },
        { label: 'Top Jogadores', path: '/metricas/top-jogadores' },
        { label: 'Fila de Chute', path: '/metricas/fila' }
      ]
    },
    {
      label: 'Relatórios',
      icon: Icons.Report,
      path: '/pagamentos',
      submenu: [
        { label: 'Financeiro', path: '/pagamentos' },
        { label: 'Transações', path: '/pagamentos/transacoes' },
        { label: 'Saques', path: '/pagamentos/saques' },
        { label: 'Relatório Geral', path: '/pagamentos/geral' },
        { label: 'Relatório Semanal', path: '/pagamentos/semanal' },
        { label: 'Jogar', path: '/jogar' },
        { label: 'Exportar Dados', path: '/exportar' }
      ]
    },
    {
      label: 'Sistema',
      icon: Icons.Settings,
      path: '/sistema',
      submenu: [
        { label: 'Chutes Recentes', path: '/sistema/chutes' },
        { label: 'Logs do Sistema', path: '/sistema/logs' },
        { label: 'Backup', path: '/sistema/backup' },
        { label: 'Configurações', path: '/sistema/config' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSubmenu = (index) => {
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  return (
    <div className={`bg-[#111827] min-h-screen border-r border-[#2c3e50] transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header com Toggle */}
      <div className="p-4 border-b border-[#2c3e50]">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex flex-col items-center space-y-3 w-full">
              <img 
                src="/src/assets/logo.png" 
                alt="Gol de Ouro Logo" 
                className="w-[150px] h-auto"
                onError={(e) => {
                  console.log('Erro ao carregar logo:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">GOL DE OURO</h1>
                <p className="text-gray-400 text-sm">Sistema de Apostas</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            title={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            <Icons.Menu />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => item.submenu.length > 0 ? toggleSubmenu(index) : null}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-lg text-left transition-colors ${
                  isActive(item.path) || (item.submenu && item.submenu.some(sub => isActive(sub.path)))
                    ? 'bg-yellow-400 text-yellow-900 border border-yellow-400'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <div className="flex items-center space-x-3">
                  <item.icon />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
                {!sidebarCollapsed && item.submenu.length > 0 && (
                  <Icons.ChevronRight className={`transform transition-transform ${
                    expandedMenu === index ? 'rotate-90' : ''
                  }`} />
                )}
              </button>

              {/* Submenu */}
              {!sidebarCollapsed && item.submenu && expandedMenu === index && (
                <ul className="mt-2 ml-8 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={subItem.path}
                        className={`block p-2 rounded-lg text-sm transition-colors ${
                          isActive(subItem.path)
                            ? 'text-yellow-400 bg-yellow-400/20'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className={`absolute bottom-4 ${sidebarCollapsed ? 'left-2 right-2' : 'left-4 right-4'}`}>
        <button
          onClick={logout}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors`}
          title={sidebarCollapsed ? 'Sair' : ''}
        >
          <Icons.Logout />
          {!sidebarCollapsed && (
            <span className="font-medium">Sair</span>
          )}
        </button>
      </div>
          </div>
  );
};

export default Navigation;
