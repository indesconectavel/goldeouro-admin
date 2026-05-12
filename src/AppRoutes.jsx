// src/AppRoutes.jsx

import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
// Removido ProtectedRoute - usando proteção direta no MainLayout

// Páginas
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Users";
import RelatorioUsuarios from "./pages/RelatorioUsuarios";
import RelatorioPorUsuario from "./pages/RelatorioPorUsuario";
import RelatorioFinanceiro from "./pages/RelatorioFinanceiro";
import RelatorioGeral from "./pages/RelatorioGeral";
import RelatorioSemanal from "./pages/RelatorioSemanal";
import Estatisticas from "./pages/Estatisticas";
import EstatisticasGerais from "./pages/EstatisticasGerais";
import Transacoes from "./pages/Transacoes";
import SaqueUsuarios from "./pages/SaqueUsuarios";
import UsuariosBloqueados from "./pages/UsuariosBloqueados";
import Fila from "./pages/Fila";
import TopJogadores from "./pages/TopJogadores";
import Backup from "./pages/Backup";
import Configuracoes from "./pages/Configuracoes";
import ExportarDados from "./pages/ExportarDados";
import Logs from "./pages/LogsSistema";
import Auditoria from "./pages/Auditoria";
import Chutes from "./pages/ChutesRecentes";
import Logout from "./components/Logout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/logout"
        element={<Logout />}
      />
      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/painel"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/lista-usuarios"
        element={
        <MainLayout>
          <Users />
        </MainLayout>
        }
      />
      <Route
        path="/relatorio-usuarios"
        element={
        <MainLayout>
              <RelatorioUsuarios />
          </MainLayout>
        }
      />
      <Route
        path="/relatorio-por-usuario"
        element={
        <MainLayout>
              <RelatorioPorUsuario />
          </MainLayout>
        }
      />
      <Route
        path="/relatorio-financeiro"
        element={
        <MainLayout>
              <RelatorioFinanceiro />
          </MainLayout>
        }
      />
      <Route
        path="/relatorio-geral"
        element={
        <MainLayout>
              <RelatorioGeral />
          </MainLayout>
        }
      />
      <Route
        path="/relatorio-semanal"
        element={
        <MainLayout>
              <RelatorioSemanal />
          </MainLayout>
        }
      />
      <Route
        path="/estatisticas"
        element={
        <MainLayout>
              <Estatisticas />
          </MainLayout>
        }
      />
      <Route
        path="/estatisticas-gerais"
        element={
        <MainLayout>
              <EstatisticasGerais />
          </MainLayout>
        }
      />
      <Route
        path="/transacoes"
        element={
        <MainLayout>
              <Transacoes />
          </MainLayout>
        }
      />
      <Route
        path="/saque-usuarios"
        element={
        <MainLayout>
              <SaqueUsuarios />
          </MainLayout>
        }
      />
      <Route
        path="/usuarios-bloqueados"
        element={
        <MainLayout>
              <UsuariosBloqueados />
          </MainLayout>
        }
      />
      <Route
        path="/fila"
        element={
        <MainLayout>
              <Fila />
          </MainLayout>
        }
      />
      <Route
        path="/top-jogadores"
        element={
        <MainLayout>
              <TopJogadores />
          </MainLayout>
        }
      />
      <Route
        path="/backup"
        element={
        <MainLayout>
              <Backup />
          </MainLayout>
        }
      />
      <Route
        path="/configuracoes"
        element={
        <MainLayout>
              <Configuracoes />
          </MainLayout>
        }
      />
      <Route
        path="/exportar-dados"
        element={
        <MainLayout>
              <ExportarDados />
          </MainLayout>
        }
      />
      <Route
        path="/logs"
        element={
        <MainLayout>
              <Logs />
          </MainLayout>
        }
      />
      <Route
        path="/auditoria"
        element={
          <MainLayout>
            <Auditoria />
          </MainLayout>
        }
      />
      <Route
        path="/chutes"
        element={
        <MainLayout>
              <Chutes />
          </MainLayout>
        }
      />
    </Routes>
  );
}
