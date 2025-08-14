import React, { useState, useEffect } from 'react';
import { createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Setting demo user');
    const demoUser = { _id: '6893646d0a743246a7777ee2', name: 'Demo User', email: 'demo@demo.com' };
    if (!user) {
      localStorage.setItem('token', 'demo-token');
      setUser(demoUser);
    }
  }, [user]);

  const login = async (credentials) => {
    // Placeholder for login logic
    console.log('Login attempted with:', credentials);
  };

  const signup = async (credentials) => {
    // Placeholder for signup logic
    console.log('Signup attempted with:', credentials);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};





// import React, { createContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       api.get('/auth/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       }).then((res) => setUser(res.data)).catch(() => localStorage.removeItem('token'));
//     }
//   }, []);

//   const login = async (credentials) => {
//     const res = await api.post('/auth/signin', credentials);
//     localStorage.setItem('token', res.data.token);
//     setUser(res.data.user);
//     navigate('/');
//   };

//   const signup = async (credentials) => {
//     const res = await api.post('/auth/signup', credentials);
//     localStorage.setItem('token', res.data.token);
//     setUser(res.data.user);
//     navigate('/');
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     navigate('/signin');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };