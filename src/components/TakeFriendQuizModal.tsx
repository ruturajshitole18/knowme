import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Sparkles, Play, ArrowRight } from 'lucide-react';

interface TakeFriendQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TakeFriendQuizModal: React.FC<TakeFriendQuizModalProps> = ({ isOpen, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a quiz link or slug');
      return;
    }

    // Extract slug from URL if full URL was pasted
    let slug = trimmed;
    if (slug.includes('/quiz/')) {
      slug = slug.split('/quiz/')[1].split('?')[0].split('#')[0];
    } else if (slug.startsWith('http')) {
      const parts = slug.split('/');
      slug = parts[parts.length - 1];
    }

    slug = slug.replace(/[^a-zA-Z0-9-_]/g, '');

    if (!slug) {
      setErrorMsg('Invalid quiz link format');
      return;
    }

    onClose();
    navigate(`/quiz/${slug}`);
  };

  const handlePlayFeatured = (slug: string) => {
    onClose();
    navigate(`/quiz/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 max-w-lg w-full shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white mb-3 shadow-glow-purple">
            <Play className="w-5 h-5 fill-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Take a Friend's Quiz
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter the share link or code your friend sent you to begin playing.
          </p>
        </div>

        {/* Link / Slug Form */}
        <form onSubmit={handleLaunch} className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Paste quiz link (e.g. knowme.app/quiz/alex-super-quiz-2026)"
              className="w-full glass-input rounded-xl pl-12 pr-4 py-3.5 text-sm placeholder:text-slate-500 focus:border-pink-500"
              autoFocus
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 font-medium pl-1">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Start Friend's Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Demo Quizzes */}
        <div className="pt-3 border-t border-white/10 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Or try a featured challenge:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handlePlayFeatured('alex-super-quiz-2026')}
              className="p-3 text-left rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                  Alex's Quiz
                </p>
                <p className="text-[10px] text-slate-400">6 questions • Secrets</p>
              </div>
              <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-400 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => handlePlayFeatured('sarah-vibe-check-99')}
              className="p-3 text-left rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                  Sarah's Vibe Check
                </p>
                <p className="text-[10px] text-slate-400">5 questions • Vibe check</p>
              </div>
              <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
