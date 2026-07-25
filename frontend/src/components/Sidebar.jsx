import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  MessageSquare,
  User,
  LogOut,
  ShieldCheck,
  Settings,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Document', path: '/upload', icon: UploadCloud },
    { name: 'My Documents', path: '/documents', icon: FileText },
    { name: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/profile', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none glass-panel">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-950/30">
          <ShieldCheck className="w-6 h-6 text-slate-950" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
            SecureDoc <span className="text-emerald-400 font-extrabold">AI</span>
          </h1>
          <span className="text-[10px] font-medium tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50 mt-1 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Encrypted Workspace
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${item.path}-${idx}`}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Info & Logout */}
      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700/50 flex items-center justify-center font-bold text-xs text-emerald-300 uppercase shrink-0">
            {user?.email?.charAt(0) || 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.full_name || 'User'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

