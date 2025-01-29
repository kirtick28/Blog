import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/create-post', label: 'Create Post', icon: '✍️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>BlogWeb</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, index) => (
              <li
                key={item.path}
                className={currentPath === item.path ? 'active' : ''}
                onClick={() => navigate(item.path)}
                style={{ '--item-index': index }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
            <li className="logout" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </div>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
