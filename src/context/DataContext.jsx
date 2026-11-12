import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService, DEFAULT_GRADING_SCHEME } from '../services/storage';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState(() => StorageService.getStudents());
  const [subjects, setSubjects] = useState(() => StorageService.getSubjects());
  const [terms, setTerms] = useState(() => StorageService.getTerms());
  const [gradingScheme, setGradingScheme] = useState(() => StorageService.getGradingScheme());
  const [theme, setThemeState] = useState(() => StorageService.getTheme());

  useEffect(() => {
    StorageService.init();
    StorageService.setTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      StorageService.setTheme(next);
      return next;
    });
  }, []);

  const refreshData = useCallback(() => {
    setStudents(StorageService.getStudents());
    setSubjects(StorageService.getSubjects());
    setTerms(StorageService.getTerms());
    setGradingScheme(StorageService.getGradingScheme());
  }, []);

  const addStudent = useCallback((studentData) => {
    const newStudent = {
      ...studentData,
      id: studentData.id || 'STU' + Date.now().toString().slice(-4),
      scores: studentData.scores || {}
    };
    StorageService.addStudent(newStudent);
    setStudents(StorageService.getStudents());
    return newStudent;
  }, []);

  const updateStudent = useCallback((id, updatedData) => {
    const updated = StorageService.updateStudent(id, updatedData);
    setStudents(StorageService.getStudents());
    return updated;
  }, []);

  const deleteStudent = useCallback((id) => {
    StorageService.deleteStudent(id);
    setStudents(StorageService.getStudents());
  }, []);

  const saveStudentScores = useCallback((studentId, term, scores, remarks) => {
    const currentStudents = StorageService.getStudents();
    const student = currentStudents.find((s) => s.id === studentId);
    if (!student) return false;

    const studentScores = { ...(student.scores || {}) };
    studentScores[term] = scores;

    StorageService.updateStudent(studentId, {
      scores: studentScores,
      remarks: remarks !== undefined ? remarks : student.remarks
    });

    setStudents(StorageService.getStudents());
    return true;
  }, []);

  const saveCustomGradingScheme = useCallback((scheme) => {
    StorageService.saveGradingScheme(scheme);
    setGradingScheme(scheme);
  }, []);

  const resetGradingSchemeToDefault = useCallback(() => {
    StorageService.saveGradingScheme(DEFAULT_GRADING_SCHEME);
    setGradingScheme(DEFAULT_GRADING_SCHEME);
  }, []);

  const addSubject = useCallback((name) => {
    const success = StorageService.addSubject(name);
    if (success) {
      setSubjects(StorageService.getSubjects());
    }
    return success;
  }, []);

  const deleteSubject = useCallback((name) => {
    StorageService.deleteSubject(name);
    setSubjects(StorageService.getSubjects());
  }, []);

  const addTerm = useCallback((name) => {
    const success = StorageService.addTerm(name);
    if (success) {
      setTerms(StorageService.getTerms());
    }
    return success;
  }, []);

  const deleteTerm = useCallback((name) => {
    StorageService.deleteTerm(name);
    setTerms(StorageService.getTerms());
  }, []);

  const calculateGradeDetails = useCallback(
    (percentage) => {
      return StorageService.calculateGradeDetails(percentage, gradingScheme);
    },
    [gradingScheme]
  );

  return (
    <DataContext.Provider
      value={{
        students,
        subjects,
        terms,
        gradingScheme,
        theme,
        toggleTheme,
        refreshData,
        addStudent,
        updateStudent,
        deleteStudent,
        saveStudentScores,
        saveCustomGradingScheme,
        resetGradingSchemeToDefault,
        addSubject,
        deleteSubject,
        addTerm,
        deleteTerm,
        calculateGradeDetails
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
