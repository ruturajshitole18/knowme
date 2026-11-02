import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../lib/quizService';
import { Quiz } from '../types';
import { useToast } from '../context/ToastContext';
import { copyToClipboard, getQuizUrl } from '../lib/sharing';
import { 
  Sparkles, 
  PlusCircle, 
  Trophy, 
  Users, 
  BarChart3, 
  Share2, 
  Edit3, 
  Copy, 
  Trash2, 
  ExternalLink, 
  HelpCircle,
  Clock,
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { LoadingState } from '../components/LoadingState';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Copied link state indicator
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await quizService.getCreatorQuizzes(user.id);
      setQuizzes(data);
    } catch (err) {
      console.error('Error fetching creator quizzes:', err);
      toastError('Fetch Error', 'Failed to load your quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [user]);

  const handleCopyLink = async (slug: string) => {
    const url = getQuizUrl(slug);
    const copied = await copyToClipboard(url);
    if (copied) {
      setCopiedSlug(slug);
      success('Link Copied!', 'Quiz share link copied to clipboard.');
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const handleDuplicate = async (quizId: string) => {
    try {
      const dup = await quizService.duplicateQuiz(quizId);
      if (dup) {
        success('Quiz Duplicated!', `"${dup.title}" has been created as a draft.`);
        fetchQuizzes();
      }
    } catch (err) {
      toastError('Duplication Failed', 'Could not duplicate quiz.');
    }
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;
    setDeleting(true);
    try {
      await quizService.deleteQuiz(quizToDelete.id);
      success('Quiz Deleted', `"${quizToDelete.title}" and its submissions have been deleted.`);
      setDeleteModalOpen(false);
      setQuizToDelete(null);
      fetchQuizzes();
    } catch (err) {
      toastError('Delete Failed', 'Could not delete quiz.');
    } finally {
      setDeleting(false);
    }
  };

  // Metrics calculations
  const totalQuizzes = quizzes.length;
  const totalAttempts = quizzes.reduce((acc, q) => acc + (q.total_attempts || 0), 0);
  const avgOverallScore = totalQuizzes > 0
    ? Math.round((quizzes.reduce((acc, q) => acc + (q.avg_score || 0), 0) / totalQuizzes) * 10) / 10
    : 0;
  
  // Most popular quiz
  const mostPopular = [...quizzes].sort((a, b) => (b.total_attempts || 0) - (a.total_attempts || 0))[0];

  // Filtered quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    if (filter === 'published') return q.status === 'published';
    if (filter === 'draft') return q.status === 'draft';
    return true;
  });

  if (loading) {
    return <LoadingState message="Loading your creator dashboard..." submessage="Fetching your quizzes and latest scores" />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Creator Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {user?.display_name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track participants, manage questions, and share quizzes with friends.
          </p>
        </div>

        <Link
          to="/create"
          className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Quiz</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Quizzes</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalQuizzes}</p>
          <p className="text-[11px] text-purple-300">Created by you</p>
        </div>

        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Attempts</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-pink-400">{totalAttempts}</p>
          <p className="text-[11px] text-slate-400">Friend submissions</p>
        </div>

        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">{avgOverallScore}</p>
          <p className="text-[11px] text-slate-400">Points per submission</p>
        </div>

        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Most Popular</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-base sm:text-lg font-bold text-white truncate">
            {mostPopular ? mostPopular.title : 'None yet'}
          </p>
          <p className="text-[11px] text-sky-300">
            {mostPopular ? `${mostPopular.total_attempts || 0} attempts` : 'Create a quiz'}
          </p>
        </div>

      </div>

      {/* Quizzes List Header & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Your Quizzes ({filteredQuizzes.length})
          </h2>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('published')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'published'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setFilter('draft')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'draft'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-white/10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">No quizzes found</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                {filter === 'all'
                  ? 'You haven’t created any quizzes yet. Create your very first quiz and invite friends!'
                  : `No quizzes match the "${filter}" filter.`}
              </p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple hover:scale-105 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create My First Quiz</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const isPublished = quiz.status === 'published';
              const hasAttempts = (quiz.total_attempts || 0) > 0;

              return (
                <div
                  key={quiz.id}
                  className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-5 group"
                >
                  {/* Top info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isPublished
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        }`}
                      >
                        {quiz.status}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 opacity-60" />
                        <span>{formatDate(quiz.created_at)}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                      {quiz.title}
                    </h3>

                    {quiz.description && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {quiz.description}
                      </p>
                    )}

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                        <span className="text-slate-400 text-[10px] block">Attempts</span>
                        <span className="font-bold text-white text-sm">{quiz.total_attempts || 0} friends</span>
                      </div>
                      <div className="bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                        <span className="text-slate-400 text-[10px] block">Avg Score</span>
                        <span className="font-bold text-pink-400 text-sm">
                          {hasAttempts ? `${quiz.avg_score} pts` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(quiz.slug)}
                        className="py-2 px-3 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-200 border border-purple-500/30 hover:bg-purple-600/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        {copiedSlug === quiz.slug ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Link</span>
                          </>
                        )}
                      </button>

                      <Link
                        to={`/quiz/${quiz.slug}/leaderboard`}
                        className="py-2 px-3 rounded-lg text-xs font-semibold bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Scores</span>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/analytics/${quiz.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-sky-500/10 transition-colors"
                          title="View Detailed Analytics"
                          aria-label="View Detailed Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/edit/${quiz.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                          title="Edit Quiz"
                          aria-label="Edit Quiz"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(quiz.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                          title="Duplicate Quiz"
                          aria-label="Duplicate Quiz"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/quiz/${quiz.slug}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-pink-300 hover:bg-pink-500/10 transition-colors"
                          title="Play Quiz Preview"
                          aria-label="Play Quiz Preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setQuizToDelete(quiz);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Quiz"
                        aria-label="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && quizToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/30 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Delete "{quizToDelete.title}"?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This action is irreversible. All questions, participant scores, and leaderboard rankings for this quiz will be permanently removed.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 border border-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
