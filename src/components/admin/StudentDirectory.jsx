import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';

export const StudentDirectory = ({
  onOpenAddStudent,
  onEditStudent,
  onOpenMarks,
  onPreviewReport
}) => {
  const { students, gradingScheme, deleteStudent } = useData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('roll');

  const processedStudents = useMemo(() => {
    let list = students.map((s) => {
      let sum = 0;
      let count = 0;
      Object.values(s.scores || {}).forEach((termScores) => {
        Object.values(termScores || {}).forEach((score) => {
          sum += Number(score) || 0;
          count++;
        });
      });
      const avg = count > 0 ? sum / count : 0;
      const attRate = s.totalDays ? Math.round((s.presentDays / s.totalDays) * 100) : 0;
      return {
        ...s,
        calculatedAvg: avg,
        attRate
      };
    });

    // Filter Grade
    if (filterGrade !== 'ALL') {
      list = list.filter((s) => s.grade === filterGrade);
    }

    // Filter Status
    if (filterStatus === 'DISTINCTION') {
      list = list.filter((s) => s.calculatedAvg >= 80);
    } else if (filterStatus === 'PASS') {
      list = list.filter((s) => s.calculatedAvg >= 50 && s.calculatedAvg < 80);
    } else if (filterStatus === 'AT_RISK') {
      list = list.filter((s) => s.calculatedAvg < 50 || s.attRate < 75);
    }

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'avg_desc') {
      list.sort((a, b) => b.calculatedAvg - a.calculatedAvg);
    } else if (sortBy === 'att_asc') {
      list.sort((a, b) => a.attRate - b.attRate);
    } else {
      list.sort((a, b) => Number(a.rollNo) - Number(b.rollNo));
    }

    return list;
  }, [students, searchTerm, filterGrade, filterStatus, sortBy]);

  const handleDelete = (student) => {
    if (
      window.confirm(
        `Are you sure you want to delete student "${student.name}" (${student.id})?`
      )
    ) {
      deleteStudent(student.id);
      addToast(`Student "${student.name}" has been deleted.`, 'info');
    }
  };

  const handleExportCSV = () => {
    StorageService.exportMasterCSV(students, gradingScheme);
    addToast('Exported Master Student CSV.', 'success');
  };

  return (
    <div className="student-directory-view">
      {/* Title & Actions */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h3>Student Directory & Grade Management</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Search, filter, record examination scores, and manage student profiles
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-outline" onClick={handleExportCSV}>
            <span>📥</span> Export CSV
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenAddStudent}>
            <span>➕</span> Add New Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, roll number, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Class:
          </label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="ALL">All Classes</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Standing:
          </label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Standings</option>
            <option value="DISTINCTION">Distinction (≥ 80%)</option>
            <option value="PASS">Pass (50% - 79%)</option>
            <option value="AT_RISK">At-Risk (&lt; 50% or Low Att)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Sort:
          </label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="roll">Roll Number</option>
            <option value="name">Name (A-Z)</option>
            <option value="avg_desc">Highest Average %</option>
            <option value="att_asc">Lowest Attendance</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Details</th>
                <th>Class</th>
                <th>Roll No</th>
                <th>Attendance</th>
                <th>Overall %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center',
                      padding: '2.5rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                processedStudents.map((s) => {
                  const avgText =
                    s.calculatedAvg > 0 ? `${s.calculatedAvg.toFixed(1)}%` : 'No Marks';

                  return (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.id}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {s.email}
                        </div>
                      </td>
                      <td>
                        {s.grade} ({s.section})
                      </td>
                      <td>{s.rollNo}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{s.attRate}%</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {s.presentDays || 0}/{s.totalDays || 120} Days
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            s.calculatedAvg >= 80
                              ? 'badge-success'
                              : s.calculatedAvg >= 50
                              ? 'badge-primary'
                              : 'badge-danger'
                          }`}
                        >
                          {avgText}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => onOpenMarks(s)}
                            title="Enter or Edit Marks"
                          >
                            📝 Marks
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => onEditStudent(s)}
                            title="Edit Student Profile"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => onPreviewReport(s)}
                            title="View Official Report Card"
                          >
                            📄
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(s)}
                            title="Delete Student"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
