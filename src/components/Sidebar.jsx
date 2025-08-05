
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-yellow-100 fixed top-0 left-0 p-4">
      <img src={logo} alt="Logo" className="w-32 mx-auto mb-8" />
      <nav className="space-y-2">
        <Link to="/" className="block px-4 py-2 rounded hover:bg-yellow-300">Dashboard</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
