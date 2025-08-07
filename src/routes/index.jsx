import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Páginas
import Dashboard from '../pages/Dashboard';
import RelatorioUsuarios from '../pages/RelatorioUsuarios';
import RelatorioSaques from '../pages/RelatorioSaques';
import RelatorioTransacoes from '../pages/RelatorioTransacoes';
import RelatorioGeral from '../pages/RelatorioGeral';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/usuarios" element={<RelatorioUsuarios />} />
      <Route path="/saques" element={<RelatorioSaques />} />
      <Route path="/transacoes" element={<RelatorioTransacoes />} />
      <Route path="/relatorio" element={<RelatorioGeral />} />
    </Routes>
  );
};

export default AppRoutes;
