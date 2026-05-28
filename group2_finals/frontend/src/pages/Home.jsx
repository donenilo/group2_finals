import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <p className="hero-subtitle">NU Laguna Lost and Found System</p>
            <h1 className="hero-title">
              Helping the <span className="highlight">NU Community</span> Find What Matters.
            </h1>
            <p className="hero-quote">"For and By the Nationalians."</p>

            <div className="hero-buttons">
              <button className="primary-btn" onClick={() => navigate('/items')}>
                Browse Items
              </button>
              <button className="secondary-btn" onClick={() => navigate('/report-item')}>
                Report an Item
              </button>
              <button className="tertiary-btn" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="about-section">
        <div className="about-grid">
          <div className="about-text">
            <h2 className="section-title">What is NUHanap?</h2>
            <p>
              Developed by the <strong>School of Computer Studies</strong> students,
              <strong> NUHanap?</strong> is a student project to digitize the manual lost and found process
              at NU Laguna. Our goal is to create a more transparent and efficient
              way for Nationalians to recover their belongings and foster a culture of integrity.
            </p>
          </div>
          <div className="about-stats">
            <div className="stat-card">
              <h3>Community</h3>
              <p>Built specifically for NU Laguna Students and Staffs.</p>
            </div>
            <div className="stat-card">
              <h3>Integrity</h3>
              <p>Ensuring every item finds its rightful owner through a verified and transparent system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-title">Where to Find Us?</h3>
            <p><strong>NU Laguna Campus</strong></p>
            <p>Km. 53 Pan-Philippine Hwy, Brgy. Milagrosa, Calamba, 4027 Laguna.</p>
            <p className="office-note">Visit the NU Laguna Discipline Office for physical item turnovers.</p>
          </div>
          <div className="footer-badge">
            <a
              href="https://www.facebook.com/NULagunaPh"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <span className="nu-badge">NU Laguna</span>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NUHanap? | NU Laguna - School of Computer Studies</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;