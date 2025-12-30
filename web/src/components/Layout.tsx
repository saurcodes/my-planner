import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Target, BarChart3, LogOut, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Planning', href: '/planning', icon: Calendar },
    { name: 'Focus Mode', href: '/focus', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex relative">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-br from-deep-indigo/90 to-twilight/80 backdrop-blur-xl border-r border-white/10 flex flex-col relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 -left-20 w-60 h-60 bg-gradient-to-br from-acid-lime/20 to-electric-cyan/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-gradient-to-br from-sunset-pink/15 to-sunset-orange/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

        {/* Header with Live Clock */}
        <div className="p-8 pb-6 relative z-10">
          <div className="flex items-baseline gap-3 mb-2 animate-fade-in-up">
            <Clock className="text-acid-lime" size={28} strokeWidth={1.5} />
            <h1 className="text-5xl font-display text-gradient glow-text">
              TimeFlow
            </h1>
          </div>
          <p className="text-white/60 text-sm font-medium tracking-wide ml-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            AI-Powered Productivity
          </p>

          {/* Live Time Display */}
          <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-1">Current Time</div>
            <div className="text-3xl font-display text-white">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-white/70 mt-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2 relative z-10 overflow-y-auto">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 animate-slide-in-right ${
                  isActive
                    ? 'bg-gradient-to-br from-acid-lime/20 to-electric-cyan/10 border-2 border-acid-lime/40 text-white shadow-lg shadow-acid-lime/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white border-2 border-transparent hover:border-white/20'
                }`}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className={`relative ${isActive ? 'text-acid-lime' : 'text-white/60 group-hover:text-white/90'}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <div className="absolute inset-0 blur-md bg-acid-lime/50" />
                  )}
                </div>
                <span className={`font-semibold tracking-wide ${isActive ? 'text-white' : ''}`}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-acid-lime shadow-lg shadow-acid-lime/50 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer with Logout */}
        <div className="p-6 border-t border-white/10 relative z-10">
          <button
            onClick={logout}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white/70 hover:text-white hover:bg-white/10 w-full transition-all duration-300 border-2 border-transparent hover:border-white/20 group"
          >
            <LogOut size={22} strokeWidth={2} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold tracking-wide">Logout</span>
          </button>

          {/* Version badge */}
          <div className="mt-4 text-center text-white/30 text-xs font-medium tracking-wider">
            v1.0.0 BETA
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-midnight">
        <main className="p-10 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
