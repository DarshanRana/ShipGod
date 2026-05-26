import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${API_BASE}/api/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { id, name, email }
  const [loading, setLoading] = useState(true); // checking stored token on mount

  // On app load — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('sg_token');
    if (!token) { setLoading(false); return; }

    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.user) setUser(data.user); })
      .catch(() => localStorage.removeItem('sg_token'))
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('sg_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const signIn = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('sg_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const signOut = () => {
    localStorage.removeItem('sg_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
