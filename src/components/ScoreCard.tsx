import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SubmissionResult } from '../types';
import { Trophy, Share2, RefreshCw, Eye, EyeOff, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { shareQuizResult, getWhatsAppShareUrl } from '../lib/sharing';
import { useToast } from '../context/ToastContext';

interface ScoreCardProps {
  result: SubmissionResult;
  creatorName: string;
  slug: string;
  allowRetake: boolean;
  onRetake: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  result,
  creatorName,
  slug,
  allowRetake,
  onRetake,
}) => {
  const { success, error } = useToast();
  const [showReview, setShowReview] = React.useState(false);

  // Trigger celebratory confetti on high scores
  useEffect(() => {
    if (result.percentage >= 70) {
      confetti({
        particleCount: result.percentage === 100 ? 150 : 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#EC4899', '#38BDF8', '#FBBF24'],
      });
    }
  }, [result.percentage]);

  const handleShare = async () => {
    const res = await shareQuizResult(creatorName, result.score, result.total_questions, slug);
    if (res.success) {
      if (res.method === 'clipboard') {
        success('Result Copied!', 'Quiz score copied to clipboard. Share it with your friends!');
      }
    } else {
      error('Share Failed', 'Could not open share menu.');
    }
  };

  const handleWhatsAppShare = () => {
    const url = getWhatsAppShareUrl(creatorName, slug);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const canReview = result.review && result.review.length > 0 && result.review.some((r) => r.correct_answer !== null && r.correct_answer !== undefined);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Main Score Glass Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden text-center">
        
        {/* Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge & Participant Name */}
        <div className="relative z-10 space-y-2">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600/30 via-pink-500/30 to-sky-400/20 border border-white/15 flex items-center justify-center text-4xl shadow-glow-purple">
            {result.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">
            {result.participant_name}
          </h2>
          <p className="text-sm text-purple-300 font-medium">
            tested on <strong className="text-pink-300">{creatorName}</strong>'s KnowMe Quiz
          </p>
        </div>

        {/* Score Ring / Visual Number */}
        <div className="relative z-10 my-8 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Circular score display */}
            <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 border-white/10 flex flex-col items-center justify-center bg-gradient-to-b from-[#18123D]/90 to-[#0F0B29]/90 shadow-2xl">
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">
                {result.score}/{result.total_questions}
              </span>
              <span className="text-base sm:text-lg font-bold text-pink-400 mt-1">
                {result.percentage}%
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-1 max-w-md">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {result.percentage >= 90 ? "Best Friend Material!" :
               result.percentage >= 70 ? "Pretty Close!" :
               result.percentage >= 50 ? "Not Bad!" :
               result.percentage >= 30 ? "Just Acquaintances?" : "Do You Even Know This Person?"}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {result.message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share My Score</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-sm bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Challenge Friends</span>
          </button>

          {allowRetake && (
            <button
              type="button"
              onClick={onRetake}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          )}
        </div>

        {/* Answer Review Toggle (if enabled by creator) */}
        {canReview && (
          <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowReview(!showReview)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-pink-300 transition-colors"
            >
              {showReview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showReview ? 'Hide Answer Review' : 'Review Correct Answers'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Detailed Answer Review Breakdown */}
      {showReview && result.review && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Question Breakdown
          </h4>

          <div className="space-y-3">
            {result.review.map((item, idx) => (
              <div
                key={item.question_id || idx}
                className={`p-4 rounded-xl border transition-all ${
                  item.is_correct
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Question {idx + 1}
                    </p>
                    <p className="text-sm font-medium text-white">{item.question_text}</p>
                    <div className="text-xs pt-1 space-y-0.5">
                      <p className="text-slate-300">
                        Your answer: <strong className={item.is_correct ? 'text-emerald-300' : 'text-rose-300'}>{item.selected_answer || '(No answer)'}</strong>
                      </p>
                      {item.correct_answer && (
                        <p className="text-emerald-300">
                          Correct answer: <strong>{item.correct_answer}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 mt-1">
                    {item.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
