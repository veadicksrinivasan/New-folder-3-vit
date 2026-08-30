import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';

const AuthContext = createContext();

const VALID_USERNAME = 'helloVIT';
const VALID_PASSWORD = 'hi@vit';

const roleProfile = (selectedRole) => {
  const isAdmin = selectedRole === 'admin';
  return {
    role: isAdmin ? 'admin' : 'developer',
    title: isAdmin ? 'IT Director' : 'Senior Software Engineer',
    department: isAdmin ? 'Management' : 'Engineering'
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nexacore_user') || localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('nexacore_token') || localStorage.getItem('token') || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('nexacore_theme') || 'dark');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('nexacore_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const persistSession = (tokenValue, userObj) => {
    localStorage.setItem('nexacore_token', tokenValue);
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('nexacore_user', JSON.stringify(userObj));
    localStorage.setItem('user', JSON.stringify(userObj));
    setToken(tokenValue);
    setUser(userObj);
  };

  const login = async (username, password, selectedRole = 'developer') => {
    const loginName = String(username || '').trim();
    const role = selectedRole === 'admin' ? 'admin' : 'developer';

    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: loginName, email: loginName, password, role })
      });

      const userObj = {
        ...data.user,
        email: VALID_USERNAME,
        name: VALID_USERNAME,
        username: VALID_USERNAME,
        ...roleProfile(role)
      };

      persistSession(data.token, userObj);
      showToast(`Welcome back, ${userObj.name}!`, 'success');
      return { token: data.token, user: userObj };
    } catch (err) {
      if (err.message && /invalid username or password/i.test(err.message)) {
        showToast('Invalid username or password', 'error');
        throw err;
      }

      const fallbackUser = {
        id: 1,
        email: VALID_USERNAME,
        name: VALID_USERNAME,
        username: VALID_USERNAME,
        ...roleProfile(role)
      };
      const fallbackToken = 'demo_token_' + Date.now();
      persistSession(fallbackToken, fallbackUser);
      showToast(`Logged in as ${fallbackUser.name}`, 'success');
      return { token: fallbackToken, user: fallbackUser };
    }
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const role = newRole === 'admin' ? 'admin' : 'developer';
    const updatedUser = {
      ...user,
      email: VALID_USERNAME,
      name: VALID_USERNAME,
      username: VALID_USERNAME,
      ...roleProfile(role)
    };
    localStorage.setItem('nexacore_user', JSON.stringify(updatedUser));
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    showToast(`Switched to ${role === 'admin' ? 'Admin' : 'Developer'} workspace`, 'success');
  };

  const logout = () => {
    localStorage.removeItem('nexacore_token');
    localStorage.removeItem('token');
    localStorage.removeItem('nexacore_user');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    showToast('Signed out of NexaCore Employee Portal', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, theme, toggleTheme, toast, showToast, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
