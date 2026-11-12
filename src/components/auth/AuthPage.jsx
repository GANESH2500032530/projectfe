import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthPage = () => {
  const { login, signup } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('user');
  const [signupGrade, setSignupGrade] = useState('Grade 10');
  const [signupSection, setSignupSection] = useState('A');
  const [signupParent, setSignupParent] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }

    const result = login(loginEmail, loginPassword);
    if (result.success) {
      addToast(`Welcome back, ${result.user.name}!`, 'success');
    } else {
      addToast(result.message || 'Login failed. Please check credentials.', 'danger');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      addToast('Please fill in all required fields.', 'warning');
      return;
    }

    const result = signup({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
      grade: signupGrade,
      section: signupSection,
      parentName: signupParent
    });

    if (result.success) {
      addToast(`Account created successfully! Welcome, ${result.user.name}.`, 'success');
    } else {
      addToast(result.message || 'Registration failed.', 'danger');
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setLoginEmail('admin@school.edu');
      setLoginPassword('admin');
      setActiveTab('login');
      addToast('Filled Admin demo credentials.', 'info');
    } else {
      setLoginEmail('student@school.edu');
      setLoginPassword('student');
      setActiveTab('login');
      addToast('Filled Student demo credentials.', 'info');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h2>Student Report System</h2>
          <p>Institutional Academic Performance & Analytics Portal</p>
        </div>

        {/* Tab Controls */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                className="form-control"
                placeholder="name@school.edu"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                className="form-control"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            >
              Sign In to Dashboard
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label htmlFor="signup-name">Full Name *</label>
              <input
                type="text"
                id="signup-name"
                className="form-control"
                placeholder="e.g. Jordan Smith"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address *</label>
              <input
                type="email"
                id="signup-email"
                className="form-control"
                placeholder="name@school.edu"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password *</label>
              <input
                type="password"
                id="signup-password"
                className="form-control"
                placeholder="Create a strong password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-role">Select Role / Module *</label>
              <select
                id="signup-role"
                className="form-control"
                value={signupRole}
                onChange={(e) => setSignupRole(e.target.value)}
                required
              >
                <option value="user">Student / Parent (User Module)</option>
                <option value="admin">Teacher / School Admin (Admin Module)</option>
              </select>
            </div>

            {/* Additional fields for Student Role */}
            {signupRole === 'user' && (
              <div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="form-group">
                    <label htmlFor="signup-grade">Grade / Class</label>
                    <select
                      id="signup-grade"
                      className="form-control"
                      value={signupGrade}
                      onChange={(e) => setSignupGrade(e.target.value)}
                    >
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-section">Section</label>
                    <select
                      id="signup-section"
                      className="form-control"
                      value={signupSection}
                      onChange={(e) => setSignupSection(e.target.value)}
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-parent">Parent / Guardian Name</label>
                  <input
                    type="text"
                    id="signup-parent"
                    className="form-control"
                    placeholder="e.g. Martha Smith"
                    value={signupParent}
                    onChange={(e) => setSignupParent(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            >
              Register Account
            </button>
          </form>
        )}

        {/* Instant One-Click Demo Credentials */}
        <div className="demo-credentials">
          <h5>⚡ One-Click Instant Demo Credentials</h5>
          <div className="demo-badge-row">
            <button
              type="button"
              className="demo-badge-btn"
              onClick={() => fillDemo('admin')}
            >
              <span>🛡️ Admin (admin@school.edu)</span>
            </button>
            <button
              type="button"
              className="demo-badge-btn"
              onClick={() => fillDemo('user')}
            >
              <span>👤 Student (student@school.edu)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
