import React, { useState } from 'react';
import './MyReports.css';

// Placeholder frontend list view for reported items per student.
// Backend integration will replace the sampleData and handlers.

const sampleData = [
  {
    id: 1,
    studentName: 'Alice Johnson',
    studentId: 'S1001',
    studentEmail: 'alice@example.com',
    reports: [
      { id: 'r1', title: 'Lost Wallet', date: '2026-01-12' },
      { id: 'r2', title: 'Found Keys', date: '2026-02-03' },
    ],
  },
  {
    id: 2,
    studentName: 'Bob Smith',
    studentId: 'S1002',
    studentEmail: 'bob@example.com',
    reports: [{ id: 'r3', title: 'Lost ID', date: '2026-03-08' }],
  },
];

export default function MyReports() {
  const [data] = useState(sampleData);
  const [openId, setOpenId] = useState(null);

  // Read user from localStorage if present
  let currentUser = null;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    currentUser = raw ? JSON.parse(raw) : null;
  } catch (e) {
    currentUser = null;
  }

  // If there's a logged-in user, try to match them in the sample data by email or name or id
  let matched = null;
  if (currentUser) {
    matched = data.find((s) => {
      if (currentUser.email && s.studentEmail && s.studentEmail === currentUser.email) return true;
      if (currentUser.student_number && s.studentId && s.studentId === currentUser.student_number) return true;
      if (currentUser.full_name && s.studentName && s.studentName === currentUser.full_name) return true;
      return false;
    }) || null;
  }

  // For placeholder purposes: if matched, show that student's reports; otherwise show demo placeholder list
  const displayStudents = matched ? [matched] : data;

  return (
    <div className="myreports-page">
      <div className="myreports-container">
        <div className="myreports-header">
          <h2 className="myreports-title">My Reports</h2>
        </div>

        {!currentUser ? (
          <p className="myreports-subtitle">Demo placeholder of reported items. Login will show your personal reports.</p>
        ) : (
          <p className="myreports-subtitle">Below are your reported items (placeholder data).</p>
        )}

        <div className="myreports-grid">
          {displayStudents.map((student) => (
            <div key={student.id} className="myreports-card">
              <div className="myreports-card-header">
                <h3 className="myreports-card-title">{student.studentName}</h3>
                <div className="myreports-status">ID: {student.studentId}</div>
              </div>

              <div className="myreports-meta">
                <div className="myreports-meta-item">
                  <div className="myreports-meta-label">Reports</div>
                  <div>{student.reports.length}</div>
                </div>
              </div>

              {openId === student.id ? (
                <div className="myreports-description">
                  {student.reports.length === 0 ? (
                    <div className="myreports-empty">No reports yet.</div>
                  ) : (
                    student.reports.map((r) => (
                      <div key={r.id} className="myreports-report-item">
                        • {r.title} — <span className="myreports-meta-label">{r.date}</span>
                      </div>
                    ))
                  )}
                </div>
              ) : null}

              <div className="myreports-actions">
                <button
                  onClick={() => setOpenId(openId === student.id ? null : student.id)}
                  className={openId === student.id ? 'myreports-btn myreports-btn-primary' : 'myreports-btn myreports-btn-secondary'}
                >
                  {openId === student.id ? 'Hide' : 'View'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
