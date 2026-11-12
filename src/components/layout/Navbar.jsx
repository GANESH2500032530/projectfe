import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const Navbar = ({ onToggleMobileMenu }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useData();
  const { addToast } = useToast();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      addToast('Signed out successfully.', 'info');
    }
  };

  return (
    <header className="top-header no-print">
      <div className="flex items-center gap-3">
        <button
          className="mobile-menu-btn"
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <div className="header-title-group">
          <h2>Student Report System</h2>
          <p>Empowering educators, students, and parents with comprehensive analytics</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Theme Toggle Button */}
        <button
          type="button"
          className="btn btn-outline btn-icon-only theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        {/* Sign Out Button */}
        <button
          type="button"
          className="btn btn-outline btn-sm action-logout"
          onClick={handleLogout}
          title="Sign out of system"
        >
          <span>🚪 Sign Out</span>
        </button>
      </div>
    </header>
  );
};
