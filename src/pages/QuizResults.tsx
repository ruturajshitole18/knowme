import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../lib/quizService';
import { SubmissionResult, PublicQuiz, LeaderboardEntry } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { Leaderboard } from '../components/Leaderboard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Sparkles, Trophy, ArrowRight, PlusCircle } from 'lucide-react';

export const QuizResults: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState<SubmissionResult | null>(
    (location.state as any)?.result || null
  );
  const [quiz, setQuiz] = useState<PublicQuiz | null>(
    (location.state as any)?.quiz || null
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(!result);
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(true);

  // Load result from storage or state
  useEffect(() => {
    async function loadData() {
      if (!slug) return;

      // If result not passed in state, try reading from sessionStorage
      let currentResult = result;
      if (!currentResult) {
        const stored = sessionStorage.getItem(`quiz_result_${slug}`);
        if (stored) {
          try {
            currentResult = JSON.parse(stored);
            setResult(currentResult);
          } catch (e) {
            console.error('Error parsing stored result', e);
          }
        }
      }

      // If quiz metadata not passed, fetch it
      let currentQuiz = quiz;
      if (!currentQuiz) {
        try {
          const q = await quizService.getQuizForTaking(slug);
          if (q) {
            currentQuiz = q;
            setQuiz(q);
          }
        } catch (e) {
          console.error('Error fetching quiz info', e);
        }
      }

      setLoading(false);

      // Fetch leaderboard
      if (currentQuiz) {
        setLeaderboardLoading(true);
        try {
          const lb = await quizService.getLeaderboard(currentQuiz.id);
          setLeaderboard(lb);
        } catch (err) {
          console.error('Error loading leaderboard:', err);
        } finally {
          setLeaderboardLoading(false);
        }
      }
    }

    loadData();
  }, [slug]);

  const refreshLeaderboard = async () => {
    if (!quiz) return;
    setLeaderboardLoading(true);
    try {
      const lb = await quizService.getLeaderboard(quiz.id);
      setLeaderboard(lb);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const handleRetake = () => {
    if (!slug) return;
    sessionStorage.removeItem(`quiz_result_${slug}`);
    navigate(`/quiz/${slug}`);
  };

  if (loading) {
    return <LoadingState message="Calculating your final score..." submessage="Checking answers and updating leaderboard" />;
  }

  if (!result || !quiz) {
    return (
      <ErrorState
        title="Result Not Found"
        message="Could not find your quiz submission result. You can take the quiz to get a score!"
        onRetry={() => navigate(`/quiz/${slug}`)}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      
      {/* Score Card Section */}
      <ScoreCard
        result={result}
        creatorName={quiz.creator_name}
        slug={quiz.slug}
        allowRetake={quiz.allow_retake}
        onRetake={handleRetake}
      />

      {/* Leaderboard Section */}
      <div className="space-y-4">
        <Leaderboard
          entries={leaderboard}
          highlightSubmissionId={result.id}
          onRefresh={refreshLeaderboard}
          isLoading={leaderboardLoading}
          isPrivate={quiz.leaderboard_visibility === 'creator_only'}
        />
      </div>

      {/* CTA: Create your own quiz banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 text-center relative overflow-hidden shadow-2xl space-y-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-pink-600/15 to-sky-600/15 pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
            Now It's Your Turn!
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Want to see how well {quiz.creator_name} knows YOU?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Create your own personal KnowMe quiz in 2 minutes and send it right back to challenge them!
          </p>
          <div className="pt-2">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-105 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create My Own Quiz</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
