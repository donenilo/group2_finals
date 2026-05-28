## Latest Update - frontend/v2

### Added
- `Register.jsx` — Sign-up form with role dropdown (Student, Faculty, DO, Admin) and Student Number validation (`202X-XXXXXX`)
- `Login.jsx` — Login form with email/password validation and role-based redirect
- `/register` and `/login` routes added to `App.jsx`

### Changed
- `Home.jsx` — Added **Register** button to hero section
- `Home.css` — Unified pill button styling across all hero buttons
- `Navbar.jsx` — Login/Logout toggle based on session state
- `EditReport.jsx` — Fixed PUT request to send correct fields (`title`, `item_type`, `date_reported`) to backend
- `Register.jsx` footer link now correctly points to `/login`

### Fixed
- Hero buttons now share consistent pill shape, height, and padding
- Admin edit form no longer fails on update due to missing required fields
