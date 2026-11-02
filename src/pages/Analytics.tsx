import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../lib/quizService';
import { QuizAnalyticsData } from '../types';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  TrendingUp, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Percent
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export const Analytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<QuizAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorNotFound, setErrorNotFound] = useState(false);

  useEffect(() => {
    async function loadAnalytics() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await quizService.getQuizAnalytics(id);
        if (!res) {
          setErrorNotFound(true);
        } else {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setErrorNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [id]);

  if (loading) {
    return <LoadingState message="Analyzing quiz data..." submessage="Calculating question performance and participant scores" />;
  }

  if (errorNotFound || !data) {
    return <ErrorState title="Analytics Not Found" message="Could not find analytics data for this quiz." />;
  }

  const { quiz, total_attempts, unique_participants, avg_score, avg_percentage, highest_score, lowest_score, score_distribution, question_analytics, recent_submissions } = data;

  // Find most missed question (lowest accuracy)
  const sortedByMissed = [...question_analytics].sort((a, b) => a.correct_percentage - b.correct_percentage);
  const mostMissed = total_attempts > 0 ? sortedByMissed[0] : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Analytics: {quiz.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Created by <strong className="text-purple-300">{quiz.creator_name}</strong> • Slug: <span className="font-mono text-xs">{quiz.slug}</span>
          </p>
        </div>

        <Link
          to={`/quiz/${quiz.slug}/leaderboard`}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Public Leaderboard</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider">
            <span>Total Submissions</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{total_attempts}</p>
          <p className="text-[11px] text-purple-300">{unique_participants} unique friends</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-pink-400">
            {avg_score} <span className="text-sm font-normal text-slate-400">/ {quiz.questions?.length || 5}</span>
          </p>
          <p className="text-[11px] text-slate-400">{avg_percentage}% accuracy</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider">
            <span>Highest Score</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">
            {highest_score} <span className="text-sm font-normal text-slate-400">pts</span>
          </p>
          <p className="text-[11px] text-slate-400">Top performance</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider">
            <span>Lowest Score</span>
            <Percent className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-sky-300">
            {lowest_score} <span className="text-sm font-normal text-slate-400">pts</span>
          </p>
          <p className="text-[11px] text-slate-400">Lowest attempt</p>
        </div>

      </div>

      {/* Score Distribution & Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Score Distribution Chart */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Score Distribution</h3>
            </div>
            <span className="text-xs text-slate-400">Percentage Breakdown</span>
          </div>

          <div className="space-y-4">
            {score_distribution.map((bucket) => {
              const pctOfTotal = total_attempts > 0 ? Math.round((bucket.count / total_attempts) * 100) : 0;
              return (
                <div key={bucket.range} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{bucket.range}</span>
                    <span className="text-purple-300 font-mono">
                      {bucket.count} {bucket.count === 1 ? 'player' : 'players'} ({pctOfTotal}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-sky-400 transition-all duration-500 shadow-glow-purple"
                      style={{ width: `${Math.max(pctOfTotal, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Missed Question Highlight */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Trickiest Question</span>
            </div>

            {mostMissed ? (
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white leading-snug">
                  "{mostMissed.question_text}"
                </h4>
                <p className="text-xs text-slate-300">
                  Only <strong className="text-rose-400 text-sm">{mostMissed.correct_percentage}%</strong> of your friends answered this correctly!
                </p>
                {mostMissed.most_common_answer && (
                  <div className="pt-2 text-xs bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Most popular guess:</span>
                    <span className="font-semibold text-purple-200">{mostMissed.most_common_answer}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No attempts yet to calculate tricky questions.</p>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <span className="text-[11px] text-slate-400 leading-tight block">
              💡 Tip: Share your quiz link with more group chats to see richer patterns!
            </span>
          </div>
        </div>

      </div>

      {/* Per-Question Accuracy Breakdown */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Question-by-Question Accuracy</h3>
        </div>

        <div className="space-y-3">
          {question_analytics.map((qa, index) => (
            <div
              key={qa.question_id || index}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-purple-600/30 text-purple-300 text-[10px] font-bold flex items-center justify-center">
                    Q{index + 1}
                  </span>
                  <p className="text-sm font-semibold text-white">{qa.question_text}</p>
                </div>
                <p className="text-xs text-slate-400 pl-7">
                  {qa.correct_count} of {qa.total_responses} friends got this right
                </p>
              </div>

              <div className="w-full sm:w-44 flex-shrink-0 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Success Rate</span>
                  <span className={qa.correct_percentage >= 70 ? 'text-emerald-400' : qa.correct_percentage >= 40 ? 'text-amber-400' : 'text-rose-400'}>
                    {qa.correct_percentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      qa.correct_percentage >= 70
                        ? 'bg-emerald-500'
                        : qa.correct_percentage >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${qa.correct_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participant Submissions Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <span>Participant Breakdown ({recent_submissions.length})</span>
        </h3>

        {recent_submissions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No participants have completed this quiz yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Rank</th>
                  <th className="pb-3 font-semibold">Participant</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Percentage</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent_submissions.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-bold text-slate-300">#{sub.rank || idx + 1}</td>
                    <td className="py-3 font-semibold text-white">
                      {sub.participant_name}
                      {sub.anonymous && <span className="text-[10px] text-slate-400 ml-1.5">(anon)</span>}
                    </td>
                    <td className="py-3 text-purple-300 font-mono font-bold">
                      {sub.score}/{sub.total_questions}
                    </td>
                    <td className="py-3 font-bold text-pink-400">{sub.percentage}%</td>
                    <td className="py-3 text-slate-400 text-xs">{formatDate(sub.submitted_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
