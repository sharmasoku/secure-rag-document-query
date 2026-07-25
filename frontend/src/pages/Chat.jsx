import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  Trash2,
  Bot,
  User,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

export const Chat = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Load past history
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: chatApi.getHistory,
  });

  useEffect(() => {
    if (history.length > 0) {
      setMessages(history);
    }
  }, [history]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Ask Question Mutation
  const askMutation = useMutation({
    mutationFn: chatApi.askQuestion,
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data]);
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || askMutation.isPending) return;

    const userQuestion = question.trim();
    setQuestion('');

    // Optimistic UI update
    const tempUserMsg = {
      id: `temp_${Date.now()}`,
      question: userQuestion,
      answer: null,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    askMutation.mutate(userQuestion);
  };

  const handleClearHistory = async () => {
    await chatApi.clearHistory();
    setMessages([]);
    queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
  };

  const handleCopyAnswer = (text, msgId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    'Summarize key insights from my uploaded documents.',
    'What are the critical dates and deadlines mentioned?',
    'List all compliance and security requirements outlined in the files.',
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto space-y-4 animate-fadeIn">
      {/* Control Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AI Assistant
            </h3>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Ready to answer questions about your documents
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6 glass-card">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Loading conversation...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, idx) => {
            const sources = msg.referenced_documents || (msg.source_chunks ? Array.from(new Set(msg.source_chunks.map(c => c.filename).filter(Boolean))) : []);

            return (
              <div key={msg.id || idx} className="space-y-4">
                {/* User Question Bubble */}
                <div className="flex items-start justify-end gap-3">
                  <div className="max-w-xl p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-white text-sm leading-relaxed shadow-sm">
                    {msg.question}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                </div>

                {/* AI Assistant Answer Bubble */}
                {msg.answer ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="max-w-2xl space-y-3">
                      <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap shadow-md">
                        {msg.answer}
                      </div>

                      {/* Source Documents & Confidence */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Answer Confidence */}
                          {msg.confidence_score > 0 && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              {(msg.confidence_score * 100).toFixed(0)}% Answer Confidence
                            </span>
                          )}

                          {/* Source Documents List */}
                          {sources.length > 0 && (
                            <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-medium flex items-center gap-1.5">
                              <FileText className="w-3 h-3 text-emerald-400" />
                              <span>Source: {sources.join(', ')}</span>
                            </span>
                          )}
                        </div>

                        {/* Copy Answer Button */}
                        <button
                          onClick={() => handleCopyAnswer(msg.answer, msg.id || idx)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                        >
                          {copiedId === (msg.id || idx) ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Loading State */
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 animate-pulse">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty Chat State */
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-emerald-400 shadow-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-white">Ask a question about one of your uploaded documents.</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Type your question below to receive factual answers grounded in your files.
              </p>
            </div>

            {/* Sample Prompts */}
            <div className="max-w-xl mx-auto space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                Suggested Questions
              </span>
              <div className="grid grid-cols-1 gap-2 text-left">
                {samplePrompts.map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(promptText)}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-white transition-all text-left flex items-center justify-between group"
                  >
                    <span>"{promptText}"</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Question Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your uploaded documents..."
          className="w-full pl-5 pr-14 py-4 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none shadow-xl transition-all"
        />
        <button
          type="submit"
          disabled={!question.trim() || askMutation.isPending}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

