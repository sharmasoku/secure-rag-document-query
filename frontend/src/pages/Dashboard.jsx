import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../api/analyticsApi';
import { StatCard } from '../components/StatCard';
import {
  FileText,
  MessageSquare,
  HardDrive,
  ShieldCheck,
  UploadCloud,
  ArrowRight,
  Activity,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: analyticsApi.getStats,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading dashboard...</p>
      </div>
    );
  }

  const formatActivityAction = (action) => {
    switch (action) {
      case 'DOC_UPLOAD':
        return 'Uploaded document';
      case 'QUERY_EXECUTE':
        return 'Asked question';
      case 'USER_LOGON':
        return 'Signed in';
      case 'USER_REGISTER':
        return 'Account created';
      case 'DOC_DELETE':
        return 'Deleted document';
      default:
        return action || 'Activity logged';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden glass-panel">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Protected Workspace
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.full_name || 'User'}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ask questions about your documents securely.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate('/upload')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Open AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="My Documents"
          value={stats?.total_documents || 0}
          subtext="Active documents"
          icon={FileText}
          accentColor="emerald"
        />
        <StatCard
          title="Questions Asked"
          value={stats?.total_queries || 0}
          subtext="Total AI interactions"
          icon={MessageSquare}
          accentColor="teal"
        />
        <StatCard
          title="Storage"
          value={`${stats?.storage_used_mb || 0} MB`}
          subtext="Used capacity"
          icon={HardDrive}
          accentColor="cyan"
        />
        <StatCard
          title="Security Status"
          value="Protected"
          subtext="Sensitive Data Protection active"
          icon={ShieldCheck}
          accentColor="amber"
        />
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Recent Activity</h3>
              <p className="text-xs text-slate-400">Latest actions in your workspace</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/documents')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
          >
            View Documents <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {stats?.recent_activity?.length > 0 ? (
            stats.recent_activity.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-slate-800/80 text-emerald-400 font-semibold text-[11px]">
                    {formatActivityAction(act.action)}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {act.details?.filename || act.details?.question_preview || 'Action completed'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              No recent activity recorded yet. Upload your first document to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

