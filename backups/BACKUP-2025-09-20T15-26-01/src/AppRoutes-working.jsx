// src/AppRoutes-working.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

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
        
        {/* Fallback para rotas inexistentes */}
        <Route path="*" element={<Navigate to="/painel" replace />} />
      </Route>
    </Routes>
  );
}



