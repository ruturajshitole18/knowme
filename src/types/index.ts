export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export type QuizTheme = 
  | 'midnight-violet' 
  | 'cyber-pink' 
  | 'ocean-breeze' 
  | 'sunset-glow' 
  | 'emerald-night';

export type QuizStatus = 'draft' | 'published';
export type QuizVisibility = 'public' | 'unlisted';
export type LeaderboardVisibility = 'public' | 'creator_only';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id?: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string;
  position: number;
  created_at?: string;
}

// Client question representation when taking a quiz (correct_answer hidden for security)
export interface PublicQuestion {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  position: number;
}

export interface Quiz {
  id: string;
  owner_id: string;
  creator_name: string;
  title: string;
  description?: string | null;
  slug: string;
  theme: QuizTheme;
  status: QuizStatus;
  visibility: QuizVisibility;
  allow_anonymous: boolean;
  allow_retake: boolean;
  show_answers_after_submission: boolean;
  leaderboard_visibility: LeaderboardVisibility;
  created_at: string;
  updated_at: string;
  questions?: Question[];
  // Aggregated stats (if fetched with dashboard)
  total_attempts?: number;
  avg_score?: number;
}

export interface PublicQuiz {
  id: string;
  creator_name: string;
  title: string;
  description?: string | null;
  slug: string;
  theme: QuizTheme;
  allow_anonymous: boolean;
  allow_retake: boolean;
  show_answers_after_submission: boolean;
  leaderboard_visibility: LeaderboardVisibility;
  total_questions: number;
  questions: PublicQuestion[];
}

export interface SubmissionAnswer {
  question_id: string;
  selected_answer: string;
}

export interface SubmissionResultItem {
  question_id: string;
  question_text: string;
  selected_answer: string;
  correct_answer?: string; // only revealed if creator allows answer review
  is_correct: boolean;
}

export interface SubmissionResult {
  id: string;
  quiz_id: string;
  participant_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  submitted_at: string;
  anonymous: boolean;
  message: string;
  badge: string;
  review?: SubmissionResultItem[];
}

export interface LeaderboardEntry {
  id: string;
  quiz_id: string;
  participant_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  submitted_at: string;
  anonymous: boolean;
  rank?: number;
}

export interface QuestionAnalytics {
  question_id: string;
  question_text: string;
  total_responses: number;
  correct_count: number;
  correct_percentage: number;
  most_common_answer?: string;
}

export interface QuizAnalyticsData {
  quiz: Quiz;
  total_attempts: number;
  unique_participants: number;
  avg_score: number;
  avg_percentage: number;
  highest_score: number;
  lowest_score: number;
  score_distribution: {
    range: string;
    count: number;
  }[];
  question_analytics: QuestionAnalytics[];
  recent_submissions: LeaderboardEntry[];
}
