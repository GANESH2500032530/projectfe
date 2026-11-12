import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const GradingSchemeManager = () => {
  const { gradingScheme, saveCustomGradingScheme, resetGradingSchemeToDefault } = useData();
  const { addToast } = useToast();

  const [scheme, setScheme] = useState([]);

  useEffect(() => {
    setScheme(JSON.parse(JSON.stringify(gradingScheme)));
  }, [gradingScheme]);

  const handleChange = (index, field, value) => {
    const updated = [...scheme];
    updated[index] = {
      ...updated[index],
      [field]: field === 'min' || field === 'max' || field === 'gpa' ? Number(value) : value
    };
    setScheme(updated);
  };

  const handleSave = () => {
    saveCustomGradingScheme(scheme);
    addToast('Custom grading scheme updated successfully!', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset grading scheme back to standard default scale?')) {
      resetGradingSchemeToDefault();
      addToast('Grading scheme reset to default standard scale.', 'info');
    }
  };

  return (
    <div className="grading-scheme-view">
      {/* Title & Actions */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h3>Grading System Customization</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Define custom letter grade boundaries, GPA scale weights (4.0 scale), and performance remarks
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset to Default
          </button>
          <button type="button" className="btn btn-success" onClick={handleSave}>
            💾 Save Grading Scheme
          </button>
        </div>
      </div>

      {/* Grading Scheme Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Grade Symbol</th>
                <th>Percentage Range (Min % to Max %)</th>
                <th>GPA Weight (4.0 Scale)</th>
                <th>Official Performance Remark</th>
              </tr>
            </thead>
            <tbody>
              {scheme.map((rule, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        style={{ maxWidth: '80px', fontWeight: 700 }}
                        value={rule.grade}
                        onChange={(e) => handleChange(idx, 'grade', e.target.value)}
                      />
                    </strong>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '75px' }}
                        min="0"
                        max="100"
                        value={rule.min}
                        onChange={(e) => handleChange(idx, 'min', e.target.value)}
                      />
                      <span>% to</span>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '75px' }}
                        min="0"
                        max="100"
                        value={rule.max}
                        onChange={(e) => handleChange(idx, 'max', e.target.value)}
                      />
                      <span>%</span>
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control form-control-sm"
                      style={{ width: '80px' }}
                      min="0"
                      max="4.0"
                      value={rule.gpa}
                      onChange={(e) => handleChange(idx, 'gpa', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={rule.remark}
                      onChange={(e) => handleChange(idx, 'remark', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
