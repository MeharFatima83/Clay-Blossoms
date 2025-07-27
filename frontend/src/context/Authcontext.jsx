'use client';
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("auth"));
      if (stored && stored.token) {
        setIsLoggedIn(true);
        setUsername(stored.username || "");
        setEmail(stored.email || "");
        setUserId(stored.userId || "");
        setToken(stored.token || "");
        setRole(stored.role || "");
      }
    } catch (error) {
      console.error("Failed to parse auth from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ username, email, userId, token, role })
      );
    } else {
      localStorage.removeItem("auth");
    }
  }, [isLoggedIn, username, email, userId, token, role]);

  const login = ({ username, email, userId, token, role }) => {
    setIsLoggedIn(true);
    setUsername(username);
    setEmail(email);
    setUserId(userId);
    setToken(token);
    setRole(role || "");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setEmail("");
    setUserId("");
    setToken("");
    setRole("");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, email, userId, token, role, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
