import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../lib/quizService';
import { Question, QuestionType, QuizTheme, QuizVisibility, LeaderboardVisibility } from '../types';
import { SAMPLE_QUESTIONS, SampleQuestionItem } from '../lib/sampleQuestions';
import { generateSlug } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import { getQuizUrl, copyToClipboard, getWhatsAppShareUrl } from '../lib/sharing';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  BookOpen, 
  Eye, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Palette, 
  Settings2,
  Copy,
  ExternalLink,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

interface QuestionDraft {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string;
}

const DEFAULT_THEMES: Array<{ id: QuizTheme; name: string; bgClass: string; accentClass: string }> = [
  { id: 'midnight-violet', name: 'Midnight Violet', bgClass: 'from-purple-900 to-indigo-950', accentClass: 'border-purple-500' },
  { id: 'cyber-pink', name: 'Cyber Pink', bgClass: 'from-pink-900 to-purple-950', accentClass: 'border-pink-500' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', bgClass: 'from-blue-900 to-teal-950', accentClass: 'border-sky-500' },
  { id: 'sunset-glow', name: 'Sunset Glow', bgClass: 'from-amber-900 to-rose-950', accentClass: 'border-amber-500' },
  { id: 'emerald-night', name: 'Emerald Night', bgClass: 'from-emerald-900 to-slate-950', accentClass: 'border-emerald-500' },
];

export const CreateQuiz: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Basic Setup State
  const [creatorName, setCreatorName] = useState(user?.display_name || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState<QuizTheme>('midnight-violet');
  const [visibility, setVisibility] = useState<QuizVisibility>('public');
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [allowRetake, setAllowRetake] = useState(true);
  const [showAnswers, setShowAnswers] = useState(true);
  const [leaderboardVis, setLeaderboardVis] = useState<LeaderboardVisibility>('public');

  // Questions State (seed with 5 starter questions so user easily meets the 5-question threshold!)
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      id: 'init-1',
      question_text: 'What is my absolute favourite food?',
      question_type: 'multiple_choice',
      options: ['Pizza', 'Burgers', 'Sushi', 'Biryani'],
      correct_answer: 'Pizza',
    },
    {
      id: 'init-2',
      question_text: 'Which city would I love to visit next?',
      question_type: 'multiple_choice',
      options: ['Tokyo, Japan', 'Paris, France', 'New York City, USA', 'Reykjavik, Iceland'],
      correct_answer: 'Tokyo, Japan',
    },
    {
      id: 'init-3',
      question_text: 'Am I a morning person or a night owl?',
      question_type: 'true_false',
      options: ['Morning Person', 'Night Owl'],
      correct_answer: 'Night Owl',
    },
    {
      id: 'init-4',
      question_text: 'What is my biggest irrational fear?',
      question_type: 'multiple_choice',
      options: ['Spiders / Insects', 'Heights / Flying', 'FOMO & Being alone', 'Public Speaking'],
      correct_answer: 'Heights / Flying',
    },
    {
      id: 'init-5',
      question_text: 'What is my favourite hobby to relax?',
      question_type: 'multiple_choice',
      options: ['Gaming until late', 'Binge-watching shows', 'Cooking / Baking', 'Listening to music'],
      correct_answer: 'Gaming until late',
    },
  ]);

  // Drawer / Modals
  const [sampleDrawerOpen, setSampleDrawerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewActiveIdx, setPreviewActiveIdx] = useState(0);

  // Submitting & Publish Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [publishedTitle, setPublishedTitle] = useState<string>('');

  // Add Question
  const handleAddQuestion = (type: QuestionType = 'multiple_choice') => {
    if (questions.length >= 30) {
      toastError('Limit Reached', 'A quiz can have at most 30 questions.');
      return;
    }
    const newDraft: QuestionDraft = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      question_text: '',
      question_type: type,
      options: type === 'true_false' ? ['True', 'False'] : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correct_answer: type === 'true_false' ? 'True' : 'Option 1',
    };
    setQuestions([...questions, newDraft]);
  };

  // Add from Sample Library
  const handleAddSample = (sample: SampleQuestionItem) => {
    if (questions.length >= 30) {
      toastError('Limit Reached', 'Maximum 30 questions reached.');
      return;
    }
    const newDraft: QuestionDraft = {
      id: `sample-${Date.now()}-${sample.id}`,
      question_text: sample.question_text,
      question_type: sample.question_type,
      options: [...sample.options],
      correct_answer: sample.default_correct_answer,
    };
    setQuestions([...questions, newDraft]);
    success('Question Added!', `"${sample.question_text}" added to your quiz.`);
  };

  // Question editing
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

    // If this was the correct answer, update the correct_answer string too
    if (updated[qIndex].correct_answer === prevOption) {
      updated[qIndex].correct_answer = text;
    }
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length >= 6) {
      toastError('Limit', 'Maximum 6 choices per question allowed.');
      return;
    }
    const nextNum = updated[qIndex].options.length + 1;
    updated[qIndex].options.push(`Choice ${nextNum}`);
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) {
      toastError('Minimum choices', 'Each question must have at least 2 choices.');
      return;
    }
    const removedOption = updated[qIndex].options[optIndex];
    updated[qIndex].options.splice(optIndex, 1);

    // If correct answer was removed, pick first remaining
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
    if (questions.length <= 1) {
      toastError('Cannot Delete', 'You must have at least 1 question.');
      return;
    }
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === questions.length - 1)) {
      return;
    }
    const updated = [...questions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(updated);
  };

  // Validation before publishing
  const validateQuiz = (): string | null => {
    if (!creatorName.trim()) return 'Please enter your display name.';
    if (!title.trim()) return 'Please enter a quiz title.';
    if (questions.length < 5) {
      return `A quiz must have at least 5 questions before publishing (currently has ${questions.length}).`;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        return `Question ${i + 1} is empty. Please enter question text.`;
      }
      if (q.question_type === 'short_answer') {
        if (!q.correct_answer.trim()) {
          return `Please enter your expected answer or key phrase for Question ${i + 1}.`;
        }
      } else {
        if (q.options.length < 2) {
          return `Question ${i + 1} needs at least 2 answer choices.`;
        }
        // Check duplicate options
        const optSet = new Set(q.options.map((o) => o.trim().toLowerCase()));
        if (optSet.size !== q.options.length) {
          return `Question ${i + 1} has duplicate answer choices. All options must be unique.`;
        }
        if (!q.correct_answer || !q.options.includes(q.correct_answer)) {
          return `Please select the correct answer for Question ${i + 1}.`;
        }
      }
    }

    return null;
  };

  // Publish Quiz
  const handlePublish = async (status: 'published' | 'draft' = 'published') => {
    const validationError = validateQuiz();
    if (validationError) {
      toastError('Validation Error', validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = generateSlug(creatorName || 'quiz');
      const saved = await quizService.saveQuiz(
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
        }))
      );

      if (saved) {
        setPublishedSlug(saved.slug);
        setPublishedTitle(saved.title);
        success('Quiz Published!', 'Your quiz is live and ready to share!');
      }
    } catch (err: any) {
      console.error('Publish error:', err);
      toastError('Publish Failed', err.message || 'Could not publish quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS PUBLISH SCREEN
  if (publishedSlug) {
    const fullUrl = getQuizUrl(publishedSlug);

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-radial-gradient animate-in fade-in zoom-in-95 duration-300">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/15 max-w-xl w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-sky-400 p-0.5 shadow-glow-purple">
            <div className="w-full h-full bg-[#0A071E] rounded-[22px] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Your Quiz is Live! 🎉
            </h2>
            <p className="text-sm text-slate-300">
              "{publishedTitle}" has been generated. Share this unique link with friends to see who knows you best!
            </p>
          </div>

          {/* Shareable Link Box */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="truncate w-full sm:w-auto font-mono text-xs text-purple-300 select-all">
              {fullUrl}
            </div>
            <button
              type="button"
              onClick={async () => {
                const res = await copyToClipboard(fullUrl);
                if (res) success('Copied!', 'Link copied to clipboard.');
              }}
              className="w-full sm:w-auto flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
          </div>

          {/* Direct Share Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const url = getWhatsAppShareUrl(creatorName, publishedSlug);
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="w-full py-3.5 rounded-xl font-bold text-xs bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <Link
              to={`/quiz/${publishedSlug}`}
              className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test Play Quiz</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Creator Dashboard</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Create Your Quiz
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build personal questions, mark your real answers, and challenge your friends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-pink-400" />
            <span>Preview Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => handlePublish('published')}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing...' : 'Publish Quiz'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: Quiz Configuration Setup */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <Settings2 className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Quiz Details & Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Creator Display Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Your Display Name <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g. Ruturaj"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:border-pink-500"
            />
            <p className="text-[11px] text-slate-400">This will be shown on the quiz header and share links.</p>
          </div>

          {/* Quiz Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Quiz Title <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How Well Do You Really Know Ruturaj?"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:border-pink-500"
            />
          </div>

          {/* Optional Description */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Short Description / Welcome Message (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Take this quiz to find out if we are best friend material! Only 5 questions."
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:border-pink-500 resize-none"
            />
          </div>

          {/* Quiz Theme Selection */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-400" />
              Quiz Theme & Aesthetic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {DEFAULT_THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-500/10 shadow-glow-pink ring-1 ring-pink-500/40 text-white'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className={`w-full h-4 rounded-md bg-gradient-to-r ${t.bgClass}`} />
                    <span className="truncate">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy & Rules Toggles */}
          <div className="md:col-span-2 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={(e) => setShowAnswers(e.target.checked)}
                className="w-4 h-4 rounded border-purple-500 text-pink-500 focus:ring-0"
              />
              <span className="text-xs font-medium text-slate-200">
                Reveal correct answers after submitting
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <input
                type="checkbox"
                checked={allowAnonymous}
                onChange={(e) => setAllowAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-purple-500 text-pink-500 focus:ring-0"
              />
              <span className="text-xs font-medium text-slate-200">
                Allow anonymous participants
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <input
                type="checkbox"
                checked={allowRetake}
                onChange={(e) => setAllowRetake(e.target.checked)}
                className="w-4 h-4 rounded border-purple-500 text-pink-500 focus:ring-0"
              />
              <span className="text-xs font-medium text-slate-200">
                Allow friends to retry quiz
              </span>
            </label>

          </div>

        </div>
      </div>

      {/* Section 2: Questions Builder */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Questions</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {questions.length} / 30
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Minimum 5 questions required to publish. Click on any answer to mark it as the correct one!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSampleDrawerOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-200 border border-purple-500/30 hover:bg-purple-600/30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Sample Question Library</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddQuestion('multiple_choice')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all space-y-5 relative"
            >
              {/* Question card bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-xs text-white">
                    {qIdx + 1}
                  </span>

                  {/* Question Type selector */}
                  <select
                    value={q.question_type}
                    onChange={(e) => updateQuestionType(qIdx, e.target.value as QuestionType)}
                    className="glass-input text-xs font-semibold rounded-lg px-2.5 py-1 text-purple-200 cursor-pointer"
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Question Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveQuestion(qIdx, 'down')}
                    disabled={qIdx === questions.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Question Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors ml-1"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Question Prompt</label>
                <input
                  type="text"
                  value={q.question_text}
                  onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                  placeholder="e.g. What is my biggest secret dream?"
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-medium focus:border-pink-500"
                />
              </div>

              {/* Options or Short Answer Input */}
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Answer Options <span className="text-[11px] font-normal text-purple-300">(Click radio circle to mark your real answer)</span>
                    </label>
                    {q.question_type === 'multiple_choice' && q.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => addOption(qIdx)}
                        className="text-[11px] font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Choice
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correct_answer === opt;
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/30'
                              : 'bg-white/[0.03] border-white/10'
                          }`}
                        >
                          {/* Radio button to mark correct */}
                          <button
                            type="button"
                            onClick={() => setCorrectAnswer(qIdx, opt)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              isCorrect
                                ? 'bg-emerald-500 text-white'
                                : 'border border-white/20 hover:border-emerald-400 text-transparent'
                            }`}
                            title="Mark as correct answer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          {/* Input or Fixed True/False text */}
                          {q.question_type === 'true_false' ? (
                            <span className="text-sm font-semibold text-white px-2 py-1 flex-1">
                              {opt}
                            </span>
                          ) : (
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                              placeholder={`Choice ${optIdx + 1}`}
                              className="bg-transparent text-sm text-white px-2 py-1 flex-1 focus:outline-none"
                            />
                          )}

                          {/* Remove option button */}
                          {q.question_type === 'multiple_choice' && q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIdx, optIdx)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded"
                              title="Remove choice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Action Footer */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <p className="font-semibold text-white">Ready to publish?</p>
            <p>{questions.length} questions configured • {questions.length >= 5 ? 'Meets 5 question requirement' : 'Add at least 5 questions'}</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleAddQuestion('multiple_choice')}
              className="w-1/2 sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>

            <button
              type="button"
              onClick={() => handlePublish('published')}
              disabled={isSubmitting}
              className="w-1/2 sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Quiz'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* SAMPLE QUESTION DRAWER MODAL */}
      {sampleDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Sample Questions Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setSampleDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Click "+ Add" on any question to instantly insert it into your quiz!
            </p>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {SAMPLE_QUESTIONS.map((sq) => (
                <div
                  key={sq.id}
                  className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 hover:border-purple-400/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                      {sq.category}
                    </span>
                    <p className="text-sm font-semibold text-white">{sq.question_text}</p>
                    <p className="text-xs text-slate-400">
                      Options: {sq.options.join(', ')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSample(sq)}
                    className="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 text-right">
              <button
                type="button"
                onClick={() => setSampleDrawerOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/10 hover:bg-white/15"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ PREVIEW MODAL */}
      {previewOpen && questions.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Participant Preview (Question {previewActiveIdx + 1} of {questions.length})
              </span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                {questions[previewActiveIdx].question_text || '(Empty Question)'}
              </h3>

              {questions[previewActiveIdx].question_type === 'short_answer' ? (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-400 italic">
                  [Participants will see a text box to type their 1–2 line answer here]
                </div>
              ) : (
                <div className="space-y-2">
                  {questions[previewActiveIdx].options.map((opt, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm font-medium text-slate-200"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPreviewActiveIdx(Math.max(0, previewActiveIdx - 1))}
                disabled={previewActiveIdx === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white disabled:opacity-30"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => setPreviewActiveIdx(Math.min(questions.length - 1, previewActiveIdx + 1))}
                disabled={previewActiveIdx === questions.length - 1}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-30"
              >
                Next Question
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
