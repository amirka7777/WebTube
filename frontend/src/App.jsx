import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Watch from './pages/Watch';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  
  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {}
        <Route 
          path="/auth" 
          element={!token ? <Auth onLogin={login} /> : <Navigate to="/watch" />} 
        />
        
        {}
        <Route 
          path="/watch" 
          element={<Watch token={token} user={user} onLogout={logout} setUser={setUser} />} 
        />

        {}
        <Route path="*" element={<Navigate to="/watch" />} />
      </Routes>
    </Router>
  );
}

export default App;