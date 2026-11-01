import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could verify token here, but for simplicity, just set user if token exists
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // ── Demo Mode Bypass ───────────────────────────────────────────────────
    // This allows the demo to work even if the local database is not running
    const demoUsers = {
      'hotel@example.com':    { name: 'Hotel Manager', role: 'hotel', token: 'demo-token-hotel' },
      'ngo@example.com':      { name: 'NGO Officer',   role: 'user',  token: 'demo-token-ngo' },
      'user@example.com':     { name: 'Individual',    role: 'user',  token: 'demo-token-user' },
      'admin@foodrescue.com': { name: 'System Admin',  role: 'admin', token: 'demo-token-admin' }
    };

    if (demoUsers[email] && (password === 'hotel123' || password === 'ngo123' || password === 'user123' || password === 'admin123')) {
      console.log('🚀 Logged in via Demo Mode');
      const demoUser = demoUsers[email];
      localStorage.setItem('token', demoUser.token);
      setUser(demoUser);
      return { success: true };
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.message);
      return { success: false, message: err.response?.data?.message || 'Login failed. Please try demo credentials.' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      setUser({ name, email, role });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};