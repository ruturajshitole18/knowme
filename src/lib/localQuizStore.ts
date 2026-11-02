import { 
  Quiz, 
  Question, 
  PublicQuiz, 
  SubmissionResult, 
  LeaderboardEntry, 
  QuizAnalyticsData,
  QuestionAnalytics,
  Profile 
} from '../types';
import { getScoreMessage } from './utils';

const STORAGE_KEY_QUIZZES = 'knowme_quizzes';
const STORAGE_KEY_QUESTIONS = 'knowme_questions';
const STORAGE_KEY_SUBMISSIONS = 'knowme_submissions';
const STORAGE_KEY_SUBMISSION_ANSWERS = 'knowme_submission_answers';
const STORAGE_KEY_PROFILES = 'knowme_profiles';
const STORAGE_KEY_CURRENT_USER = 'knowme_current_user';

// Initial seed data so the app has live, playable quizzes on first launch
const INITIAL_PROFILES: Profile[] = [
  {
    id: 'user-seed-1',
    display_name: 'Alex Chen',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'user-seed-2',
    display_name: 'Sarah Jenkins',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  }
];

const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-alex-01',
    owner_id: 'user-seed-1',
    creator_name: 'Alex Chen',
    title: 'How Well Do You Really Know Alex?',
    description: 'Think you know my deepest secrets, weird habits, and dream destinations? Let’s see who is in my inner circle!',
    slug: 'alex-super-quiz-2026',
    theme: 'midnight-violet',
    status: 'published',
    visibility: 'public',
    allow_anonymous: true,
    allow_retake: true,
    show_answers_after_submission: true,
    leaderboard_visibility: 'public',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'quiz-sarah-02',
    owner_id: 'user-seed-2',
    creator_name: 'Sarah Jenkins',
    title: 'Sarah’s Ultimate Vibe & Friendship Check',
    description: 'Only real ones will get more than 70%. Take the test and prove we are actual best friends!',
    slug: 'sarah-vibe-check-99',
    theme: 'cyber-pink',
    status: 'published',
    visibility: 'public',
    allow_anonymous: false,
    allow_retake: false,
    show_answers_after_submission: true,
    leaderboard_visibility: 'public',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];

