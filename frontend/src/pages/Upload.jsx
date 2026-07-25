import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentApi } from '../api/documentApi';
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Upload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    const validExts = ['.pdf', '.docx', '.txt', '.md'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExts.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setError('Invalid file format. Please upload a PDF, DOCX, or TXT document.');
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      return;
    }

    setFile(selectedFile);
    setUploadedDoc(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    setError('');

    try {
      const result = await documentApi.uploadDocument(file, (percent) => {
        setProgress(percent);
      });
      setUploadedDoc(result);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload and process document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 glass-panel">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-emerald-400" />
          Upload Document
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Upload documents to your secure workspace. Supported formats: PDF, DOCX, and TXT.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-center gap-3 text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-12 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center relative overflow-hidden ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/30 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/40 hover:border-emerald-500/50 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-emerald-400 shadow-xl mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {isDragging ? 'Drop your document here' : 'Click to browse or drag & drop'}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          Supports PDF, DOCX, TXT files up to 15MB.
        </p>

        <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-slate-500">
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">.PDF</span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">.DOCX</span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">.TXT</span>
        </div>
      </div>

      {/* Selected File Card & Upload Controls */}
      {file && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Processing document...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!isUploading && (
            <button
              onClick={handleUpload}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      )}

      {/* Success Banner */}
      {uploadedDoc && (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-base font-bold text-white">Document Uploaded Successfully</h4>
              <p className="text-xs text-slate-300">
                Your document is ready to be queried with the AI Assistant.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              Open AI Assistant <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700"
            >
              View My Documents
            </button>
          </div>
        </div>
      )}

      {/* Processing Steps */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Processing Steps
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-400">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-emerald-400 font-bold block">1. Reading Document</span>
            <p className="text-[11px] mt-0.5 text-slate-400">File structure analysis</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-teal-400 font-bold block">2. Protecting Sensitive Data</span>
            <p className="text-[11px] mt-0.5 text-slate-400">Automatic privacy filters</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block">3. Preparing Document</span>
            <p className="text-[11px] mt-0.5 text-slate-400">Content indexing</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-emerald-300 font-bold block">4. Ready</span>
            <p className="text-[11px] mt-0.5 text-slate-400">Available for queries</p>
          </div>
        </div>
      </div>
    </div>
  );
};

