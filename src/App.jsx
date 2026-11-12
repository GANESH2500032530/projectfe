import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastContainer } from './components/common/Toast';
import { AuthPage } from './components/auth/AuthPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentDirectory } from './components/admin/StudentDirectory';
import { AddEditStudentModal } from './components/admin/AddEditStudentModal';
import { MarksEntryModal } from './components/admin/MarksEntryModal';
import { GradingSchemeManager } from './components/admin/GradingSchemeManager';
import { SubjectsTermsConfig } from './components/admin/SubjectsTermsConfig';
import { ReportCardPreview } from './components/admin/ReportCardPreview';
import { StudentPortal } from './components/user/StudentPortal';
import './styles/index.css';

const MainAppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Active navigation view
  const [activeView, setActiveView] = useState('admin-dashboard');

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [marksStudent, setMarksStudent] = useState(null);

  const [previewStudentId, setPreviewStudentId] = useState('');

  // Synchronize initial view based on role
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('user-portal');
      }
    }
  }, [isAuthenticated, isAdmin]);

  // If not signed in, show Auth Page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Handlers for Admin actions
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsAddEditModalOpen(true);
  };

  const handleOpenMarks = (student) => {
    setMarksStudent(student);
    setIsMarksModalOpen(true);
  };

  const handlePreviewReport = (student) => {
    setPreviewStudentId(student.id);
    setActiveView('admin-report');
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)} />

        <main className="content-area">
          {/* Admin Views */}
          {isAdmin && (
            <>
              {activeView === 'admin-dashboard' && (
                <AdminDashboard
                  onOpenAddStudent={handleOpenAddStudent}
                  onNavigateToStudents={() => setActiveView('admin-students')}
                />
              )}

              {activeView === 'admin-students' && (
                <StudentDirectory
                  onOpenAddStudent={handleOpenAddStudent}
                  onEditStudent={handleEditStudent}
                  onOpenMarks={handleOpenMarks}
                  onPreviewReport={handlePreviewReport}
                />
              )}

              {activeView === 'admin-grading' && <GradingSchemeManager />}

              {activeView === 'admin-config' && <SubjectsTermsConfig />}

              {activeView === 'admin-report' && (
                <ReportCardPreview
                  initialStudentId={previewStudentId}
                  onBack={() => setActiveView('admin-students')}
                />
              )}
            </>
          )}

          {/* User / Student Portal */}
          {!isAdmin && <StudentPortal />}
        </main>
      </div>

      {/* Global Modals */}
      <AddEditStudentModal
        isOpen={isAddEditModalOpen}
        student={editingStudent}
        onClose={() => setIsAddEditModalOpen(false)}
      />

      <MarksEntryModal
        isOpen={isMarksModalOpen}
        student={marksStudent}
        onClose={() => setIsMarksModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <MainAppContent />
          <ToastContainer />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
