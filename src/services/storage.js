/**
 * LocalStorage Data Management Layer
 * Handles persistence for Users, Students, Marks/Scores, Attendance,
 * Grading Scheme, Curriculum Subjects, Exam Terms, and UI Theme.
 */

export const STORAGE_KEYS = {
  USERS: 'srs_users',
  CURRENT_USER: 'srs_current_user',
  STUDENTS: 'srs_students',
  GRADING_SCHEME: 'srs_grading_scheme',
  TERMS: 'srs_terms',
  SUBJECTS: 'srs_subjects',
  THEME: 'srs_theme'
};

export const DEFAULT_GRADING_SCHEME = [
  { grade: 'A+', min: 90, max: 100, gpa: 4.0, remark: 'Outstanding Performance' },
  { grade: 'A',  min: 80, max: 89,  gpa: 3.7, remark: 'Excellent Performance' },
  { grade: 'B+', min: 70, max: 79,  gpa: 3.3, remark: 'Very Good Understanding' },
  { grade: 'B',  min: 60, max: 69,  gpa: 3.0, remark: 'Good Effort & Understanding' },
  { grade: 'C',  min: 50, max: 59,  gpa: 2.0, remark: 'Satisfactory' },
  { grade: 'D',  min: 40, max: 49,  gpa: 1.0, remark: 'Pass / Needs Additional Focus' },
  { grade: 'F',  min: 0,  max: 39,  gpa: 0.0, remark: 'Needs Improvement / Fail' }
];

export const DEFAULT_SUBJECTS = ['Mathematics', 'Science', 'English Literature', 'Social Studies', 'Computer Science'];
export const DEFAULT_TERMS = ['Term 1', 'Mid-Term', 'Final Exam'];

export const DEFAULT_REMARKS_PRESETS = [
  'Demonstrates outstanding analytical thinking and consistent high effort.',
  'Excellent comprehension of complex topics with active class participation.',
  'Very good academic progress with steady improvement across terms.',
  'Good general effort; encouraged to participate more actively in class discussions.',
  'Shows great potential in STEM subjects; dedicated practice recommended in humanities.',
  'Requires extra focus on fundamental concepts and timely submission of assignments.',
  'Shows exemplary discipline, leadership skills, and teamwork in projects.'
];

