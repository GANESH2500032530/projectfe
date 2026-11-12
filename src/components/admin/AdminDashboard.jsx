import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { StorageService } from '../../services/storage';

export const AdminDashboard = ({ onOpenAddStudent, onNavigateToStudents }) => {
  const { students, subjects, gradingScheme, calculateGradeDetails } = useData();

  // Compute Analytics
  const analytics = useMemo(() => {
    let totalScoreSum = 0;
    let totalSubjectEntries = 0;
    let totalPresent = 0;
    let totalPossibleDays = 0;

    const subjectData = {};
    subjects.forEach((sub) => {
      subjectData[sub] = { sum: 0, count: 0 };
    });

    const gradeDistribution = {
      'A+/A': 0,
      'B+/B': 0,
      'C': 0,
      'D/F': 0
    };

    const studentRankList = students.map((s) => {
      totalPresent += s.presentDays || 0;
      totalPossibleDays += s.totalDays || 120;

      let studentSum = 0;
      let studentSubjectCount = 0;

      Object.values(s.scores || {}).forEach((termScores) => {
        Object.entries(termScores || {}).forEach(([sub, score]) => {
          const numScore = Number(score) || 0;
          totalScoreSum += numScore;
          totalSubjectEntries++;
          studentSum += numScore;
          studentSubjectCount++;

          if (subjectData[sub]) {
            subjectData[sub].sum += numScore;
            subjectData[sub].count++;
          }
        });
      });

      const avg = studentSubjectCount > 0 ? studentSum / studentSubjectCount : 0;
      const gradeInfo = calculateGradeDetails(avg);

      if (avg >= 80) gradeDistribution['A+/A']++;
      else if (avg >= 60) gradeDistribution['B+/B']++;
      else if (avg >= 50) gradeDistribution['C']++;
      else gradeDistribution['D/F']++;

      return {
        ...s,
        average: avg,
        grade: gradeInfo.grade,
        gpa: gradeInfo.gpa
      };
    });

    studentRankList.sort((a, b) => b.average - a.average);

    const classAverage =
      totalSubjectEntries > 0 ? (totalScoreSum / totalSubjectEntries).toFixed(1) : '0';

    const overallAttendance =
      totalPossibleDays > 0 ? ((totalPresent / totalPossibleDays) * 100).toFixed(1) : '0';

    let topSubject = 'N/A';
    let highestSubjectAvg = -1;

    Object.entries(subjectData).forEach(([sub, data]) => {
      if (data.count > 0) {
        const avg = data.sum / data.count;
        if (avg > highestSubjectAvg) {
          highestSubjectAvg = avg;
          topSubject = sub;
        }
      }
    });

    return {
      classAverage,
      overallAttendance,
      topSubject,
      subjectData,
      gradeDistribution,
      topPerformers: studentRankList.slice(0, 5)
    };
  }, [students, subjects, calculateGradeDetails]);

  const handleExportCSV = () => {
    StorageService.exportMasterCSV(students, gradingScheme);
  };

  const distColors = {
    'A+/A': '#10b981',
    'B+/B': '#4f46e5',
    'C': '#f59e0b',
    'D/F': '#ef4444'
  };

  return (
    <div className="admin-dashboard-view">
      {/* Title & Actions Bar */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h3>Institutional Performance Dashboard</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Key performance indicators, subject analytics, and academic health metrics
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-outline" onClick={handleExportCSV}>
            <span>📥</span> Export Master CSV
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenAddStudent}>
            <span>➕</span> Add New Student
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">👥</div>
          <div className="stat-details">
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Enrolled Students</div>
            <div className="stat-delta positive">
              <span>●</span> Active Cohort
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">📈</div>
          <div className="stat-details">
            <div className="stat-value">{analytics.classAverage}%</div>
            <div className="stat-label">Overall Class Average</div>
            <div className="stat-delta positive">
              <span>▲</span> Cohort Performance
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">📅</div>
          <div className="stat-details">
            <div className="stat-value">{analytics.overallAttendance}%</div>
            <div className="stat-label">Average Attendance Rate</div>
            <div className="stat-delta neutral">
              <span>●</span> High Compliance
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">🏆</div>
          <div className="stat-details">
            <div className="stat-value" style={{ fontSize: '1.3rem' }}>
              {analytics.topSubject}
            </div>
            <div className="stat-label">Top Performing Subject</div>
            <div className="stat-delta positive">
              <span>★</span> Highest Mastery
            </div>
          </div>
        </div>
      </div>

      {/* Performance Visual Charts Grid */}
      <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
        {/* Subject Comparison Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Subject Performance Comparison</div>
              <div className="card-subtitle">Average percentage score across all students</div>
            </div>
            <span className="badge badge-primary">Class Average</span>
          </div>
          <div className="chart-container">
            <div className="bar-chart-visual">
              {Object.entries(analytics.subjectData).map(([sub, data]) => {
                const avg = data.count > 0 ? Math.round(data.sum / data.count) : 0;
                const heightPercent = Math.max(12, Math.min(100, avg));
                return (
                  <div key={sub} className="bar-col" title={`${sub}: ${avg}%`}>
                    <div className="bar-val">{avg}%</div>
                    <div className="bar-fill" style={{ height: `${heightPercent}%` }} />
                    <div className="bar-label">{sub.split(' ')[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Grade Distribution Overview</div>
              <div className="card-subtitle">Student distribution across letter grade bands</div>
            </div>
            <span className="badge badge-purple">Cohort Breakdown</span>
          </div>
          <div className="grid grid-cols-2 gap-3" style={{ marginTop: '1rem' }}>
            {Object.entries(analytics.gradeDistribution).map(([band, count]) => {
              const total = students.length;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div
                  key={band}
                  style={{
                    background: 'var(--bg-surface-alt)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${distColors[band]}`
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {band} BANDS
                  </div>
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      marginTop: '2px'
                    }}
                  >
                    {count} Students ({percent}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Honor Roll: Top Performers Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Top Academic Performers (Honor Roll)</div>
            <div className="card-subtitle">
              Highest cumulative averages for the current academic session
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={onNavigateToStudents}
          >
            Open Full Directory
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student Name & ID</th>
                <th>Class / Section</th>
                <th>Average Score</th>
                <th>Grade & GPA</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topPerformers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No student records available.
                  </td>
                </tr>
              ) : (
                analytics.topPerformers.map((s, idx) => (
                  <tr key={s.id}>
                    <td>
                      <strong>#{idx + 1}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {s.id} | Roll: {s.rollNo}
                      </div>
                    </td>
                    <td>
                      {s.grade} - {s.section}
                    </td>
                    <td>
                      <span className="badge badge-primary">{s.average.toFixed(1)}%</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          s.average >= 80
                            ? 'badge-success'
                            : s.average >= 60
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {s.grade} ({s.gpa.toFixed(1)})
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
