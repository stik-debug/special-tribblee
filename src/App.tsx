import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { store } from './lib/store';
import type { User } from './lib/types';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [user, setUser] = useState<User | null>(store.getCurrentUser());
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setUser(store.getCurrentUser());
      setTick(t => t + 1);
    });
    return () => { unsub(); };
  }, []);

  const refresh = useCallback(() => {
    setUser(store.getCurrentUser());
    setTick(t => t + 1);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth onAuth={refresh} />} />
        <Route path="/auth/:mode" element={<Auth onAuth={refresh} />} />
        <Route path="/dashboard/*" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
        <Route path="/admin/*" element={user?.role === 'SUPER_ADMIN' ? <AdminPanel user={user} /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