export const DEFAULT_STUDENTS = [
  {
    id: 'STU1001',
    name: 'Emily Davis',
    email: 'student@school.edu',
    grade: 'Grade 10',
    section: 'A',
    rollNo: '101',
    parentName: 'Robert Davis',
    contact: '+1 555-0192',
    totalDays: 120,
    presentDays: 116,
    remarks: 'Demonstrates outstanding analytical thinking and consistent high effort.',
    scores: {
      'Term 1': {
        'Mathematics': 92,
        'Science': 88,
        'English Literature': 85,
        'Social Studies': 90,
        'Computer Science': 95
      },
      'Mid-Term': {
        'Mathematics': 95,
        'Science': 91,
        'English Literature': 87,
        'Social Studies': 92,
        'Computer Science': 98
      },
      'Final Exam': {
        'Mathematics': 96,
        'Science': 94,
        'English Literature': 89,
        'Social Studies': 95,
        'Computer Science': 99
      }
    }
  },
  {
    id: 'STU1002',
    name: 'GANESH',
    email: 'ganesh@gmail.com',
    grade: 'Grade 10',
    section: 'A',
    rollNo: '102',
    parentName: 'Sarah Johnson',
    contact: '+1 555-0184',
    totalDays: 120,
    presentDays: 108,
    remarks: 'Shows great potential in STEM subjects; dedicated practice recommended in humanities.',
    scores: {
      'Term 1': {
        'Mathematics': 78,
        'Science': 85,
        'English Literature': 68,
        'Social Studies': 74,
        'Computer Science': 88
      },
      'Mid-Term': {
        'Mathematics': 82,
        'Science': 89,
        'English Literature': 72,
        'Social Studies': 78,
        'Computer Science': 91
      },
      'Final Exam': {
        'Mathematics': 85,
        'Science': 92,
        'English Literature': 75,
        'Social Studies': 80,
        'Computer Science': 94
      }
    }
  },
  {
    id: 'STU1003',
    name: 'Michael Chen',
    email: 'michael.c@school.edu',
    grade: 'Grade 10',
    section: 'B',
    rollNo: '103',
    parentName: 'David Chen',
    contact: '+1 555-0176',
    totalDays: 120,
    presentDays: 119,
    remarks: 'Shows exemplary discipline, leadership skills, and teamwork in projects.',
    scores: {
      'Term 1': {
        'Mathematics': 94,
        'Science': 90,
        'English Literature': 82,
        'Social Studies': 86,
        'Computer Science': 98
      },
      'Mid-Term': {
        'Mathematics': 96,
        'Science': 92,
        'English Literature': 85,
        'Social Studies': 88,
        'Computer Science': 100
      },
      'Final Exam': {
        'Mathematics': 98,
        'Science': 95,
        'English Literature': 88,
        'Social Studies': 91,
        'Computer Science': 100
      }
    }
  },
  {
    id: 'STU1004',
    name: 'Sophia Rodriguez',
    email: 'sophia.r@school.edu',
    grade: 'Grade 10',
    section: 'B',
    rollNo: '104',
    parentName: 'Elena Rodriguez',
    contact: '+1 555-0165',
    totalDays: 120,
    presentDays: 112,
    remarks: 'Very good academic progress with steady improvement across terms.',
    scores: {
      'Term 1': {
        'Mathematics': 70,
        'Science': 74,
        'English Literature': 80,
        'Social Studies': 76,
        'Computer Science': 72
      },
      'Mid-Term': {
        'Mathematics': 75,
        'Science': 78,
        'English Literature': 84,
        'Social Studies': 81,
        'Computer Science': 79
      },
      'Final Exam': {
        'Mathematics': 81,
        'Science': 83,
        'English Literature': 88,
        'Social Studies': 85,
        'Computer Science': 84
      }
    }
  }
];

export const DEFAULT_USERS = [
  {
    id: 'USR001',
    name: 'Administrator / Teacher',
    email: 'admin@school.edu',
    password: 'admin',
    role: 'admin'
  },
  {
    id: 'USR002',
    name: 'Emily Davis',
    email: 'student@school.edu',
    password: 'student',
    role: 'user',
    studentId: 'STU1001'
  }
];

