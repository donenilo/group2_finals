import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentNumber: "",
    userType: "Student",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStudentNumber = (value) => {
    // Pattern: 202X-XXXXXX (e.g., 2024-123456)
    const pattern = /^202[0-9]-\d{6}$/;
    return pattern.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};

    // Validate all fields
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full Name is required.";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format.";
    }

    // ID number rules depend on the selected role:
    //  - Student: required, must match 202X-XXXXXX
    //  - Faculty: required, any non-empty faculty number
    //  - DO / Admin: optional (staff accounts may have no ID)
    if (formData.userType === "Student") {
      if (!formData.studentNumber.trim()) {
        tempErrors.studentNumber = "Student Number is required.";
      } else if (!validateStudentNumber(formData.studentNumber)) {
        tempErrors.studentNumber = "Invalid format. Use: 202X-XXXXXX (e.g., 2024-123456)";
      }
    } else if (formData.userType === "Faculty") {
      if (!formData.studentNumber.trim()) {
        tempErrors.studentNumber = "Faculty Number is required.";
      }
    }

    if (!formData.userType) {
      tempErrors.userType = "Role is required.";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          student_number: formData.studentNumber.trim(),
          user_type: formData.userType,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed.");
      }

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message || "Failed to register. Backend may not be running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <header className="register-header">
          <div className="register-logo">
            <img
              src="https://static.wixstatic.com/media/2179b6_6c859da3978c4f17b27e723b90bc9f31~mv2.png/v1/fill/w_167,h_188,al_c,usm_0.66_1.00_0.01/zP6W5Ac5.png"
              alt="NU Logo"
              className="register-logo-img"
            />
          </div>
          <h1 className="register-title">Join NUHanap?</h1>
          <p className="register-subtitle">
            Register as a Student, Faculty, DO, or Admin to access the Lost and Found System.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Juan Dela Cruz"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "error-input" : ""}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="juan@students.nu-laguna.edu.ph"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* ID Number (label/format depends on role) */}
          <div className="form-group">
            <label htmlFor="studentNumber">
              {formData.userType === "Faculty"
                ? "Faculty Number"
                : formData.userType === "Student"
                ? "Student Number"
                : "ID Number (optional)"}
            </label>
            <input
              type="text"
              id="studentNumber"
              name="studentNumber"
              placeholder={
                formData.userType === "Faculty"
                  ? "FAC-0012"
                  : formData.userType === "Student"
                  ? "2024-123456"
                  : "Optional"
              }
              value={formData.studentNumber}
              onChange={handleChange}
              className={errors.studentNumber ? "error-input" : ""}
              maxLength="13"
            />
            {errors.studentNumber && <span className="error-message">{errors.studentNumber}</span>}
            {formData.userType === "Student" && (
              <p className="input-hint">Format: 202X-XXXXXX (e.g., 2024-123456)</p>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="form-group">
            <label htmlFor="userType">Role</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className={errors.userType ? "error-input" : ""}
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="DO">DO (Discipline Office)</option>
              <option value="Admin">Admin (IT)</option>
            </select>
            {errors.userType && <span className="error-message">{errors.userType}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error-input" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error-input" : ""}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="register-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Create Account"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="register-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;