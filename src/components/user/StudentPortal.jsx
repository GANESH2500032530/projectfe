import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StorageService } from '../../services/storage';

export const StudentPortal = () => {
  const { currentUser } = useAuth();
  const { students, subjects, terms, gradingScheme, calculateGradeDetails } = useData();

  // Find linked student
  const student = useMemo(() => {
    if (!currentUser) return null;
    if (currentUser.studentId) {
      return students.find((s) => s.id === currentUser.studentId) || null;
    }
    return (
      students.find(
        (s) => s.email.toLowerCase() === currentUser.email.toLowerCase()
      ) || null
    );
  }, [students, currentUser]);

  const [selectedTerm, setSelectedTerm] = useState(terms[0] || 'Term 1');
  const [targetPercent, setTargetPercent] = useState(90);

  // Overall student calculations across all terms
  const overallStats = useMemo(() => {
    if (!student) return { gpa: '0.00', percent: '0.0%', grade: '-', attRate: 0 };

    let totalScore = 0;
    let totalCount = 0;

    Object.values(student.scores || {}).forEach((termScores) => {
      Object.values(termScores || {}).forEach((score) => {
        totalScore += Number(score) || 0;
        totalCount++;
      });
    });

    const avg = totalCount > 0 ? totalScore / totalCount : 0;
    const gradeInfo = calculateGradeDetails(avg);
    const attRate = student.totalDays
      ? Math.round((student.presentDays / student.totalDays) * 100)
      : 0;

    return {
      avg,
      percent: `${avg.toFixed(1)}%`,
      grade: gradeInfo.grade,
      gpa: gradeInfo.gpa.toFixed(2),
      attRate
    };
  }, [student, calculateGradeDetails]);

  // Term report card data
  const termReport = useMemo(() => {
    if (!student) return null;

    const termScores = (student.scores && student.scores[selectedTerm]) || {};
    let termTotal = 0;
    let count = 0;

    const subjectRows = subjects.map((sub) => {
      const score = termScores[sub];
      const hasScore = score !== undefined && score !== '';
      if (hasScore) {
        termTotal += Number(score);
        count++;
      }
      const gradeInfo = hasScore
        ? calculateGradeDetails(Number(score))
        : { grade: '-', gpa: 0, remark: 'Not Evaluated' };

      return {
        subject: sub,
        hasScore,
        score,
        grade: gradeInfo.grade,
        gpa: gradeInfo.gpa,
        remark: gradeInfo.remark
      };
    });

    const maxTotal = subjects.length * 100;
    const percentage = count > 0 ? (termTotal / (count * 100)) * 100 : 0;
    const finalGrade = calculateGradeDetails(percentage);

    return {
      subjectRows,
      termTotal,
      maxTotal,
      percentage,
      finalGrade
    };
  }, [student, selectedTerm, subjects, calculateGradeDetails]);

  // Term trajectory
  const trajectory = useMemo(() => {
    if (!student) return [];
    return terms.map((term) => {
      const termScoreObj = (student.scores && student.scores[term]) || {};
      const scoreVals = Object.values(termScoreObj)
        .map(Number)
        .filter((n) => !isNaN(n));
      const avg =
        scoreVals.length > 0
          ? Math.round(scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length)
          : 0;
      return { term, avg };
    });
  }, [student, terms]);

  // Class Comparison
  const benchmarkComparison = useMemo(() => {
    if (!student) return [];
    const myScores = (student.scores && student.scores[selectedTerm]) || {};

    return subjects.map((sub) => {
      const myScore = myScores[sub] !== undefined ? Number(myScores[sub]) : 0;
      let sum = 0;
      let count = 0;

      students.forEach((s) => {
        const sc = s.scores && s.scores[selectedTerm] && s.scores[selectedTerm][sub];
        if (sc !== undefined) {
          sum += Number(sc);
          count++;
        }
      });

      const classAvg = count > 0 ? Math.round(sum / count) : 0;
      const diff = myScore - classAvg;

      return {
        subject: sub,
        myScore,
        classAvg,
        diff
      };
    });
  }, [student, selectedTerm, subjects, students]);

  // "What-If" Simulator
  const targetGrade = useMemo(() => {
    return calculateGradeDetails(targetPercent);
  }, [targetPercent, calculateGradeDetails]);

  const gap = useMemo(() => {
    return targetPercent - (overallStats.avg || 0);
  }, [targetPercent, overallStats]);

  const handleExportCSV = () => {
    if (student) {
      StorageService.exportStudentReportCSV(student, subjects, terms, gradingScheme);
    }
  };

  if (!student) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
        <h3>No linked student profile found</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Please contact your school administrator or teacher to associate your account with an active student record.
        </p>
      </div>
    );
  }

  return (
    <div className="student-portal-view">
      {/* Student Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)',
          color: '#ffffff',
          marginBottom: '1.5rem'
        }}
      >
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span
              className="badge"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}
            >
              Student Academic Dashboard
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '1.8rem' }}>{student.name}</h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              {student.id} &bull; Roll #{student.rollNo} &bull; {student.grade} - Section {student.section}
            </p>
          </div>

          <div className="no-print flex gap-2">
            <button
              type="button"
              className="btn btn-outline"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
              onClick={handleExportCSV}
            >
              <span>📥</span> Download CSV Marksheet
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: '#ffffff', color: 'var(--primary)' }}
              onClick={() => window.print()}
            >
              <span>🖨️</span> Print Official Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">🎯</div>
          <div className="stat-details">
            <div className="stat-value">{overallStats.gpa}</div>
            <div className="stat-label">Cumulative GPA</div>
            <div className="stat-delta positive">
              <span>●</span> 4.0 Standard Scale
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">📊</div>
          <div className="stat-details">
            <div className="stat-value">{overallStats.percent}</div>
            <div className="stat-label">Overall Average</div>
            <div className="stat-delta positive">
              <span>▲</span> Across All Terms
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">🏅</div>
          <div className="stat-details">
            <div className="stat-value">{overallStats.grade}</div>
            <div className="stat-label">Academic Letter Grade</div>
            <div className="stat-delta positive">
              <span>★</span> Current Standing
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">📅</div>
          <div className="stat-details">
            <div className="stat-value">{overallStats.attRate}%</div>
            <div className="stat-label">Attendance Compliance</div>
            <div className="stat-delta neutral">
              <span>●</span> Present vs Total
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-2 gap-6 no-print" style={{ marginBottom: '2rem' }}>
        {/* Performance Trajectory */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Academic Trajectory</div>
              <div className="card-subtitle">Term-over-term score progression</div>
            </div>
            <span className="badge badge-success">Term Growth</span>
          </div>
          <div className="chart-container" style={{ minHeight: '190px' }}>
            <div className="bar-chart-visual" style={{ height: '180px' }}>
              {trajectory.map((item) => {
                const heightPercent = Math.max(12, Math.min(100, item.avg));
                return (
                  <div key={item.term} className="bar-col" title={`${item.term}: ${item.avg}%`}>
                    <div className="bar-val">{item.avg}%</div>
                    <div
                      className="bar-fill"
                      style={{
                        height: `${heightPercent}%`,
                        background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                      }}
                    />
                    <div className="bar-label">{item.term}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Attendance Insights */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Attendance Standing</div>
              <div className="card-subtitle">Session attendance breakdown</div>
            </div>
            <span className="badge badge-primary">Attendance Record</span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700 }}>Standing: {overallStats.attRate}%</span>
              {overallStats.attRate >= 85 ? (
                <span className="badge badge-success">Excellent Attendance</span>
              ) : overallStats.attRate >= 75 ? (
                <span className="badge badge-primary">Good Standing</span>
              ) : (
                <span className="badge badge-danger">Low Attendance Warning (&lt; 75%)</span>
              )}
            </div>
            <div className="progress-container" style={{ height: '12px' }}>
              <div
                className={`progress-bar ${overallStats.attRate >= 75 ? 'success' : 'danger'}`}
                style={{ width: `${overallStats.attRate}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3" style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div
              style={{
                background: 'var(--bg-surface-alt)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
                {student.presentDays || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Days Present
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-surface-alt)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--danger)' }}>
                {(student.totalDays || 120) - (student.presentDays || 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Days Absent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Simulator Widget */}
      <div className="card no-print" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <div className="card-title">🎯 "What-If" Target Grade Simulator</div>
            <div className="card-subtitle">
              Set your target percentage to calculate required future scores and GPA target
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Target Goal (%):</label>
            <input
              type="number"
              className="form-control"
              style={{ width: '80px' }}
              min="50"
              max="100"
              value={targetPercent}
              onChange={(e) => setTargetPercent(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="sim-grid">
          <div className="sim-card">
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              TARGET GRADE
            </div>
            <div className="sim-result-value">{targetGrade.grade}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {targetGrade.gpa.toFixed(1)} Target GPA
            </div>
          </div>

          <div className="sim-card">
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              CURRENT AVERAGE
            </div>
            <div className="sim-result-value" style={{ color: 'var(--text-main)' }}>
              {overallStats.percent}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Standpoint</div>
          </div>

          <div className="sim-card">
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              SCORE DELTA NEEDED
            </div>
            <div
              className="sim-result-value"
              style={{ color: gap <= 0 ? 'var(--success)' : 'var(--warning)' }}
            >
              {gap <= 0 ? 'Target Achieved! 🎉' : `+${gap.toFixed(1)}%`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {gap <= 0 ? 'Maintain current pace' : 'Average needed in upcoming term'}
            </div>
          </div>
        </div>
      </div>

      {/* Class Benchmark Comparison Table */}
      <div className="card no-print" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <div className="card-title">📊 Subject Comparison vs Class Average</div>
            <div className="card-subtitle">
              How your scores compare against the entire cohort for {selectedTerm}
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Your Score</th>
                <th>Class Average</th>
                <th>Comparison</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkComparison.map((item) => (
                <tr key={item.subject}>
                  <td>
                    <strong>{item.subject}</strong>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      {item.myScore}%
                    </span>
                  </td>
                  <td>
                    <span>{item.classAvg}%</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        item.diff >= 0 ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {item.diff >= 0
                        ? `+${item.diff}% Above Avg`
                        : `${item.diff}% Below Avg`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Term Report Card */}
      <div className="flex justify-between items-center no-print" style={{ marginBottom: '1rem' }}>
        <h3>Official Academic Progress Report Card</h3>
        <div className="flex items-center gap-2">
          <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Select Term:</label>
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
      </div>

      {termReport && (
        <div className="report-card-container">
          <div className="report-card-header">
            <div className="school-identity">
              <div className="school-logo-emblem">🏫</div>
              <div className="school-info">
                <h2>GREENWOOD ACADEMY</h2>
                <p>Official Academic Performance Progress Report</p>
              </div>
            </div>
            <div
              className="badge badge-primary"
              style={{ fontSize: '0.95rem', padding: '0.6rem 1.25rem' }}
            >
              {selectedTerm.toUpperCase()}
            </div>
          </div>

          <div className="report-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Student Name</span>
              <span className="meta-value">{student.name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Student ID & Roll No</span>
              <span className="meta-value">
                {student.id} &bull; Roll #{student.rollNo}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Class & Section</span>
              <span className="meta-value">
                {student.grade} - Section {student.section}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Parent / Guardian</span>
              <span className="meta-value">{student.parentName || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Attendance Standing</span>
              <span className="meta-value">
                {student.presentDays || 0} / {student.totalDays || 120} Days (
                {overallStats.attRate}%)
              </span>
            </div>
          </div>

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
                {termReport.subjectRows.map((row) => (
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
                          row.hasScore && row.score >= 50
                            ? 'badge-primary'
                            : 'badge-danger'
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

          <div className="report-summary-box">
            <div>
              <div className="summary-stat-val">
                {termReport.termTotal} / {termReport.maxTotal}
              </div>
              <div className="summary-stat-label">Total Marks</div>
            </div>
            <div>
              <div className="summary-stat-val">
                {termReport.percentage.toFixed(1)}%
              </div>
              <div className="summary-stat-label">Term Percentage</div>
            </div>
            <div>
              <div className="summary-stat-val">
                {termReport.finalGrade.grade}
              </div>
              <div className="summary-stat-label">Letter Grade</div>
            </div>
            <div>
              <div className="summary-stat-val">
                {termReport.finalGrade.gpa.toFixed(2)}
              </div>
              <div className="summary-stat-label">Term GPA</div>
            </div>
            <div>
              <div
                className="summary-stat-val"
                style={{
                  color:
                    termReport.percentage >= 40
                      ? 'var(--success)'
                      : 'var(--danger)'
                }}
              >
                {termReport.percentage >= 40 ? 'PASSED' : 'NEEDS ATTENTION'}
              </div>
              <div className="summary-stat-label">Status</div>
            </div>
          </div>

          <div className="report-remarks-box">
            <div className="remarks-title">
              Teacher's Remarks & Performance Notes:
            </div>
            <div className="remarks-text">
              "{student.remarks || 'Commendable effort and dedication towards coursework.'}"
            </div>
          </div>

          <div className="report-signatures">
            <div className="sig-line">Class Teacher Signature</div>
            <div className="sig-line">Head of Department</div>
            <div className="sig-line">Principal Signature</div>
          </div>
        </div>
      )}
    </div>
  );
};
