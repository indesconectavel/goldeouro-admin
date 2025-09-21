// src/AppRoutes-simple.jsx

import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ListaUsuarios from "./pages/ListaUsuarios";
import RelatorioUsuarios from "./pages/RelatorioUsuarios";
import RelatorioFinanceiro from "./pages/RelatorioFinanceiro";
import Estatisticas from "./pages/Estatisticas";
import Transacoes from "./pages/Transacoes";
import SaqueUsuarios from "./pages/SaqueUsuarios";
import UsuariosBloqueados from "./pages/UsuariosBloqueados";
import Fila from "./pages/Fila";
import TopJogadores from "./pages/TopJogadores";
import Backup from "./pages/Backup";
import Configuracoes from "./pages/Configuracoes";
import ExportarDados from "./pages/ExportarDados";
import LogsSistema from "./pages/LogsSistema";
import ChutesRecentes from "./pages/ChutesRecentes";
import Game from "./pages/Game";

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
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />
      
      {/* Rotas protegidas */}
      <Route path="/*" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Rota raiz redireciona para /painel */}
        <Route index element={<Navigate to="/painel" replace />} />
        
        {/* Rotas principais */}
        <Route path="painel" element={<Dashboard />} />
        <Route path="lista-usuarios" element={<ListaUsuarios />} />
        <Route path="relatorio-usuarios" element={<RelatorioUsuarios />} />
        <Route path="relatorio-financeiro" element={<RelatorioFinanceiro />} />
        <Route path="transacoes" element={<Transacoes />} />
        <Route path="saque-usuarios" element={<SaqueUsuarios />} />
        <Route path="usuarios-bloqueados" element={<UsuariosBloqueados />} />
        
        {/* Rotas adicionais */}
        <Route path="estatisticas" element={<Estatisticas />} />
        <Route path="fila" element={<Fila />} />
        <Route path="top-jogadores" element={<TopJogadores />} />
        <Route path="backup" element={<Backup />} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="exportar-dados" element={<ExportarDados />} />
        <Route path="logs" element={<LogsSistema />} />
        <Route path="chutes" element={<ChutesRecentes />} />
        <Route path="jogo" element={<Game />} />
        
        {/* Fallback para rotas inexistentes */}
        <Route path="*" element={<Navigate to="/painel" replace />} />
      </Route>
    </Routes>
  );
}



