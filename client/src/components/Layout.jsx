import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/home">BlogWeb</Link>
        </div>
        <div className="nav-links">
          <Link 
            to="/home" 
            className={location.pathname === '/home' ? 'active' : ''}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            <i className="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/create-post" 
            className={location.pathname === '/create-post' ? 'active' : ''}
          >
            <i className="fas fa-pen-to-square"></i>
            <span>Create Post</span>
          </Link>
          <Link 
            to="/profile" 
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
