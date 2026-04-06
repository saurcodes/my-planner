import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Target, BarChart3, LogOut, Clock, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';

function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-6 p-4 bg-cream-200/60 rounded-2xl">
      <div className="text-warm-400 text-xs font-semibold tracking-wider uppercase mb-1">Now</div>
      <div className="text-2xl font-display text-warm-900">
        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-sm text-warm-500 mt-0.5">
        {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Planning', href: '/planning', icon: Calendar },
    { name: 'Focus Mode', href: '/focus', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 bg-terra-500 rounded-xl flex items-center justify-center">
            <Clock className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-display text-warm-900">TimeFlow</h1>
        </div>
        <p className="text-warm-400 text-xs font-medium tracking-wider ml-[42px]">
          AI-Powered Productivity
        </p>
        <LiveClock />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 space-y-1 mt-2 overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`group flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 animate-slide-in-right ${
                isActive
                  ? 'bg-terra-50 text-terra-600 font-semibold'
                  : 'text-warm-500 hover:bg-cream-200/60 hover:text-warm-700'
              }`}
              style={{ animationDelay: `${0.05 + index * 0.04}s` }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-terra-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-warm-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-warm-400 hover:text-terra-600 hover:bg-terra-50 w-full transition-all duration-200 group"
        >
          <LogOut size={20} strokeWidth={2} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-soft border border-warm-100"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-72 bg-white/80 backdrop-blur-sm border-r border-warm-100 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {/* Sidebar - Mobile overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-warm-900/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-warm-xl flex flex-col animate-slide-in-right">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto min-h-screen">
        <main className="p-6 md:p-10 max-w-6xl mx-auto pt-16 md:pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