export class StorageService {
  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GRADING_SCHEME)) {
      localStorage.setItem(STORAGE_KEYS.GRADING_SCHEME, JSON.stringify(DEFAULT_GRADING_SCHEME));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TERMS)) {
      localStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(DEFAULT_TERMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }

  // Theme
  static getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  }

  static setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Users
  static getUsers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    } catch {
      return DEFAULT_USERS;
    }
  }

  static saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getCurrentUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Students
  static getStudents() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    } catch {
      return DEFAULT_STUDENTS;
    }
  }

  static getStudentById(id) {
    const students = this.getStudents();
    return students.find(s => s.id === id) || null;
  }

  static getStudentByEmail(email) {
    const students = this.getStudents();
    return students.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  static addStudent(student) {
    const students = this.getStudents();
    students.push(student);
    this.saveStudents(students);
    return student;
  }

  static updateStudent(id, updatedData) {
    let students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updatedData };
      this.saveStudents(students);
      return students[index];
    }
    return null;
  }

  static deleteStudent(id) {
    let students = this.getStudents();
    students = students.filter(s => s.id !== id);
    this.saveStudents(students);
  }

  // Grading Schemes
  static getGradingScheme() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.GRADING_SCHEME) || '[]');
    } catch {
      return DEFAULT_GRADING_SCHEME;
    }
  }

  static saveGradingScheme(scheme) {
    localStorage.setItem(STORAGE_KEYS.GRADING_SCHEME, JSON.stringify(scheme));
  }

  // Subjects
  static getSubjects() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]');
    } catch {
      return DEFAULT_SUBJECTS;
    }
  }

  static addSubject(subjectName) {
    const cleanName = subjectName.trim();
    if (!cleanName) return false;
    let subjects = this.getSubjects();
    if (!subjects.includes(cleanName)) {
      subjects.push(cleanName);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      return true;
    }
    return false;
  }

  static deleteSubject(subjectName) {
    let subjects = this.getSubjects();
    subjects = subjects.filter(s => s !== subjectName);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }

  // Terms
  static getTerms() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TERMS) || '[]');
    } catch {
      return DEFAULT_TERMS;
    }
  }

  static addTerm(termName) {
    const cleanName = termName.trim();
    if (!cleanName) return false;
    let terms = this.getTerms();
    if (!terms.includes(cleanName)) {
      terms.push(cleanName);
      localStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(terms));
      return true;
    }
    return false;
  }

  static deleteTerm(termName) {
    let terms = this.getTerms();
    terms = terms.filter(t => t !== termName);
    localStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(terms));
  }

  // Presets
  static getRemarksPresets() {
    return DEFAULT_REMARKS_PRESETS;
  }

  // Evaluation Helper
  static calculateGradeDetails(percentage, scheme = null) {
    const activeScheme = scheme || this.getGradingScheme();
    for (const rule of activeScheme) {
      if (percentage >= rule.min && percentage <= rule.max) {
        return rule;
      }
    }
    return { grade: 'F', gpa: 0.0, remark: 'Needs Improvement / Fail' };
  }

  // Export Master Students to CSV
  static exportMasterCSV(students, gradingScheme) {
    let csvContent = 'data:text/csv;charset=utf-8,';
    const headers = ['Student ID', 'Name', 'Email', 'Grade', 'Section', 'Roll No', 'Attendance %', 'Overall %', 'GPA', 'Grade'];
    csvContent += headers.join(',') + '\r\n';

    students.forEach(s => {
      let sum = 0, count = 0;
      Object.values(s.scores || {}).forEach(termScores => {
        Object.values(termScores || {}).forEach(score => {
          sum += Number(score) || 0;
          count++;
        });
      });
      const avg = count > 0 ? (sum / count).toFixed(1) : '0';
      const gradeInfo = this.calculateGradeDetails(Number(avg), gradingScheme);
      const attRate = s.totalDays ? Math.round((s.presentDays / s.totalDays) * 100) : 0;

      const row = [
        `"${s.id}"`,
        `"${s.name}"`,
        `"${s.email}"`,
        `"${s.grade}"`,
        `"${s.section}"`,
        `"${s.rollNo}"`,
        `"${attRate}%"`,
        `"${avg}%"`,
        `"${gradeInfo.gpa.toFixed(1)}"`,
        `"${gradeInfo.grade}"`
      ];
      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Student_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export Individual Marksheet CSV
  static exportStudentReportCSV(student, subjects, terms, gradingScheme) {
    if (!student) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Student Academic Report: ${student.name} (${student.id})\r\n`;
    csvContent += `Class: ${student.grade} ${student.section}, Roll No: ${student.rollNo}\r\n\r\n`;

    const headers = ['Subject', ...terms, 'Average %', 'Grade'];
    csvContent += headers.join(',') + '\r\n';

    subjects.forEach(sub => {
      let subSum = 0, subCount = 0;
      const row = [`"${sub}"`];

      terms.forEach(term => {
        const score = (student.scores && student.scores[term] && student.scores[term][sub]) !== undefined
          ? student.scores[term][sub]
          : '-';
        row.push(`"${score}"`);
        if (score !== '-') {
          subSum += Number(score);
          subCount++;
        }
      });

      const subAvg = subCount > 0 ? (subSum / subCount).toFixed(1) : '-';
      const grade = subAvg !== '-' ? this.calculateGradeDetails(Number(subAvg), gradingScheme).grade : '-';
      row.push(`"${subAvg}%"`, `"${grade}"`);

      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${student.name.replace(/\s+/g, '_')}_Report_${student.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
