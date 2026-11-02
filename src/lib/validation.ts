import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().optional(),
  question_text: z.string().trim().min(3, 'Question must be at least 3 characters').max(200, 'Question cannot exceed 200 characters'),
  question_type: z.enum(['multiple_choice', 'true_false', 'short_answer']),
  options: z.array(z.string().trim()),
  correct_answer: z.string().trim().min(1, 'Please enter or select the answer'),
  position: z.number().int().default(0),
}).refine((data) => {
  if (data.question_type === 'short_answer') {
    return true;
  }
  return data.options.length >= 2 && data.options.length <= 6;
}, {
  message: 'Multiple-choice and true/false questions must provide between 2 and 6 choices',
  path: ['options'],
}).refine((data) => {
  if (data.question_type === 'short_answer') {
    return true;
  }
  const cleanOptions = data.options.map((s) => s.toLowerCase());
  return new Set(cleanOptions).size === cleanOptions.length;
}, {
  message: 'All options must be unique',
  path: ['options'],
}).refine((data) => {
  if (data.question_type === 'short_answer') {
    return true;
  }
  return data.options.includes(data.correct_answer);
}, {
  message: 'Correct answer must be one of the listed options',
  path: ['correct_answer'],
});

export const quizSetupSchema = z.object({
  creator_name: z.string().trim().min(2, 'Display name must be at least 2 characters').max(40, 'Display name is too long'),
  title: z.string().trim().min(3, 'Quiz title must be at least 3 characters').max(80, 'Quiz title is too long'),
  description: z.string().trim().max(300, 'Description cannot exceed 300 characters').optional().or(z.literal('')),
  theme: z.enum(['midnight-violet', 'cyber-pink', 'ocean-breeze', 'sunset-glow', 'emerald-night']),
  visibility: z.enum(['public', 'unlisted']),
  allow_anonymous: z.boolean().default(true),
  allow_retake: z.boolean().default(true),
  show_answers_after_submission: z.boolean().default(true),
  leaderboard_visibility: z.enum(['public', 'creator_only']),
  questions: z.array(questionSchema)
    .min(5, 'A quiz must have at least 5 questions before publishing')
    .max(30, 'A quiz cannot exceed 30 questions'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  display_name: z.string().trim().min(2, 'Display name must be at least 2 characters').max(40, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const participantNameSchema = z.object({
  participant_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(35, 'Name is too long'),
});
