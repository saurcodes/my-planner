import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Planning from './pages/Planning';
import Focus from './pages/Focus';
import Analytics from './pages/Analytics';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="planning" element={<Planning />} />
            <Route path="focus" element={<Focus />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

// Auth callback component
function AuthCallback() {
  const { setToken } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, [setToken]);

  return <div className="flex items-center justify-center min-h-screen">
    <div className="text-xl">Processing login...</div>
  </div>;
}

export default App;
