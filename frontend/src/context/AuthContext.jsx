import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const role = user?.role?.toLowerCase() || null;
  const isLoggedIn = !!user;
  const isAdmin = role === "admin";
  const isDO = role === "do";
  const isAdminOrDO = isAdmin || isDO;

  return (
    <AuthContext.Provider value={{ user, role, isLoggedIn, isAdmin, isDO, isAdminOrDO, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);