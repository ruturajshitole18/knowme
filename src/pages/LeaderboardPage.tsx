import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../lib/quizService';
import { PublicQuiz, LeaderboardEntry } from '../types';
import { Leaderboard } from '../components/Leaderboard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Trophy, Play, Share2, Sparkles, ArrowLeft, Copy, Check } from 'lucide-react';
import { copyToClipboard, getQuizUrl, getWhatsAppShareUrl } from '../lib/sharing';
import { useToast } from '../context/ToastContext';

export const LeaderboardPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { success } = useToast();

  const [quiz, setQuiz] = useState<PublicQuiz | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorNotFound, setErrorNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const q = await quizService.getQuizForTaking(slug);
      if (!q) {
        setErrorNotFound(true);
        return;
      }
      setQuiz(q);
      const lb = await quizService.getLeaderboard(q.id);
      setEntries(lb);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setErrorNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleCopy = async () => {
    if (!slug) return;
    const url = getQuizUrl(slug);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      success('Link Copied!', 'Quiz link copied to clipboard.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return <LoadingState message="Loading leaderboard..." submessage="Fetching top friend rankings" />;
  }

  if (errorNotFound || !quiz) {
    return <ErrorState title="Leaderboard Not Found" message="Could not find the quiz for this leaderboard." />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <Link
            to={`/quiz/${quiz.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Quiz</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{quiz.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official Leaderboard • Created by <strong className="text-purple-300">{quiz.creator_name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <Link
            to={`/quiz/${quiz.slug}`}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Play Quiz</span>
          </Link>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <Leaderboard
        entries={entries}
        onRefresh={fetchData}
        isPrivate={quiz.leaderboard_visibility === 'creator_only'}
      />

    </div>
  );
};
