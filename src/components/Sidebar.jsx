import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const location = useLocation();
  const menu = [
    { label: 'Dashboard', path: '/painel' },
    { label: 'Relatórios', path: '/relatorios' },
    { label: 'Usuários', path: '/usuarios' },
    { label: 'Estatísticas', path: '/estatisticas' },
    { label: 'Fila de Jogo', path: '/fila' },
    { label: 'Chutes', path: '/chutes' },
    { label: 'Transações', path: '/transacoes' },
    { label: 'Top Jogadores', path: '/top-jogadores' },
    { label: 'Logs', path: '/logs' },
    { label: 'Bloqueados', path: '/bloqueados' },
    { label: 'Backup', path: '/backup' },
  ];

  return (
    <div className="h-screen w-64 bg-yellow-100 border-r fixed top-0 left-0 p-4 flex flex-col">
      <div className="flex items-center mb-8 justify-center">
        <img src={logo} alt="Gol de Ouro" className="w-32" />
      </div>
      <nav className="flex-1">
        {menu.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className={`block px-4 py-2 rounded font-medium mb-1 transition ${
              location.pathname === path
                ? 'bg-yellow-400 text-black'
                : 'text-gray-700 hover:bg-yellow-200'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem('adminToken');
          window.location.href = '/';
        }}
        className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  );
};

export default Sidebar;
