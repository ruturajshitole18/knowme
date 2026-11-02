-- ==============================================================================
-- KNOWME DATABASE SCHEMA & RLS SETUP SCRIPT FOR SUPABASE POSTGRESQL
-- Run this script in the Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create QUIZZES Table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  theme TEXT NOT NULL DEFAULT 'midnight-violet',
  status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published'
  visibility TEXT NOT NULL DEFAULT 'public', -- 'public', 'unlisted'
  allow_anonymous BOOLEAN NOT NULL DEFAULT true,
  allow_retake BOOLEAN NOT NULL DEFAULT true,
  show_answers_after_submission BOOLEAN NOT NULL DEFAULT true,
  leaderboard_visibility TEXT NOT NULL DEFAULT 'public', -- 'public', 'creator_only'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on slug for lightning-fast public quiz lookups
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON public.quizzes(slug);
CREATE INDEX IF NOT EXISTS idx_quizzes_owner ON public.quizzes(owner_id);

-- 4. Create QUESTIONS Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice', -- 'multiple_choice', 'true_false'
  options JSONB NOT NULL, -- Array of strings e.g. ["Pizza", "Burgers", "Sushi"]
  correct_answer TEXT NOT NULL, -- Keep private!
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);

-- 5. Create SUBMISSIONS Table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  anonymous BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_submissions_quiz_id ON public.submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON public.submissions(quiz_id, score DESC, submitted_at ASC);

-- 6. Create SUBMISSION_ANSWERS Table
CREATE TABLE IF NOT EXISTS public.submission_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT unique_submission_question UNIQUE(submission_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_submission_answers_sub ON public.submission_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_q ON public.submission_answers(question_id);

-- 7. AUTOMATIC PROFILE TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET display_name = EXCLUDED.display_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_answers ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view display name, users update their own
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Quizzes:
-- Public can view published quizzes
CREATE POLICY "Anyone can view published quizzes" 
  ON public.quizzes FOR SELECT 
  USING (status = 'published');

-- Owners can view all their own quizzes (including drafts)
CREATE POLICY "Owners can view own quizzes" 
  ON public.quizzes FOR SELECT 
  USING (auth.uid() = owner_id);

-- Owners can insert, update, and delete their quizzes
CREATE POLICY "Owners can insert quizzes" 
  ON public.quizzes FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own quizzes" 
  ON public.quizzes FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own quizzes" 
  ON public.quizzes FOR DELETE 
  USING (auth.uid() = owner_id);

-- Questions:
-- ONLY quiz owners can view questions with correct answers directly via SQL query
CREATE POLICY "Owners can view all columns of questions" 
  ON public.questions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id AND quizzes.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can insert questions" 
  ON public.questions FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id AND quizzes.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update questions" 
  ON public.questions FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id AND quizzes.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete questions" 
  ON public.questions FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id AND quizzes.owner_id = auth.uid()
    )
  );

-- Submissions:
-- Leaderboards: Anyone can view submissions if quiz leaderboard is 'public', or if user is owner
CREATE POLICY "Public or creator leaderboard access" 
  ON public.submissions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = submissions.quiz_id 
      AND (quizzes.leaderboard_visibility = 'public' OR quizzes.owner_id = auth.uid())
    )
  );

-- Submission Answers:
-- Only quiz owner can view detailed submission answers
CREATE POLICY "Owners can view submission answers" 
  ON public.submission_answers FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions
      JOIN public.quizzes ON quizzes.id = submissions.quiz_id
      WHERE submissions.id = submission_answers.submission_id 
      AND quizzes.owner_id = auth.uid()
    )
  );

-- 9. SECURE RPC: GET QUIZ FOR TAKING (NEVER EXPOSES correct_answer TO PARTICIPANTS!)
CREATE OR REPLACE FUNCTION public.get_quiz_for_taking(p_slug TEXT)
RETURNS JSONB AS $$
DECLARE
  v_quiz public.quizzes%ROWTYPE;
  v_questions JSONB;
