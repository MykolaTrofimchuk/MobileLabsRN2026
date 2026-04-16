import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    // В реальному додатку тут був би запит до API
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const register = (email, password, name) => {
    if (email && password && name) {
      setIsAuthenticated(true); // Автоматичний вхід після реєстрації
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);