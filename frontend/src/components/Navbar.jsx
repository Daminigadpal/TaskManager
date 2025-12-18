import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status when component mounts or location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    try {
      // Clear the token
      localStorage.removeItem('token');
      
      // Update state
      setIsAuthenticated(false);
      
      // Show success message
      toast.success('You have been logged out successfully');
      
      // Force a re-render by navigating to the login page
      navigate('/login', { replace: true });
      
      // Force a hard refresh to ensure all protected routes re-render
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <h2 style={styles.logo}>Task Manager</h2>
      </div>
      <div style={styles.navLinks}>
        {isAuthenticated ? (
          <>
            <Link style={styles.link} to="/tasks">Dashboard</Link>
            <Link style={styles.link} to="/add-task">Add Task</Link>
            <button 
              onClick={handleLogout} 
              style={styles.logoutBtn}
              title="Logout"
            >
              <i className="bi bi-box-arrow-right" style={{ marginRight: '5px' }}></i>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link style={styles.link} to="/login">Login</Link>
            <Link style={styles.link} to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '1rem 2rem', 
    background: '#2c3e50',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    color: '#fff' 
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #3498db, #9b59b6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: { 
    color: '#ecf0f1', 
    textDecoration: 'none',
    padding: '0.5rem 0',
    position: 'relative',
    transition: 'color 0.3s ease',
    fontWeight: '500',
  },
  logoutBtn: { 
    background: '#e74c3c',
    color: 'white', 
    border: 'none', 
    padding: '0.5rem 1rem', 
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  }
};

export default Navbar;