const INITIAL_QUESTIONS: Question[] = [
  // Alex questions
  {
    id: 'q-alex-1',
    quiz_id: 'quiz-alex-01',
    question_text: 'What is my absolute favourite food to order on a Friday night?',
    question_type: 'multiple_choice',
    options: ['Wood-fired Margherita Pizza', 'Spicy Salmon Sushi', 'Double Bacon Cheeseburger', 'Chicken Tikka Biryani'],
    correct_answer: 'Spicy Salmon Sushi',
    position: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-alex-2',
    quiz_id: 'quiz-alex-01',
    question_text: 'Which city have I been dying to visit next?',
    question_type: 'multiple_choice',
    options: ['Tokyo, Japan', 'Reykjavik, Iceland', 'Cape Town, South Africa', 'Rome, Italy'],
    correct_answer: 'Tokyo, Japan',
    position: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-alex-3',
    quiz_id: 'quiz-alex-01',
    question_text: 'Am I a morning person or a midnight owl?',
    question_type: 'true_false',
    options: ['Morning Person', 'Midnight Owl'],
    correct_answer: 'Midnight Owl',
    position: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-alex-4',
    quiz_id: 'quiz-alex-01',
    question_text: 'What is my biggest irrational fear?',
    question_type: 'multiple_choice',
    options: ['Heights / Rollercoasters', 'Giant hairy spiders', 'Being trapped in an elevator', 'Dentist drills'],
    correct_answer: 'Giant hairy spiders',
    position: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-alex-5',
    quiz_id: 'quiz-alex-01',
    question_text: 'What is my dream career or venture?',
    question_type: 'multiple_choice',
    options: ['Founding an AI Tech Startup', 'Travel Documentary Filmmaker', 'Coffee Shop & Bookstore Owner', 'Game Developer'],
    correct_answer: 'Founding an AI Tech Startup',
    position: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-alex-6',
    quiz_id: 'quiz-alex-01',
    question_text: 'What is my most frequently used phrase?',
    question_type: 'multiple_choice',
    options: ['"Literally makes no sense"', '"It is what it is"', '"Let me check my schedule"', '"Bro, listen to this"'],
    correct_answer: '"It is what it is"',
    position: 5,
    created_at: new Date().toISOString(),
  },

  // Sarah questions
  {
    id: 'q-sarah-1',
    quiz_id: 'quiz-sarah-02',
    question_text: 'What is my go-to coffee order in the morning?',
    question_type: 'multiple_choice',
    options: ['Iced Vanilla Latte with Oat Milk', 'Straight Black Espresso', 'Matcha Latte with Honey', 'Caramel Macchiato'],
    correct_answer: 'Iced Vanilla Latte with Oat Milk',
    position: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-sarah-2',
    quiz_id: 'quiz-sarah-02',
    question_text: 'What instantly ruins my day?',
    question_type: 'multiple_choice',
    options: ['Slow internet connection', 'Someone canceling at the last minute', 'Losing my AirPods', 'Rain when I planned to go out'],
    correct_answer: 'Someone canceling at the last minute',
    position: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-sarah-3',
    quiz_id: 'quiz-sarah-02',
    question_text: 'True or False: I can keep a secret forever.',
    question_type: 'true_false',
    options: ['True', 'False'],
    correct_answer: 'True',
    position: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-sarah-4',
    quiz_id: 'quiz-sarah-02',
    question_text: 'What is my favourite music vibe?',
    question_type: 'multiple_choice',
    options: ['Indie & Alternative Rock', 'Lo-fi & R&B Beats', 'Pop Anthems & Taylor Swift', 'EDM & House Music'],
    correct_answer: 'Indie & Alternative Rock',
    position: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-sarah-5',
    quiz_id: 'quiz-sarah-02',
    question_text: 'If I won a million dollars tomorrow, what is the first thing I would do?',
    question_type: 'multiple_choice',
    options: ['Book a one-way flight to Europe', 'Buy a cozy beach house', 'Invest in stocks and real estate', 'Throw an epic party for all my friends'],
    correct_answer: 'Book a one-way flight to Europe',
    position: 4,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_SUBMISSIONS: LeaderboardEntry[] = [
  {
    id: 'sub-alex-1',
    quiz_id: 'quiz-alex-01',
    participant_name: 'Jessica Maya',
    score: 6,
    total_questions: 6,
    percentage: 100,
    submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    anonymous: false,
    rank: 1,
  },
  {
    id: 'sub-alex-2',
    quiz_id: 'quiz-alex-01',
    participant_name: 'David Miller',
    score: 5,
    total_questions: 6,
    percentage: 83.33,
    submitted_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    anonymous: false,
    rank: 2,
  },
  {
    id: 'sub-alex-3',
    quiz_id: 'quiz-alex-01',
    participant_name: 'Jordan K.',
    score: 4,
    total_questions: 6,
    percentage: 66.67,
    submitted_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    anonymous: false,
    rank: 3,
  },
  {
    id: 'sub-alex-4',
    quiz_id: 'quiz-alex-01',
    participant_name: 'Mystery Buddy',
    score: 3,
    total_questions: 6,
    percentage: 50,
    submitted_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    anonymous: true,
    rank: 4,
  },
  {
    id: 'sub-alex-5',
    quiz_id: 'quiz-alex-01',
    participant_name: 'Sammy',
    score: 1,
    total_questions: 6,
    percentage: 16.67,
    submitted_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    anonymous: false,
    rank: 5,
  },
];

class LocalQuizStore {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEY_QUIZZES)) {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(INITIAL_QUIZZES));
    }
    if (!localStorage.getItem(STORAGE_KEY_QUESTIONS)) {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEY_SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEY_PROFILES)) {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_PROFILES));
    }
    if (!localStorage.getItem(STORAGE_KEY_SUBMISSION_ANSWERS)) {
      localStorage.setItem(STORAGE_KEY_SUBMISSION_ANSWERS, JSON.stringify([]));
    }
  }

  // Auth & Profile
  public getCurrentUser(): Profile | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: Profile | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  }

  public getProfiles(): Profile[] {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    return raw ? JSON.parse(raw) : [];
  }

  public saveProfile(profile: Profile): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }

  // Quizzes
  public getQuizzes(): Quiz[] {
    const raw = localStorage.getItem(STORAGE_KEY_QUIZZES);
    return raw ? JSON.parse(raw) : [];
  }

  public getQuestions(): Question[] {
    const raw = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public getSubmissions(): LeaderboardEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public getQuizBySlug(slug: string): Quiz | null {
    const quizzes = this.getQuizzes();
    const quiz = quizzes.find((q) => q.slug.toLowerCase() === slug.toLowerCase());
    if (!quiz) return null;

    const questions = this.getQuestions().filter((q) => q.quiz_id === quiz.id);
    return {
      ...quiz,
      questions: questions.sort((a, b) => a.position - b.position),
    };
  }

  public getQuizById(id: string): Quiz | null {
    const quizzes = this.getQuizzes();
    const quiz = quizzes.find((q) => q.id === id);
    if (!quiz) return null;

    const questions = this.getQuestions().filter((q) => q.quiz_id === quiz.id);
    return {
      ...quiz,
      questions: questions.sort((a, b) => a.position - b.position),
    };
  }

  // Secure Public Fetch (omits correct_answer!)
  public getQuizForTaking(slug: string): PublicQuiz | null {
    const quiz = this.getQuizBySlug(slug);
    if (!quiz || quiz.status !== 'published') return null;

    const questions = (quiz.questions || []).map((q) => ({
      id: q.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      position: q.position,
    }));

    return {
      id: quiz.id,
      creator_name: quiz.creator_name,
      title: quiz.title,
      description: quiz.description,
      slug: quiz.slug,
      theme: quiz.theme,
      allow_anonymous: quiz.allow_anonymous,
      allow_retake: quiz.allow_retake,
      show_answers_after_submission: quiz.show_answers_after_submission,
      leaderboard_visibility: quiz.leaderboard_visibility,
      total_questions: questions.length,
      questions,
    };
  }

  // Creator Save Quiz & Questions
  public saveQuiz(
    quizData: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>,
    questions: Array<Omit<Question, 'id' | 'quiz_id' | 'created_at'>>,
    quizId?: string
  ): Quiz {
    const quizzes = this.getQuizzes();
    let questionsStore = this.getQuestions();
    const now = new Date().toISOString();

    let targetQuiz: Quiz;

    if (quizId) {
      const idx = quizzes.findIndex((q) => q.id === quizId);
      if (idx >= 0) {
        targetQuiz = {
          ...quizzes[idx],
          ...quizData,
          updated_at: now,
        };
        quizzes[idx] = targetQuiz;
      } else {
        throw new Error('Quiz not found for update');
      }
      // Remove old questions
      questionsStore = questionsStore.filter((q) => q.quiz_id !== quizId);
    } else {
      const newId = `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      targetQuiz = {
        ...quizData,
        id: newId,
        created_at: now,
        updated_at: now,
      };
      quizzes.unshift(targetQuiz);
    }

    // Save questions
    const createdQuestions: Question[] = questions.map((q, idx) => ({
      ...q,
      id: `q-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      quiz_id: targetQuiz.id,
      position: idx,
      created_at: now,
    }));

    questionsStore.push(...createdQuestions);

    localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes));
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questionsStore));

    return {
      ...targetQuiz,
      questions: createdQuestions,
    };
  }

  public deleteQuiz(quizId: string): boolean {
    let quizzes = this.getQuizzes();
    let questions = this.getQuestions();
    let submissions = this.getSubmissions();

    quizzes = quizzes.filter((q) => q.id !== quizId);
    questions = questions.filter((q) => q.quiz_id !== quizId);
    submissions = submissions.filter((s) => s.quiz_id !== quizId);

    localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes));
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));

    return true;
  }

  public duplicateQuiz(quizId: string): Quiz | null {
    const original = this.getQuizById(quizId);
    if (!original) return null;

    const newSlug = `${original.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`;
    const newQuestions = (original.questions || []).map((q) => ({
      question_text: q.question_text,
      question_type: q.question_type,
      options: [...q.options],
      correct_answer: q.correct_answer,
      position: q.position,
    }));

    return this.saveQuiz(
      {
        owner_id: original.owner_id,
        creator_name: original.creator_name,
        title: `${original.title} (Copy)`,
        description: original.description,
        slug: newSlug,
        theme: original.theme,
        status: 'draft',
        visibility: original.visibility,
        allow_anonymous: original.allow_anonymous,
        allow_retake: original.allow_retake,
        show_answers_after_submission: original.show_answers_after_submission,
        leaderboard_visibility: original.leaderboard_visibility,
      },
      newQuestions
    );
  }

  // Secure Server-Equivalent Scoring
  public submitQuizAnswers(
    quizId: string,
    participantName: string,
    anonymous: boolean,
    answers: Array<{ question_id: string; selected_answer: string }>
  ): SubmissionResult {
    const quiz = this.getQuizById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    const realQuestions = this.getQuestions().filter((q) => q.quiz_id === quizId);
    if (realQuestions.length === 0) throw new Error('Quiz has no questions');

    let score = 0;
    const reviewList = [];

    const answerMap = new Map(answers.map((a) => [a.question_id, a.selected_answer]));

    for (const q of realQuestions) {
      const selected = answerMap.get(q.id) || '';
      let isCorrect = false;

      if (q.question_type === 'short_answer') {
        const normSelected = selected.trim().toLowerCase().replace(/[^\w\s]/gi, '');
        const normCorrect = q.correct_answer.trim().toLowerCase().replace(/[^\w\s]/gi, '');

        if (!normCorrect || normCorrect.length === 0) {
          isCorrect = normSelected.length > 0;
        } else {
          const keywords = normCorrect.split(/\s+/).filter((w) => w.length > 2);
          const hasKeyword = keywords.length > 0 && keywords.some((w) => normSelected.includes(w));
          isCorrect =
            normSelected === normCorrect ||
            normSelected.includes(normCorrect) ||
            normCorrect.includes(normSelected) ||
            hasKeyword;
        }
      } else {
        isCorrect = selected.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
      }

      if (isCorrect) {
        score++;
      }

      reviewList.push({
        question_id: q.id,
        question_text: q.question_text,
        selected_answer: selected,
        correct_answer: quiz.show_answers_after_submission ? q.correct_answer : undefined,
        is_correct: isCorrect,
      });
    }

    const total = realQuestions.length;
    const percentage = Math.round((score / total) * 10000) / 100;
    const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const cleanName = participantName.trim() || 'Anonymous Friend';
    const now = new Date().toISOString();

    const newSubmission: LeaderboardEntry = {
      id: submissionId,
      quiz_id: quizId,
      participant_name: cleanName,
      score,
      total_questions: total,
      percentage,
      submitted_at: now,
      anonymous,
    };

    const submissions = this.getSubmissions();
    submissions.push(newSubmission);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));

    // Save detailed answers
    const rawSubAnswers = localStorage.getItem(STORAGE_KEY_SUBMISSION_ANSWERS);
    const subAnswers = rawSubAnswers ? JSON.parse(rawSubAnswers) : [];
    for (const item of reviewList) {
      subAnswers.push({
        id: `sa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        submission_id: submissionId,
        question_id: item.question_id,
        selected_answer: item.selected_answer,
        is_correct: item.is_correct,
      });
    }
    localStorage.setItem(STORAGE_KEY_SUBMISSION_ANSWERS, JSON.stringify(subAnswers));

    const scoreInfo = getScoreMessage(score, total);

    return {
      id: submissionId,
      quiz_id: quizId,
      participant_name: cleanName,
      score,
      total_questions: total,
      percentage,
      submitted_at: now,
      anonymous,
      message: scoreInfo.message,
      badge: scoreInfo.badge,
      review: reviewList,
    };
  }

  // Leaderboard
  public getLeaderboard(quizId: string): LeaderboardEntry[] {
    const submissions = this.getSubmissions().filter((s) => s.quiz_id === quizId);
    // Sort highest score first, then earliest submission
    submissions.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
    });

    return submissions.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }

  // Creator Analytics
  public getQuizAnalytics(quizId: string): QuizAnalyticsData | null {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return null;

    const leaderboard = this.getLeaderboard(quizId);
    const questions = this.getQuestions().filter((q) => q.quiz_id === quizId);

    const rawSubAnswers = localStorage.getItem(STORAGE_KEY_SUBMISSION_ANSWERS);
    const subAnswers: Array<{
      submission_id: string;
      question_id: string;
      selected_answer: string;
      is_correct: boolean;
    }> = rawSubAnswers ? JSON.parse(rawSubAnswers) : [];

    const totalAttempts = leaderboard.length;
    const uniqueParticipants = new Set(leaderboard.map((l) => l.participant_name.toLowerCase())).size;

    let avgScore = 0;
    let avgPercentage = 0;
    let highestScore = 0;
    let lowestScore = totalAttempts > 0 ? questions.length : 0;

    if (totalAttempts > 0) {
      const totalPoints = leaderboard.reduce((acc, curr) => acc + curr.score, 0);
      avgScore = Math.round((totalPoints / totalAttempts) * 10) / 10;
      avgPercentage = Math.round(((avgScore / questions.length) * 100) * 10) / 10;
      highestScore = Math.max(...leaderboard.map((l) => l.score));
      lowestScore = Math.min(...leaderboard.map((l) => l.score));
    }

    // Score distribution bins
    const distribution = [
      { range: '90-100%', count: 0 },
      { range: '70-89%', count: 0 },
      { range: '50-69%', count: 0 },
      { range: '30-49%', count: 0 },
      { range: '0-29%', count: 0 },
    ];

    for (const sub of leaderboard) {
      if (sub.percentage >= 90) distribution[0].count++;
      else if (sub.percentage >= 70) distribution[1].count++;
      else if (sub.percentage >= 50) distribution[2].count++;
      else if (sub.percentage >= 30) distribution[3].count++;
      else distribution[4].count++;
    }

    // Question analytics
    const questionAnalytics: QuestionAnalytics[] = questions.map((q) => {
      const qAnswers = subAnswers.filter((sa) => sa.question_id === q.id);
      const totalResponses = qAnswers.length;
      const correctCount = qAnswers.filter((sa) => sa.is_correct).length;
      const correctPercentage = totalResponses > 0 ? Math.round((correctCount / totalResponses) * 100) : 0;

      // Find most common answer
      const countMap: Record<string, number> = {};
      for (const a of qAnswers) {
        if (a.selected_answer) {
          countMap[a.selected_answer] = (countMap[a.selected_answer] || 0) + 1;
        }
      }
      let mostCommon = '';
      let maxCount = 0;
      for (const [ans, count] of Object.entries(countMap)) {
        if (count > maxCount) {
          maxCount = count;
          mostCommon = ans;
        }
      }

      return {
        question_id: q.id,
        question_text: q.question_text,
        total_responses: totalResponses,
        correct_count: correctCount,
        correct_percentage: correctPercentage,
        most_common_answer: mostCommon,
      };
    });

    return {
      quiz,
      total_attempts: totalAttempts,
      unique_participants: uniqueParticipants,
      avg_score: avgScore,
      avg_percentage: avgPercentage,
      highest_score: highestScore,
      lowest_score: lowestScore,
      score_distribution: distribution,
      question_analytics: questionAnalytics,
      recent_submissions: leaderboard.slice(0, 20),
    };
  }
}

export const localQuizStore = new LocalQuizStore();
