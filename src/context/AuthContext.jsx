import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('kh_token');
    if (token) {
      getMe()
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('kh_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // API integrated here — token stored in localStorage
  const saveUser = (data) => {
    localStorage.setItem('kh_token', data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('kh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
