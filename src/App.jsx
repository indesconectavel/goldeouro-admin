import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './js/auth';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/TodosUsuarios';
import Estatisticas from './pages/Estatisticas';
import Fila from './pages/Fila';
import Chutes from './pages/Chutes';
import Transacoes from './pages/Transacoes';
import TopJogadores from './pages/TopJogadores';
import Logs from './pages/Logs';
import Bloqueados from './pages/Bloqueados';
import Backup from './pages/Backup';
import Login from './pages/Login';

export default function App() {
  const ProtectedRoute = ({ children }) =>
    isAuthenticated() ? children : <Navigate to="/" />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={
            isAuthenticated() ? (
              <div className="flex">
                <Sidebar />
                <Routes>
                  <Route path="/painel" element={<Dashboard />} />
                  <Route path="/usuarios" element={<Usuarios />} />
                  <Route path="/estatisticas" element={<Estatisticas />} />
                  <Route path="/fila" element={<Fila />} />
                  <Route path="/chutes" element={<Chutes />} />
                  <Route path="/transacoes" element={<Transacoes />} />
                  <Route path="/top-jogadores" element={<TopJogadores />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/bloqueados" element={<Bloqueados />} />
                  <Route path="/backup" element={<Backup />} />
                </Routes>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
