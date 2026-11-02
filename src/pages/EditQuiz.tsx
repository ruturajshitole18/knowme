import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../lib/quizService';
import { QuestionType, QuizTheme, QuizVisibility, LeaderboardVisibility } from '../types';
import { SAMPLE_QUESTIONS, SampleQuestionItem } from '../lib/sampleQuestions';
import { useToast } from '../context/ToastContext';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  BookOpen, 
  Save, 
  CheckCircle2, 
  Palette, 
  Settings2,
  ArrowLeft
} from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

interface QuestionDraft {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string;
}

const DEFAULT_THEMES: Array<{ id: QuizTheme; name: string; bgClass: string }> = [
  { id: 'midnight-violet', name: 'Midnight Violet', bgClass: 'from-purple-900 to-indigo-950' },
  { id: 'cyber-pink', name: 'Cyber Pink', bgClass: 'from-pink-900 to-purple-950' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', bgClass: 'from-blue-900 to-teal-950' },
  { id: 'sunset-glow', name: 'Sunset Glow', bgClass: 'from-amber-900 to-rose-950' },
  { id: 'emerald-night', name: 'Emerald Night', bgClass: 'from-emerald-900 to-slate-950' },
];

export const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorNotFound, setErrorNotFound] = useState(false);

  // Form states
  const [creatorName, setCreatorName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [theme, setTheme] = useState<QuizTheme>('midnight-violet');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [visibility, setVisibility] = useState<QuizVisibility>('public');
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [allowRetake, setAllowRetake] = useState(true);
  const [showAnswers, setShowAnswers] = useState(true);
  const [leaderboardVis, setLeaderboardVis] = useState<LeaderboardVisibility>('public');

  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [sampleDrawerOpen, setSampleDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      if (!id) return;
      setLoading(true);
      try {
        const quiz = await quizService.getQuizById(id);
        if (!quiz) {
          setErrorNotFound(true);
          return;
        }

        setCreatorName(quiz.creator_name);
        setTitle(quiz.title);
        setDescription(quiz.description || '');
        setSlug(quiz.slug);
        setTheme(quiz.theme);
        setStatus(quiz.status);
        setVisibility(quiz.visibility);
        setAllowAnonymous(quiz.allow_anonymous);
        setAllowRetake(quiz.allow_retake);
        setShowAnswers(quiz.show_answers_after_submission);
        setLeaderboardVis(quiz.leaderboard_visibility);

        if (quiz.questions && quiz.questions.length > 0) {
          setQuestions(
            quiz.questions.map((q) => ({
              id: q.id,
              question_text: q.question_text,
              question_type: q.question_type,
              options: [...q.options],
              correct_answer: q.correct_answer,
            }))
          );
        }
      } catch (err) {
        console.error('Error loading quiz for edit:', err);
        setErrorNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [id]);

  const handleAddQuestion = (type: QuestionType = 'multiple_choice') => {
    if (questions.length >= 30) {
      toastError('Limit Reached', 'A quiz can have at most 30 questions.');
      return;
    }
    setQuestions([
      ...questions,
      {
        id: `custom-${Date.now()}`,
        question_text: '',
        question_type: type,
        options: type === 'true_false' ? ['True', 'False'] : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correct_answer: type === 'true_false' ? 'True' : 'Option 1',
      },
    ]);
  };

  const handleAddSample = (sample: SampleQuestionItem) => {
    if (questions.length >= 30) return;
    setQuestions([
      ...questions,
      {
        id: `sample-${Date.now()}-${sample.id}`,
        question_text: sample.question_text,
        question_type: sample.question_type,
        options: [...sample.options],
        correct_answer: sample.default_correct_answer,
      },
    ]);
    success('Question Added!', `"${sample.question_text}" added.`);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].question_text = text;
    setQuestions(updated);
  };

  const updateQuestionType = (index: number, type: QuestionType) => {
    const updated = [...questions];
    updated[index].question_type = type;
    if (type === 'true_false') {
      updated[index].options = ['True', 'False'];
      updated[index].correct_answer = 'True';
    } else if (type === 'short_answer') {
      updated[index].options = [];
      if (!updated[index].correct_answer) {
        updated[index].correct_answer = '';
      }
    } else if (updated[index].options.length < 2) {
      updated[index].options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
      updated[index].correct_answer = 'Option 1';
    }
    setQuestions(updated);
  };

  const updateOptionText = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    const prevOption = updated[qIndex].options[optIndex];
    updated[qIndex].options[optIndex] = text;
    if (updated[qIndex].correct_answer === prevOption) {
      updated[qIndex].correct_answer = text;
    }
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length >= 6) return;
    updated[qIndex].options.push(`Choice ${updated[qIndex].options.length + 1}`);
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) return;
    const removedOption = updated[qIndex].options[optIndex];
    updated[qIndex].options.splice(optIndex, 1);
    if (updated[qIndex].correct_answer === removedOption) {
      updated[qIndex].correct_answer = updated[qIndex].options[0];
    }
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex: number, option: string) => {
    const updated = [...questions];
    updated[qIndex].correct_answer = option;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === questions.length - 1)) return;
    const updated = [...questions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (!creatorName.trim()) {
      toastError('Validation', 'Please enter your display name.');
      return;
    }
    if (!title.trim()) {
      toastError('Validation', 'Please enter a quiz title.');
      return;
    }
    if (questions.length < 5) {
      toastError('Validation', 'Quiz must have at least 5 questions.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        toastError('Validation', `Question ${i + 1} is empty.`);
        return;
      }
      if (q.question_type === 'short_answer') {
        if (!q.correct_answer.trim()) {
          toastError('Validation', `Please enter your expected answer for Question ${i + 1}.`);
          return;
        }
      } else {
        if (q.options.length < 2) {
          toastError('Validation', `Question ${i + 1} needs at least 2 choices.`);
          return;
        }
        if (!q.correct_answer || !q.options.includes(q.correct_answer)) {
          toastError('Validation', `Please select the correct answer for Question ${i + 1}.`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      await quizService.saveQuiz(
        {
          owner_id: user?.id || 'local-user-id',
          creator_name: creatorName.trim(),
          title: title.trim(),
          description: description.trim() || null,
          slug,
          theme,
          status,
          visibility,
          allow_anonymous: allowAnonymous,
          allow_retake: allowRetake,
          show_answers_after_submission: showAnswers,
          leaderboard_visibility: leaderboardVis,
        },
        questions.map((q, idx) => ({
          question_text: q.question_text.trim(),
          question_type: q.question_type,
          options: q.options.map((o) => o.trim()),
          correct_answer: q.correct_answer.trim(),
          position: idx,
        })),
        id
      );

      success('Quiz Updated!', 'Your changes have been saved.');
      navigate('/dashboard');
    } catch (err: any) {
      toastError('Save Error', err.message || 'Failed to update quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading quiz for editing..." />;
  }

  if (errorNotFound) {
    return <ErrorState title="Quiz Not Found" message="Could not find the quiz you are trying to edit." />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Edit Quiz
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Quiz Details Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <Settings2 className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Quiz Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Display Name</label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:border-pink-500"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:border-pink-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Question Editor List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Questions ({questions.length})
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSampleDrawerOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-200 border border-purple-500/30 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Library</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('multiple_choice')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div key={q.id} className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-xs text-white">
                    {qIdx + 1}
                  </span>
                  <select
                    value={q.question_type}
                    onChange={(e) => updateQuestionType(qIdx, e.target.value as QuestionType)}
                    className="glass-input text-xs font-semibold rounded-lg px-2 py-0.5 text-purple-200 cursor-pointer"
                  >
                    <option value="multiple_choice" className="bg-[#140F35]">Multiple Choice</option>
                    <option value="true_false" className="bg-[#140F35]">True / False</option>
                    <option value="short_answer" className="bg-[#140F35]">Short Answer (1–2 lines, no options)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveQuestion(qIdx, 'up')}
                    disabled={qIdx === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveQuestion(qIdx, 'down')}
                    disabled={qIdx === questions.length - 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    className="p-1 text-slate-400 hover:text-rose-400 ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={q.question_text}
                onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                placeholder="Question text"
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-medium"
              />

              {q.question_type === 'short_answer' ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Your Expected Answer / Key Words <span className="text-pink-400">*</span>
                    </label>
                    <span className="text-[11px] text-purple-300">Friends type their own 1–2 line answer!</span>
                  </div>
                  <textarea
                    rows={2}
                    value={q.correct_answer}
                    onChange={(e) => setCorrectAnswer(qIdx, e.target.value)}
                    placeholder="e.g. Pizza with extra cheese, or Tokyo Japan, or Kind and funny"
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500 resize-none"
                  />
                  <p className="text-[11px] text-slate-400">
                    💡 No multiple-choice options are shown to friends for this question. They will answer in their own words!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correct_answer === opt;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl border ${
                          isCorrect ? 'bg-emerald-950/20 border-emerald-500/60' : 'bg-white/[0.03] border-white/10'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(qIdx, opt)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isCorrect ? 'bg-emerald-500 text-white' : 'border border-white/20'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                          className="bg-transparent text-sm text-white px-2 py-1 flex-1 focus:outline-none"
                        />

                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIdx, optIdx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="pt-6 border-t border-white/10 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple hover:scale-[1.02] transition-all"
        >
          {isSubmitting ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

    </div>
  );
};
