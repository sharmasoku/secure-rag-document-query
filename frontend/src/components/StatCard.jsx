import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, accentColor = 'emerald' }) => {
  const colorStyles = {
    emerald: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400',
    teal: 'from-teal-500/20 to-teal-900/10 border-teal-500/30 text-teal-400',
    cyan: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30 text-cyan-400',
    amber: 'from-amber-500/20 to-amber-900/10 border-amber-500/30 text-amber-400',
  };

  const selectedStyle = colorStyles[accentColor] || colorStyles.emerald;

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedStyle} border glass-card transition-all duration-300 hover:scale-[1.02] shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="w-10 h-10 rounded-xl bg-slate-900/80 flex items-center justify-center border border-slate-800 shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-extrabold text-white tracking-tight mb-1">{value}</div>
      <p className="text-xs text-slate-400 font-medium">{subtext}</p>
    </div>
  );
};
