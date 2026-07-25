import React from 'react';
import { X, FileText, ShieldCheck, FileCheck } from 'lucide-react';

export const DocumentModal = ({ isOpen, onClose, documentContent, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white truncate max-w-md">
                {documentContent?.filename || 'Document Content Preview'}
              </h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sensitive Data Protected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading document preview...</p>
            </div>
          ) : (
            <>
              {/* Metadata Pill */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Document Status</span>
                  <p className="text-sm font-semibold text-white">Active & Ready for AI Queries</p>
                </div>
              </div>

              {/* Text Box */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Document Preview
                </label>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {documentContent?.masked_preview || 'No preview content available.'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

