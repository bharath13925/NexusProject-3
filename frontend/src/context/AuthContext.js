// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [uid, setUid] = useState(localStorage.getItem('uid'));

  useEffect(() => {
    if (uid) {
      localStorage.setItem('uid', uid);
    } else {
      localStorage.removeItem('uid');
    }
  }, [uid]);

  return (
    <AuthContext.Provider value={{ uid, setUid }}>
      {children}
    </AuthContext.Provider>
  );
};
