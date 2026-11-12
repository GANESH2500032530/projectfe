import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';

export const ReportCardPreview = ({ initialStudentId, onBack }) => {
  const { students, subjects, terms, calculateGradeDetails } = useData();

  const [selectedStudentId, setSelectedStudentId] = useState(
    initialStudentId || (students[0]?.id ?? '')
  );
  const [selectedTerm, setSelectedTerm] = useState(terms[0] || 'Term 1');

  useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
    }
  }, [initialStudentId]);

  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0] || null;
  }, [students, selectedStudentId]);

  const reportData = useMemo(() => {
    if (!currentStudent) return null;

    const termScores = (currentStudent.scores && currentStudent.scores[selectedTerm]) || {};
    let totalMarks = 0;
    let maxMarksTotal = subjects.length * 100;
    let scoredCount = 0;

    const subjectRows = subjects.map((sub) => {
      const score = termScores[sub];
      const hasScore = score !== undefined && score !== '';
      if (hasScore) {
        totalMarks += Number(score);
        scoredCount++;
      }
      const gradeInfo = hasScore
        ? calculateGradeDetails(Number(score))
        : { grade: '-', gpa: 0, remark: 'Not evaluated' };

      return {
        subject: sub,
        hasScore,
        score,
        grade: gradeInfo.grade,
        gpa: gradeInfo.gpa,
        remark: gradeInfo.remark
      };
    });

    const percentage = scoredCount > 0 ? (totalMarks / (scoredCount * 100)) * 100 : 0;
    const finalGrade = calculateGradeDetails(percentage);
    const attendanceRate = currentStudent.totalDays
      ? ((currentStudent.presentDays / currentStudent.totalDays) * 100).toFixed(1)
      : '0';

    return {
      subjectRows,
      totalMarks,
      maxMarksTotal,
      percentage,
      finalGrade,
      attendanceRate
    };
  }, [currentStudent, selectedTerm, subjects, calculateGradeDetails]);

  if (!currentStudent || !reportData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>No student selected</h3>
        <button type="button" className="btn btn-primary" onClick={onBack} style={{ marginTop: '1rem' }}>
          ← Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="report-card-preview-view">
      {/* Action Bar (Hidden on print) */}
      <div
        className="flex justify-between items-center no-print"
        style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={onBack}>
            ← Back to Students
          </button>
          <h3>Official Student Report Card</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Student:</label>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Term:</label>
            <select
              className="form-control"
              style={{ width: 'auto' }}
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

          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <span>🖨️</span> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Official Printable Report Card Component */}
      <div className="report-card-container">
        {/* Header */}
        <div className="report-card-header">
          <div className="school-identity">
            <div className="school-logo-emblem">🏫</div>
            <div className="school-info">
              <h2>GREENWOOD ACADEMY</h2>
              <p>Official Academic Performance Report | Academic Year 2025-2026</p>
            </div>
          </div>
          <div
            className="badge badge-primary"
            style={{ fontSize: '0.95rem', padding: '0.6rem 1.25rem' }}
          >
            {selectedTerm.toUpperCase()}
          </div>
        </div>

        {/* Metadata */}
        <div className="report-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Student Name</span>
            <span className="meta-value">{currentStudent.name}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Student ID / Roll No</span>
            <span className="meta-value">
              {currentStudent.id} / Roll #{currentStudent.rollNo}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Class & Section</span>
            <span className="meta-value">
              {currentStudent.grade} - Section {currentStudent.section}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Parent / Guardian</span>
            <span className="meta-value">{currentStudent.parentName || 'N/A'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Attendance Record</span>
            <span className="meta-value">
              {currentStudent.presentDays || 0} / {currentStudent.totalDays || 120} Days (
              {reportData.attendanceRate}%)
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Max Marks</th>
                <th>Marks Obtained</th>
                <th>Grade</th>
                <th>GPA</th>
                <th>Performance Remark</th>
              </tr>
            </thead>
            <tbody>
              {reportData.subjectRows.map((row) => (
                <tr key={row.subject}>
                  <td>
                    <strong>{row.subject}</strong>
                  </td>
                  <td>100</td>
                  <td>
                    {row.hasScore ? (
                      <strong>{row.score}</strong>
                    ) : (
                      <span style={{ color: 'var(--text-light)' }}>-</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        row.hasScore && row.score >= 50 ? 'badge-primary' : 'badge-danger'
                      }`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td>{row.hasScore ? row.gpa.toFixed(1) : '-'}</td>
                  <td>{row.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Box */}
        <div className="report-summary-box">
          <div>
            <div className="summary-stat-val">
              {reportData.totalMarks} / {reportData.maxMarksTotal}
            </div>
            <div className="summary-stat-label">Total Score</div>
          </div>
          <div>
            <div className="summary-stat-val">{reportData.percentage.toFixed(1)}%</div>
            <div className="summary-stat-label">Overall Percentage</div>
          </div>
          <div>
            <div className="summary-stat-val">{reportData.finalGrade.grade}</div>
            <div className="summary-stat-label">Final Letter Grade</div>
          </div>
          <div>
            <div className="summary-stat-val">{reportData.finalGrade.gpa.toFixed(2)}</div>
            <div className="summary-stat-label">Cumulative GPA</div>
          </div>
          <div>
            <div
              className="summary-stat-val"
              style={{
                color: reportData.percentage >= 40 ? 'var(--success)' : 'var(--danger)'
              }}
            >
              {reportData.percentage >= 40 ? 'PASSED' : 'NEEDS REPEAT'}
            </div>
            <div className="summary-stat-label">Result Status</div>
          </div>
        </div>

        {/* Remarks Box */}
        <div className="report-remarks-box">
          <div className="remarks-title">Teacher's Remarks & Feedback:</div>
          <div className="remarks-text">
            "{currentStudent.remarks || 'Diligent student with consistent engagement in class.'}"
          </div>
        </div>

        {/* Signatures */}
        <div className="report-signatures">
          <div className="sig-line">Class Teacher Signature</div>
          <div className="sig-line">Head of Department</div>
          <div className="sig-line">Principal / Dean</div>
        </div>
      </div>
    </div>
  );
};
