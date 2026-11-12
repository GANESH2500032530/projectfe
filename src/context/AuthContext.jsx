import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => StorageService.getCurrentUser());

  useEffect(() => {
    StorageService.init();
  }, []);

  const login = useCallback((email, password) => {
    const users = StorageService.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!foundUser) {
      return { success: false, message: 'Invalid email address or password.' };
    }

    // If user is a student, link studentId if missing
    if (foundUser.role === 'user' && !foundUser.studentId) {
      const student = StorageService.getStudentByEmail(foundUser.email);
      if (student) {
        foundUser.studentId = student.id;
      }
    }

    StorageService.setCurrentUser(foundUser);
    setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  }, []);

  const signup = useCallback((userData) => {
    const users = StorageService.getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: 'USR' + Date.now().toString().slice(-6),
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: userData.role || 'user'
    };

    if (newUser.role === 'user') {
      let student = StorageService.getStudentByEmail(cleanEmail);
      if (!student) {
        const students = StorageService.getStudents();
        student = {
          id: 'STU' + Date.now().toString().slice(-4),
          name: newUser.name,
          email: cleanEmail,
          grade: userData.grade || 'Grade 10',
          section: userData.section || 'A',
          rollNo: userData.rollNo || (students.length + 101).toString(),
          parentName: userData.parentName || 'Parent / Guardian',
          contact: userData.contact || '+1 555-0000',
          totalDays: 120,
          presentDays: 110,
          remarks: 'Newly enrolled student.',
          scores: {
            'Term 1': {
              'Mathematics': 85,
              'Science': 88,
              'English Literature': 82,
              'Social Studies': 80,
              'Computer Science': 90
            }
          }
        };
        StorageService.addStudent(student);
      }
      newUser.studentId = student.id;
    }

    users.push(newUser);
    StorageService.saveUsers(users);
    StorageService.setCurrentUser(newUser);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        isUser: currentUser?.role === 'user'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
