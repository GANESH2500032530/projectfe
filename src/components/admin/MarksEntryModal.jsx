import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';

export const MarksEntryModal = ({ isOpen, student, onClose }) => {
  const { subjects, terms, saveStudentScores, calculateGradeDetails } = useData();
  const { addToast } = useToast();

  const [selectedTerm, setSelectedTerm] = useState(terms[0] || 'Term 1');
  const [scores, setScores] = useState({});
  const [remarks, setRemarks] = useState('');
  const [presetRemark, setPresetRemark] = useState('');

  const presets = useMemo(() => StorageService.getRemarksPresets(), []);

  // When student or selectedTerm changes, load existing scores
  useEffect(() => {
    if (student) {
      const termScores = (student.scores && student.scores[selectedTerm]) || {};
      const initialScores = {};
      subjects.forEach((sub) => {
        initialScores[sub] = termScores[sub] !== undefined ? termScores[sub] : '';
      });
      setScores(initialScores);
      setRemarks(student.remarks || '');
      setPresetRemark('');
    }
  }, [student, selectedTerm, subjects, isOpen]);

  // Live calculation of totals, percentage, grade, and GPA
  const summary = useMemo(() => {
    let sum = 0;
    let count = 0;

    Object.values(scores).forEach((val) => {
      if (val !== '' && !isNaN(val)) {
        sum += Number(val);
        count++;
      }
    });

    const totalPossible = subjects.length * 100;
    const percentage = count > 0 ? (sum / (count * 100)) * 100 : 0;
    const gradeDetails = calculateGradeDetails(percentage);

    return {
      sum,
      totalPossible,
      percentage,
      grade: gradeDetails.grade,
      gpa: gradeDetails.gpa
    };
  }, [scores, subjects, calculateGradeDetails]);

  if (!isOpen || !student) return null;

  const handleScoreChange = (subject, val) => {
    let numVal = val;
    if (val !== '') {
      numVal = Math.min(100, Math.max(0, Number(val)));
    }
    setScores((prev) => ({
      ...prev,
      [subject]: numVal
    }));
  };

  const handlePresetSelect = (e) => {
    const val = e.target.value;
    setPresetRemark(val);
    if (val) {
      setRemarks(val);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const cleanScores = {};
    Object.entries(scores).forEach(([sub, val]) => {
      if (val !== '' && !isNaN(val)) {
        cleanScores[sub] = Number(val);
      }
    });

    const success = saveStudentScores(student.id, selectedTerm, cleanScores, remarks.trim());
    if (success) {
      addToast(
        `Examination marks for ${student.name} (${selectedTerm}) saved!`,
        'success'
      );
      onClose();
    } else {
      addToast('Failed to save scores. Please try again.', 'danger');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3>Enter Examination Marks</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {student.name} ({student.id}) &bull; {student.grade} ({student.section})
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {/* Term Dropdown */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="marks-term">Select Examination Term</label>
              <select
                id="marks-term"
                className="form-control"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                {terms.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Input Fields */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {subjects.map((sub) => (
                <div key={sub} className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{sub}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Max: 100
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    placeholder="Score 0 - 100"
                    value={scores[sub] ?? ''}
                    onChange={(e) => handleScoreChange(sub, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Real-Time Live Performance Calculation */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-surface-alt)',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginTop: '1.25rem'
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}
                >
                  Total Marks:
                </span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  {summary.sum} / {summary.totalPossible}
                </div>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}
                >
                  Percentage:
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: 'var(--primary)'
                  }}
                >
                  {summary.percentage.toFixed(1)}%
                </div>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}
                >
                  Grade / GPA:
                </span>
                <div>
                  <span className="badge badge-primary">
                    {summary.grade} ({summary.gpa.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>

            {/* Remarks and Preset Templates */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label htmlFor="marks-preset">Quick Remark Presets</label>
              <select
                id="marks-preset"
                className="form-control"
                style={{ marginBottom: '0.5rem' }}
                value={presetRemark}
                onChange={handlePresetSelect}
              >
                <option value="">-- Select Preset Remark Template --</option>
                {presets.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p.slice(0, 55)}...
                  </option>
                ))}
              </select>

              <label htmlFor="marks-remark">Teacher's Customized Remark</label>
              <textarea
                id="marks-remark"
                className="form-control"
                rows="2"
                placeholder="Specific feedback, performance remarks, and suggestions..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Examination Marks
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
