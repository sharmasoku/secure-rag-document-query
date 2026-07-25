import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi } from '../api/documentApi';
import { DocumentModal } from '../components/DocumentModal';
import {
  FileText,
  Trash2,
  Eye,
  Search,
  ShieldCheck,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [docContent, setDocContent] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch Documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['userDocuments'],
    queryFn: documentApi.getDocuments,
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: documentApi.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setDeleteConfirmId(null);
    },
  });

  const handleInspectContent = async (docId) => {
    setSelectedDocId(docId);
    setIsLoadingContent(true);
    try {
      const data = await documentApi.viewDocumentContent(docId);
      setDocContent(data);
    } catch (err) {
      console.error('Failed to view document content:', err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toUpperCase();
    return ext || 'FILE';
  };

  const filteredDocs = documents.filter((doc) =>
    doc.original_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            My Documents
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your uploaded documents and view protection status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white placeholder-slate-600 outline-none w-48 sm:w-64"
            />
          </div>

          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Documents Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading documents...</p>
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Document Name</th>
                  <th className="py-4 px-6">File Type</th>
                  <th className="py-4 px-6">Upload Date</th>
                  <th className="py-4 px-6">Size</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="truncate max-w-xs">{doc.original_name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-300">
                        {getFileType(doc.original_name)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {(doc.file_size / (1024 * 1024)).toFixed(2)} MB
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-semibold flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Protected
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {/* View Content Button */}
                      <button
                        onClick={() => handleInspectContent(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium inline-flex items-center gap-1.5 transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirmId(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/50 font-medium inline-flex items-center gap-1.5 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 glass-card">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No documents uploaded yet.</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload your first document to get started.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl glass-panel">
            <div className="flex items-center gap-3 text-rose-400 font-bold text-base">
              <AlertCircle className="w-5 h-5" />
              <span>Delete Document</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Document Preview Modal */}
      <DocumentModal
        isOpen={!!selectedDocId}
        onClose={() => {
          setSelectedDocId(null);
          setDocContent(null);
        }}
        documentContent={docContent}
        isLoading={isLoadingContent}
      />
    </div>
  );
};

