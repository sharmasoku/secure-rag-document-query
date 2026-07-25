import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../api/analyticsApi';
import {
  User,
  ShieldCheck,
  LogOut,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  HardDrive,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: analyticsApi.getStats,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Profile Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 glass-panel">
        <div className="w-20 h-20 rounded-2xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 font-bold text-3xl shadow-xl shrink-0">
          {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-extrabold text-white">{user?.full_name || 'Enterprise User'}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-semibold text-[10px] uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Account
            </span>
          </div>
          <p className="text-sm text-slate-400 font-sans">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-300 font-semibold text-xs flex items-center gap-2 transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Profile Details & Usage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 glass-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Account Information</h3>
              <p className="text-xs text-slate-400">User credentials and metadata</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-500" /> Name
              </span>
              <span className="text-white font-semibold">{user?.full_name || 'User'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> Email
              </span>
              <span className="text-white font-mono">{user?.email}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Member Since
              </span>
              <span className="text-slate-300 font-sans">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Overview */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 glass-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-teal-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Workspace Usage</h3>
              <p className="text-xs text-slate-400">Resource overview</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> Documents Uploaded
              </span>
              <span className="text-white font-semibold">{stats?.total_documents || 0}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Questions Asked
              </span>
              <span className="text-white font-semibold">{stats?.total_queries || 0}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" /> Storage Used
              </span>
              <span className="text-emerald-400 font-semibold">{stats?.storage_used_mb || 0} MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

