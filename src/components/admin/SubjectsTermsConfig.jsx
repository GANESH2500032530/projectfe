import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const SubjectsTermsConfig = () => {
  const { subjects, terms, addSubject, deleteSubject, addTerm, deleteTerm } = useData();
  const { addToast } = useToast();

  const [newSubject, setNewSubject] = useState('');
  const [newTerm, setNewTerm] = useState('');

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    if (addSubject(newSubject.trim())) {
      addToast(`Subject "${newSubject.trim()}" added.`, 'success');
      setNewSubject('');
    } else {
      addToast('Subject already exists or is invalid.', 'warning');
    }
  };

  const handleDeleteSubject = (sub) => {
    if (window.confirm(`Remove subject "${sub}"? Existing historical marks will be preserved.`)) {
      deleteSubject(sub);
      addToast(`Subject "${sub}" removed.`, 'info');
    }
  };

  const handleAddTerm = (e) => {
    e.preventDefault();
    if (!newTerm.trim()) return;

    if (addTerm(newTerm.trim())) {
      addToast(`Examination term "${newTerm.trim()}" added.`, 'success');
      setNewTerm('');
    } else {
      addToast('Term already exists or is invalid.', 'warning');
    }
  };

  const handleDeleteTerm = (term) => {
    if (window.confirm(`Remove examination term "${term}"?`)) {
      deleteTerm(term);
      addToast(`Term "${term}" removed.`, 'info');
    }
  };

  return (
    <div className="subjects-terms-view">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Curriculum Subjects & Examination Terms Configuration</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Configure active institutional subjects, curriculum courses, and semester exam terms
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Subjects Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Curriculum Subjects</div>
              <div className="card-subtitle">Active subjects taught in current session</div>
            </div>
          </div>

          <form onSubmit={handleAddSubject} className="flex gap-2" style={{ marginBottom: '1.25rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Physics, Chemistry, History..."
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </form>

          <div>
            {subjects.map((sub) => (
              <div
                key={sub}
                className="flex justify-between items-center"
                style={{
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.5rem'
                }}
              >
                <span style={{ fontWeight: 600 }}>{sub}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  style={{ padding: '0.2rem 0.5rem' }}
                  onClick={() => handleDeleteSubject(sub)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Terms Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Examination Terms</div>
              <div className="card-subtitle">Active evaluation sessions & semesters</div>
            </div>
          </div>

          <form onSubmit={handleAddTerm} className="flex gap-2" style={{ marginBottom: '1.25rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Quarter 1, Midterm Exam..."
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </form>

          <div>
            {terms.map((term) => (
              <div
                key={term}
                className="flex justify-between items-center"
                style={{
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.5rem'
                }}
              >
                <span style={{ fontWeight: 600 }}>{term}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  style={{ padding: '0.2rem 0.5rem' }}
                  onClick={() => handleDeleteTerm(term)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
