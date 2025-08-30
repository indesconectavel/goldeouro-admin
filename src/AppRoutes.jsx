// src/AppRoutes.jsx

import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Função safeLazy para capturar erros de import
const safeLazy = (importFunc, pageName) => {
  const LazyComponent = React.lazy(importFunc);
  
  return React.forwardRef((props, ref) => (
    <Suspense fallback={<PageLoading />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Componente de fallback para erros de import
const ImportErrorFallback = ({ pageName }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar página</h2>
      <p className="text-gray-600 mb-4">Não foi possível carregar: {pageName}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Tentar Novamente
      </button>
    </div>
  </div>
);

// Lazy loading das páginas com fallback seguro
const Dashboard = safeLazy(() => import("./pages/Dashboard"), "Dashboard");
const ListaUsuarios = safeLazy(() => import("./pages/ListaUsuarios"), "Lista de Usuários");
const RelatorioUsuarios = safeLazy(() => import("./pages/RelatorioUsuarios"), "Relatório de Usuários");
const RelatorioPorUsuario = safeLazy(() => import("./pages/RelatorioPorUsuario"), "Relatório por Usuário");
const RelatorioFinanceiro = safeLazy(() => import("./pages/RelatorioFinanceiro"), "Relatório Financeiro");
const RelatorioGeral = safeLazy(() => import("./pages/RelatorioGeral"), "Relatório Geral");
const RelatorioSemanal = safeLazy(() => import("./pages/RelatorioSemanal"), "Relatório Semanal");
const Estatisticas = safeLazy(() => import("./pages/Estatisticas"), "Estatísticas");
const EstatisticasGerais = safeLazy(() => import("./pages/EstatisticasGerais"), "Estatísticas Gerais");
const Transacoes = safeLazy(() => import("./pages/Transacoes"), "Transações");
const SaqueUsuarios = safeLazy(() => import("./pages/SaqueUsuarios"), "Saques de Usuários");
const UsuariosBloqueados = safeLazy(() => import("./pages/UsuariosBloqueados"), "Usuários Bloqueados");
const Fila = safeLazy(() => import("./pages/Fila"), "Fila");
const TopJogadores = safeLazy(() => import("./pages/TopJogadores"), "Top Jogadores");
const Backup = safeLazy(() => import("./pages/Backup"), "Backup");
const Configuracoes = safeLazy(() => import("./pages/Configuracoes"), "Configurações");
const ExportarDados = safeLazy(() => import("./pages/ExportarDados"), "Exportar Dados");
const LogsSistema = safeLazy(() => import("./pages/LogsSistema"), "Logs do Sistema");
const ChutesRecentes = safeLazy(() => import("./pages/ChutesRecentes"), "Chutes Recentes");

// Componente de loading para Suspense
const PageLoading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
      <p className="text-sm text-gray-400">Carregando página...</p>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Rota raiz redireciona para /painel */}
        <Route index element={<Navigate to="/painel" replace />} />
        
        {/* Rotas principais */}
        <Route path="painel" element={<Dashboard />} />
        <Route path="lista-usuarios" element={<ListaUsuarios />} />
        <Route path="relatorio-usuarios" element={<RelatorioUsuarios />} />
        <Route path="relatorio-por-usuario" element={<RelatorioPorUsuario />} />
        <Route path="relatorio-por-usuario/:userId" element={<RelatorioPorUsuario />} />
        <Route path="relatorio-semanal" element={<RelatorioSemanal />} />
        <Route path="relatorio-financeiro" element={<RelatorioFinanceiro />} />
        <Route path="transacoes" element={<Transacoes />} />
        <Route path="saque-usuarios" element={<SaqueUsuarios />} />
        <Route path="relatorio-geral" element={<RelatorioGeral />} />
        <Route path="usuarios-bloqueados" element={<UsuariosBloqueados />} />
        
        {/* Rotas adicionais */}
        <Route path="estatisticas" element={<Estatisticas />} />
        <Route path="estatisticas-gerais" element={<EstatisticasGerais />} />
        <Route path="fila" element={<Fila />} />
        <Route path="top-jogadores" element={<TopJogadores />} />
        <Route path="backup" element={<Backup />} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="exportar-dados" element={<ExportarDados />} />
        <Route path="logs" element={<LogsSistema />} />
        <Route path="chutes" element={<ChutesRecentes />} />
        
        {/* Fallback para rotas inexistentes */}
        <Route path="*" element={<Navigate to="/painel" replace />} />
      </Route>
    </Routes>
  );
}
