import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const AddEditStudentModal = ({ isOpen, student, onClose }) => {
  const { addStudent, updateStudent } = useData();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('Grade 10');
  const [section, setSection] = useState('A');
  const [rollNo, setRollNo] = useState('');
  const [parentName, setParentName] = useState('');
  const [contact, setContact] = useState('');
  const [totalDays, setTotalDays] = useState(120);
  const [presentDays, setPresentDays] = useState(110);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setEmail(student.email || '');
      setGrade(student.grade || 'Grade 10');
      setSection(student.section || 'A');
      setRollNo(student.rollNo || '');
      setParentName(student.parentName || '');
      setContact(student.contact || '');
      setTotalDays(student.totalDays || 120);
      setPresentDays(student.presentDays || 110);
      setRemarks(student.remarks || '');
    } else {
      setName('');
      setEmail('');
      setGrade('Grade 10');
      setSection('A');
      setRollNo('');
      setParentName('');
      setContact('');
      setTotalDays(120);
      setPresentDays(110);
      setRemarks('');
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !rollNo.trim()) {
      addToast('Please complete all required fields (*)', 'warning');
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      grade,
      section,
      rollNo: rollNo.trim(),
      parentName: parentName.trim(),
      contact: contact.trim(),
      totalDays: Number(totalDays) || 120,
      presentDays: Number(presentDays) || 0,
      remarks: remarks.trim()
    };

    if (student?.id) {
      updateStudent(student.id, payload);
      addToast(`Student "${name}" details updated successfully!`, 'success');
    } else {
      addStudent(payload);
      addToast(`New student "${name}" added successfully!`, 'success');
    }

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{student ? 'Edit Student Details' : 'Add New Student'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label htmlFor="stu-name">Full Student Name *</label>
                <input
                  type="text"
                  id="stu-name"
                  className="form-control"
                  placeholder="e.g. Jordan Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stu-email">Student Email Address *</label>
                <input
                  type="email"
                  id="stu-email"
                  className="form-control"
                  placeholder="student@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="form-group">
                <label htmlFor="stu-grade">Grade / Class</label>
                <select
                  id="stu-grade"
                  className="form-control"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stu-section">Section</label>
                <select
                  id="stu-section"
                  className="form-control"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stu-roll">Roll Number *</label>
                <input
                  type="text"
                  id="stu-roll"
                  className="form-control"
                  placeholder="105"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label htmlFor="stu-parent">Parent / Guardian Name</label>
                <input
                  type="text"
                  id="stu-parent"
                  className="form-control"
                  placeholder="e.g. Samuel Miller"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="stu-contact">Emergency Contact No.</label>
                <input
                  type="text"
                  id="stu-contact"
                  className="form-control"
                  placeholder="+1 555-0199"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label htmlFor="stu-total-days">Total Academic Days</label>
                <input
                  type="number"
                  id="stu-total-days"
                  className="form-control"
                  value={totalDays}
                  onChange={(e) => setTotalDays(e.target.value)}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stu-present-days">Days Present</label>
                <input
                  type="number"
                  id="stu-present-days"
                  className="form-control"
                  value={presentDays}
                  onChange={(e) => setPresentDays(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="stu-remarks">General Teacher Comments & Remarks</label>
              <textarea
                id="stu-remarks"
                className="form-control"
                rows="2"
                placeholder="Academic attitude, participation, and strengths..."
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
              {student ? 'Update Student' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
