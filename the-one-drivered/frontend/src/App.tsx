import React, { useState } from 'react';
import { isAuthenticated } from './auth/useAuth';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(isAuthenticated());

  return loggedIn ? (
    <Dashboard />
  ) : (
    <LoginPage onLoggedIn={() => setLoggedIn(true)} />
  );
};

export default App;