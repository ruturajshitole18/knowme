import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../lib/quizService';
import { PublicQuiz } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionCard } from '../components/QuestionCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useToast } from '../context/ToastContext';
import { 
  Sparkles, 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  HelpCircle,
  Trophy
} from 'lucide-react';

export const TakeQuiz: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [quiz, setQuiz] = useState<PublicQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorNotFound, setErrorNotFound] = useState(false);

  // Participant Onboarding State
  const [hasStarted, setHasStarted] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [nameError, setNameError] = useState('');

  // Player State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { question_id: selected_answer }

  // Submission State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await quizService.getQuizForTaking(slug);
        if (!data) {
          setErrorNotFound(true);
        } else {
          setQuiz(data);
        }
      } catch (err) {
        console.error('Error loading quiz for taking:', err);
        setErrorNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [slug]);

  if (loading) {
    return <LoadingState message="Loading your friend's quiz..." submessage="Preparing questions and choices" />;
  }

  if (errorNotFound || !quiz) {
    return (
      <ErrorState
        title="Quiz Not Found"
        message="This quiz link may be incorrect, unpublished, or has been removed by the creator."
      />
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === quiz.questions.length;

  const handleSelectAnswer = (option: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Trigger confirmation dialog
      setConfirmModalOpen(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStartPlay = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');

    if (!isAnonymous && !participantName.trim()) {
      setNameError('Please enter your name so your friend knows who played!');
      return;
    }

    setHasStarted(true);
  };

  const handleSubmitQuiz = async () => {
    if (!slug) return;
    setIsSubmitting(true);
    try {
      const answersPayload = Object.entries(answers).map(([question_id, selected_answer]) => ({
        question_id,
        selected_answer,
      }));

      const finalName = isAnonymous ? 'Anonymous Friend' : participantName.trim();
      const result = await quizService.submitQuizAnswers(
        quiz.id,
        finalName,
        isAnonymous,
        answersPayload
      );

      // Store in session storage for immediate results view
      sessionStorage.setItem(`quiz_result_${slug}`, JSON.stringify(result));

      success('Quiz Submitted!', `You scored ${result.score}/${result.total_questions}!`);
      navigate(`/quiz/${slug}/results`, { state: { result, quiz } });
    } catch (err: any) {
      console.error('Submission error:', err);
      toastError('Submission Failed', err.message || 'Could not submit your answers. Please try again.');
    } finally {
      setIsSubmitting(false);
      setConfirmModalOpen(false);
    }
  };

  // STEP 1: WELCOME & PARTICIPANT ONBOARDING SCREEN
  if (!hasStarted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-radial-gradient animate-in fade-in zoom-in-95 duration-300">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/15 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Creator Badge */}
          <div className="relative z-10 space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-sky-400 p-0.5 shadow-glow-purple">
              <div className="w-full h-full bg-[#0A071E] rounded-[22px] flex items-center justify-center text-2xl font-black text-white">
                {quiz.creator_name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Official Friendship Challenge
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {quiz.title}
              </h1>
              <p className="text-xs text-purple-300">
                Created by <strong className="text-white">{quiz.creator_name}</strong>
              </p>
            </div>

            {quiz.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/[0.03] p-3.5 rounded-xl border border-white/5">
                "{quiz.description}"
              </p>
            )}
          </div>

          {/* Quiz metadata pills */}
          <div className="flex items-center justify-center gap-3 text-xs text-slate-300 py-1">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              {quiz.total_questions} Questions
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              1 Pt Per Correct
            </span>
          </div>

          {/* Participant Form */}
          <form onSubmit={handleStartPlay} className="space-y-4 pt-2 text-left">
            {!isAnonymous && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Enter Your Name <strong className="text-pink-400">*</strong></span>
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => {
                    setParticipantName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="e.g. Maya or Jordan"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:border-pink-500"
                  autoFocus
                />
                {nameError && (
                  <p className="text-xs text-rose-400 font-medium pl-1">{nameError}</p>
                )}
              </div>
            )}

            {quiz.allow_anonymous && (
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-purple-500 text-pink-500 focus:ring-0"
                />
                <span>Take this quiz anonymously</span>
              </label>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Let's Play!</span>
            </button>
          </form>

        </div>
      </div>
    );
  }

  // STEP 2: QUESTION PLAYER
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Bar with Creator Name & Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
              {quiz.creator_name.charAt(0).toUpperCase()}
            </span>
            <span className="font-semibold text-white">{quiz.creator_name}'s Quiz</span>
          </div>

          <span className="text-xs text-purple-300">
            Playing as: <strong className="text-white">{isAnonymous ? 'Anonymous Friend' : participantName}</strong>
          </span>
        </div>

        {/* Progress bar */}
        <ProgressBar
          current={currentIndex}
          total={quiz.total_questions}
          title={quiz.title}
        />
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id]}
          onSelectAnswer={handleSelectAnswer}
          index={currentIndex}
        />
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {currentIndex === quiz.total_questions - 1 ? (
            <button
              type="button"
              onClick={() => setConfirmModalOpen(true)}
              className="px-7 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Quiz</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SUBMISSION CONFIRMATION DIALOG */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 max-w-md w-full text-center space-y-5 shadow-2xl">
            
            <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-glow-purple">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Submit Your Quiz?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                You have answered <strong>{answeredCount}</strong> of <strong>{quiz.total_questions}</strong> questions.
              </p>
              {!isComplete && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left mt-2 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Warning: You still have {quiz.total_questions - answeredCount} unanswered question(s). Unanswered questions score 0 points.
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                disabled={isSubmitting}
                className="py-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 border border-white/10"
              >
                Keep Reviewing
              </button>

              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Scoring...' : 'Yes, Submit!'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
