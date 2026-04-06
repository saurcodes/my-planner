import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Spinner from '@/components/Spinner';
import { Clock, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/api/auth/google';
    }, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-terra-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-peach/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="card max-w-md w-full relative animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-terra-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-warm">
            <Clock className="text-white" size={32} strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-display text-warm-900 mb-2">TimeFlow</h1>
          <p className="text-warm-500 text-sm">AI-Powered Time Management</p>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-display mb-2">Welcome back</h2>
            <p className="text-warm-500 text-sm">
              Organize your day with the Eisenhower Matrix and AI-powered planning
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full btn btn-primary flex items-center justify-center gap-3 py-4 text-base group"
            aria-label="Continue with Google"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Continuing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight size={18} className="ml-auto group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-warm-400">
            By continuing, you agree to our Terms of Service
          </p>

          <div className="pt-6 border-t border-warm-100">
            <h3 className="font-display text-base mb-4">Key Features</h3>
            <ul className="space-y-3">
              {[
                'Eisenhower Matrix for task prioritization',
                'AI-powered daily planning with Claude',
                'Focus mode with Pomodoro timer',
                'Analytics and productivity insights',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-warm-600">
                  <span className="w-5 h-5 rounded-full bg-terra-50 text-terra-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">&#10003;</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
