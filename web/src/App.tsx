import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Spinner from './components/Spinner';

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
        <Toaster position="top-right" />
      </Router>
    </>
  );
}

// Auth callback component
function AuthCallback() {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [setToken, navigate]);

  return <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <Spinner className="w-8 h-8 text-terra-500" />
      <p className="text-warm-500 text-sm font-medium">Processing login...</p>
    </div>
  </div>;
}

export default App;
