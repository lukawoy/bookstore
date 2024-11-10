import React, { createContext, useEffect, useState } from "react";
import AuthService from "../components/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    AuthService.login(userData.email, userData.password);
  };

  const logout = () => {
    setUser(null);
    AuthService.logout();
  };

  const isAuthenticated = () => {
    return AuthService.isAuthenticated();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
