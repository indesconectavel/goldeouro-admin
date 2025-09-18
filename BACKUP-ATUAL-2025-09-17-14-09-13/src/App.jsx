import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Games from './pages/Games';
import Payments from './pages/Payments';
import Withdrawals from './pages/Withdrawals';
import Notifications from './pages/Notifications';
import System from './pages/System';
import Profile from './pages/Profile';
import Login from './pages/Login';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'games':
        return <Games />;
      case 'payments':
        return <Payments />;
      case 'withdrawals':
        return <Withdrawals />;
      case 'notifications':
        return <Notifications />;
      case 'system':
        return <System />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderPage()}
    </Layout>
  );
};

export default App;