BEGIN
  -- Fetch quiz metadata
  SELECT * INTO v_quiz
  FROM public.quizzes
  WHERE slug = p_slug AND status = 'published'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Fetch questions without correct_answer column
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', q.id,
        'question_text', q.question_text,
        'question_type', q.question_type,
        'options', q.options,
        'position', q.position
      ) ORDER BY q.position ASC
    ),
    '[]'::jsonb
  ) INTO v_questions
  FROM public.questions q
  WHERE q.quiz_id = v_quiz.id;

  RETURN jsonb_build_object(
    'id', v_quiz.id,
    'creator_name', v_quiz.creator_name,
    'title', v_quiz.title,
    'description', v_quiz.description,
    'slug', v_quiz.slug,
    'theme', v_quiz.theme,
    'allow_anonymous', v_quiz.allow_anonymous,
    'allow_retake', v_quiz.allow_retake,
    'show_answers_after_submission', v_quiz.show_answers_after_submission,
    'leaderboard_visibility', v_quiz.leaderboard_visibility,
    'total_questions', jsonb_array_length(v_questions),
    'questions', v_questions
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant public access to get_quiz_for_taking
GRANT EXECUTE ON FUNCTION public.get_quiz_for_taking(TEXT) TO anon, authenticated;

-- 10. SECURE RPC: SUBMIT QUIZ ANSWERS (CALCULATES SCORE SECURELY ON SERVER)
CREATE OR REPLACE FUNCTION public.submit_quiz_answers(
  p_quiz_id UUID,
  p_participant_name TEXT,
  p_anonymous BOOLEAN,
  p_answers JSONB -- Array of { "question_id": "uuid", "selected_answer": "text" }
)
RETURNS JSONB AS $$
DECLARE
  v_quiz public.quizzes%ROWTYPE;
  v_submission_id UUID;
  v_total_questions INTEGER := 0;
  v_score INTEGER := 0;
  v_percentage NUMERIC(5, 2) := 0.00;
  v_item JSONB;
  v_q_id UUID;
  v_selected_ans TEXT;
  v_correct_ans TEXT;
  v_q_text TEXT;
  v_is_correct BOOLEAN;
  v_review_list JSONB := '[]'::jsonb;
  v_clean_name TEXT;
BEGIN
  -- Fetch quiz
  SELECT * INTO v_quiz
  FROM public.quizzes
  WHERE id = p_quiz_id AND status = 'published'
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quiz not found or not published';
  END IF;

  -- Validate participant name
  v_clean_name := TRIM(COALESCE(p_participant_name, 'Anonymous Friend'));
  IF v_clean_name = '' THEN
    v_clean_name := 'Anonymous Friend';
  END IF;

  -- Get total questions
  SELECT COUNT(*) INTO v_total_questions
  FROM public.questions
  WHERE quiz_id = p_quiz_id;

  IF v_total_questions = 0 THEN
    RAISE EXCEPTION 'Quiz has no questions';
  END IF;

  -- Generate submission ID
  v_submission_id := gen_random_uuid();

  -- Process answers and calculate score securely against stored questions
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_answers)
  LOOP
    v_q_id := (v_item->>'question_id')::UUID;
    v_selected_ans := TRIM(COALESCE(v_item->>'selected_answer', ''));

    -- Find real question
    SELECT question_text, correct_answer 
    INTO v_q_text, v_correct_ans
    FROM public.questions
    WHERE id = v_q_id AND quiz_id = p_quiz_id;

    IF FOUND THEN
      v_is_correct := (v_selected_ans = v_correct_ans);
      IF v_is_correct THEN
        v_score := v_score + 1;
      END IF;

      -- Insert into submission_answers
      INSERT INTO public.submission_answers (
        submission_id,
        question_id,
        selected_answer,
        is_correct
      ) VALUES (
        v_submission_id,
        v_q_id,
        v_selected_ans,
        v_is_correct
      );

      -- Build review item
      v_review_list := v_review_list || jsonb_build_object(
        'question_id', v_q_id,
        'question_text', v_q_text,
        'selected_answer', v_selected_ans,
        'correct_answer', CASE WHEN v_quiz.show_answers_after_submission THEN v_correct_ans ELSE NULL END,
        'is_correct', v_is_correct
      );
    END IF;
  END LOOP;

  -- Compute percentage
  v_percentage := ROUND(((v_score::NUMERIC / v_total_questions::NUMERIC) * 100), 2);

  -- Insert submission record
  INSERT INTO public.submissions (
    id,
    quiz_id,
    participant_name,
    score,
    total_questions,
    percentage,
    submitted_at,
    anonymous
  ) VALUES (
    v_submission_id,
    p_quiz_id,
    v_clean_name,
    v_score,
    v_total_questions,
    v_percentage,
    NOW(),
    p_anonymous
  );

  -- Return comprehensive result payload
  RETURN jsonb_build_object(
    'id', v_submission_id,
    'quiz_id', p_quiz_id,
    'participant_name', v_clean_name,
    'score', v_score,
    'total_questions', v_total_questions,
    'percentage', v_percentage,
    'submitted_at', NOW(),
    'anonymous', p_anonymous,
    'review', v_review_list
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.submit_quiz_answers(UUID, TEXT, BOOLEAN, JSONB) TO anon, authenticated;
