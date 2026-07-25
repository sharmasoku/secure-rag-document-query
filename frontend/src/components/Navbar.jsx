import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/':
        return { title: 'Dashboard Overview', desc: 'Enterprise document management and analytics' };
      case '/upload':
        return { title: 'Upload Document', desc: 'Securely upload and process your documents' };
      case '/documents':
        return { title: 'My Documents', desc: 'View and manage your stored documents' };
      case '/chat':
        return { title: 'AI Assistant', desc: 'Ask questions about your uploaded documents' };
      case '/profile':
        return { title: 'Profile & Security', desc: 'Manage account preferences and security status' };
      default:
        return { title: 'SecureDoc AI', desc: 'Enterprise Document Intelligence' };
    }
  };

  const { title, desc } = getPageTitle(location.pathname);

  return (
    <header className="h-20 bg-slate-900/60 border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-20 glass-panel">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-400 font-medium">{desc}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Encrypted Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted</span>
        </div>

        {/* Sensitive Data Protection Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sensitive Data Protection</span>
        </div>
      </div>
    </header>
  );
};

