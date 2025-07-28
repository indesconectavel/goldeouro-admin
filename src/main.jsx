import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Páginas (iremos criá-las já já)
import Fila from './pages/Fila.jsx';
import Estatisticas from './pages/Estatisticas.jsx';
import TopJogadores from './pages/TopJogadores.jsx';
import Transacoes from './pages/Transacoes.jsx';
import Chutes from './pages/Chutes.jsx';
import RelatorioUsuarios from './pages/RelatorioUsuarios.jsx';
import TodosUsuarios from './pages/TodosUsuarios.jsx';
import Logs from './pages/Logs.jsx';
import Bloqueados from './pages/Bloqueados.jsx';
import Backup from './pages/Backup.jsx';
import RelatorioSemanal from './pages/RelatorioSemanal.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/relatorio-semanal" element={<RelatorioSemanal />} />
        <Route path="/fila" element={<Fila />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="/top-jogadores" element={<TopJogadores />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/chutes" element={<Chutes />} />
        <Route path="/relatorio-usuarios" element={<RelatorioUsuarios />} />
        <Route path="/usuarios" element={<TodosUsuarios />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/bloqueados" element={<Bloqueados />} />
        <Route path="/backup" element={<Backup />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
