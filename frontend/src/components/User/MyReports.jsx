import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyReports.css';

// Shows the lost & found reports submitted by the currently logged-in user.
// Reports are pulled from the backend, matched to the user by email or name.

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  // Read the logged-in user from localStorage.
  let currentUser = null;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    currentUser = raw ? JSON.parse(raw) : null;
  } catch {
    currentUser = null;
  }

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams();
    if (currentUser.email) params.append('email', currentUser.email);
    if (currentUser.full_name || currentUser.name) {
      params.append('name', currentUser.full_name || currentUser.name);
    }

    fetch(`http://localhost:5000/api/users/me/reports?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load your reports.');
        return r.json();
      })
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load your reports. Is the backend running?'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = currentUser
    ? currentUser.full_name || currentUser.name || 'You'
    : null;

  return (
    <div className="myreports-page">
      <div className="myreports-container">
        <div className="myreports-header">
          <h2 className="myreports-title">My Reports</h2>
        </div>

        {!currentUser ? (
          <>
            <p className="myreports-subtitle">
              You need to be logged in to see your reports.
            </p>
            <div className="myreports-actions">
              <button className="myreports-btn myreports-btn-primary" onClick={() => navigate('/login')}>
                Go to Login
              </button>
            </div>
          </>
        ) : loading ? (
          <p className="myreports-subtitle">Loading your reports…</p>
        ) : error ? (
          <p className="myreports-subtitle">{error}</p>
        ) : (
          <>
            <p className="myreports-subtitle">
              {reports.length > 0
                ? `${displayName}, you have ${reports.length} report${reports.length === 1 ? '' : 's'}.`
                : `${displayName}, you haven't reported any items yet.`}
            </p>

            <div className="myreports-grid">
              {reports.length === 0 ? (
                <div className="myreports-card">
                  <div className="myreports-empty">
                    No reports found under your name or email.
                  </div>
                  <div className="myreports-actions">
                    <button className="myreports-btn myreports-btn-primary" onClick={() => navigate('/report-item')}>
                      Report an Item
                    </button>
                  </div>
                </div>
              ) : (
                reports.map((item) => (
                  <div key={item.id} className="myreports-card">
                    <div className="myreports-card-header">
                      <h3 className="myreports-card-title">{item.title || 'Untitled'}</h3>
                      <div className="myreports-status">{item.status}</div>
                    </div>

                    <div className="myreports-meta">
                      <div className="myreports-meta-item">
                        <div className="myreports-meta-label">Category</div>
                        <div>{item.item_type || '—'}</div>
                      </div>
                      <div className="myreports-meta-item">
                        <div className="myreports-meta-label">Date</div>
                        <div>{item.date_reported || '—'}</div>
                      </div>
                    </div>

                    {openId === item.id && (
                      <div className="myreports-description">
                        <div className="myreports-report-item">
                          <span className="myreports-meta-label">Location: </span>
                          {item.location || '—'}
                        </div>
                        <div className="myreports-report-item">
                          {item.description || 'No description.'}
                        </div>
                      </div>
                    )}

                    <div className="myreports-actions">
                      <button
                        onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        className={openId === item.id ? 'myreports-btn myreports-btn-primary' : 'myreports-btn myreports-btn-secondary'}
                      >
                        {openId === item.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
