import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Sidebar = ({ activeView, setActiveView, isMobileOpen, onCloseMobile }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      addToast('Signed out successfully.', 'info');
    }
  };

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    onCloseMobile();
  };

  const initial = (currentUser?.name || 'U').charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-backdrop ${isMobileOpen ? 'active' : ''}`}
        onClick={onCloseMobile}
      />

      <aside className={`sidebar ${isMobileOpen ? 'open' : ''} no-print`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">🎓</div>
          <div>
            <div className="sidebar-title">SRS Suite</div>
            <span className="sidebar-badge">
              {isAdmin ? 'Teacher Portal' : 'Student Portal'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {isAdmin ? (
            <div>
              <div className="nav-section-title">Admin Management</div>
              <button
                type="button"
                className={`nav-item ${activeView === 'admin-dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('admin-dashboard')}
              >
                <span>📊</span> Dashboard Overview
              </button>
              <button
                type="button"
                className={`nav-item ${activeView === 'admin-students' ? 'active' : ''}`}
                onClick={() => handleNavClick('admin-students')}
              >
                <span>👥</span> Student Directory
              </button>
              <button
                type="button"
                className={`nav-item ${activeView === 'admin-grading' ? 'active' : ''}`}
                onClick={() => handleNavClick('admin-grading')}
              >
                <span>⚙️</span> Grading Schemes
              </button>
              <button
                type="button"
                className={`nav-item ${activeView === 'admin-config' ? 'active' : ''}`}
                onClick={() => handleNavClick('admin-config')}
              >
                <span>📚</span> Subjects & Terms
              </button>
            </div>
          ) : (
            <div>
              <div className="nav-section-title">Student Portal</div>
              <button
                type="button"
                className={`nav-item ${activeView === 'user-portal' ? 'active' : ''}`}
                onClick={() => handleNavClick('user-portal')}
              >
                <span>📜</span> Academic Report Card
              </button>
            </div>
          )}
        </nav>

        {/* Footer User Profile */}
        <div className="sidebar-footer">
          <div className="user-profile-pill">
            <div className="user-avatar">{initial}</div>
            <div className="user-info">
              <div className="user-name">{currentUser?.name || 'Guest User'}</div>
              <div className="user-role">
                {isAdmin ? 'Teacher / Administrator' : 'Student / Parent'}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm action-logout"
            onClick={handleLogout}
            style={{ width: '100%', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
