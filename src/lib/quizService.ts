import { isSupabaseConfigured, supabase } from './supabase';
import { localQuizStore } from './localQuizStore';
import { 
  Quiz, 
  Question, 
  PublicQuiz, 
  SubmissionResult, 
  LeaderboardEntry, 
  QuizAnalyticsData, 
  QuestionAnalytics 
} from '../types';
import { getScoreMessage } from './utils';

export const quizService = {
  // Public Quiz Taking (Secure: NO correct answers leaked)
  async getQuizForTaking(slug: string): Promise<PublicQuiz | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.rpc('get_quiz_for_taking', {
          p_slug: slug,
        });
        if (error) {
          console.warn('Supabase RPC get_quiz_for_taking error, falling back:', error);
          return localQuizStore.getQuizForTaking(slug);
        }
        return data as PublicQuiz;
      } catch (err) {
        console.error('Error fetching quiz from Supabase:', err);
        return localQuizStore.getQuizForTaking(slug);
      }
    }
    return localQuizStore.getQuizForTaking(slug);
  },

  // Scoring Answers (Secure: Server calculates points and percentage)
  async submitQuizAnswers(
    quizId: string,
    participantName: string,
    anonymous: boolean,
    answers: Array<{ question_id: string; selected_answer: string }>
  ): Promise<SubmissionResult> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.rpc('submit_quiz_answers', {
          p_quiz_id: quizId,
          p_participant_name: participantName,
          p_anonymous: anonymous,
          p_answers: answers,
        });

        if (error) {
          console.warn('Supabase RPC submit_quiz_answers error, falling back to local store:', error);
          return localQuizStore.submitQuizAnswers(quizId, participantName, anonymous, answers);
        }

        const scoreMsg = getScoreMessage(data.score, data.total_questions);
        return {
          ...data,
          message: scoreMsg.message,
          badge: scoreMsg.badge,
        } as SubmissionResult;
      } catch (err) {
        console.error('Error submitting quiz answers to Supabase:', err);
        return localQuizStore.submitQuizAnswers(quizId, participantName, anonymous, answers);
      }
    }

    return localQuizStore.submitQuizAnswers(quizId, participantName, anonymous, answers);
  },

  // Leaderboard
  async getLeaderboard(quizId: string): Promise<LeaderboardEntry[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('id, quiz_id, participant_name, score, total_questions, percentage, submitted_at, anonymous')
          .eq('quiz_id', quizId)
          .order('score', { ascending: false })
          .order('submitted_at', { ascending: true });

        if (!error && data) {
          return data.map((entry, idx) => ({
            ...entry,
            rank: idx + 1,
          }));
        }
      } catch (err) {
        console.warn('Error fetching Supabase leaderboard, using local fallback:', err);
      }
    }
    return localQuizStore.getLeaderboard(quizId);
  },

  // Creator Quizzes Dashboard
  async getCreatorQuizzes(ownerId: string): Promise<Quiz[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select(`
            *,
            questions (count),
            submissions (score, total_questions)
          `)
          .eq('owner_id', ownerId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((q: any) => {
            const submissions = q.submissions || [];
            const totalAttempts = submissions.length;
            const avgScore = totalAttempts > 0
              ? Math.round((submissions.reduce((acc: number, curr: any) => acc + curr.score, 0) / totalAttempts) * 10) / 10
              : 0;

            return {
              ...q,
              total_attempts: totalAttempts,
              avg_score: avgScore,
            };
          });
        }
      } catch (err) {
        console.warn('Error fetching quizzes from Supabase, using local store:', err);
      }
    }

    const allQuizzes = localQuizStore.getQuizzes();
    const userQuizzes = allQuizzes.filter((q) => q.owner_id === ownerId || ownerId === 'local-user-id');
    const allSubs = localQuizStore.getSubmissions();

    return userQuizzes.map((q) => {
      const qSubs = allSubs.filter((s) => s.quiz_id === q.id);
      const totalAttempts = qSubs.length;
      const avgScore = totalAttempts > 0
        ? Math.round((qSubs.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts) * 10) / 10
        : 0;

      return {
        ...q,
        total_attempts: totalAttempts,
        avg_score: avgScore,
      };
    });
  },

  // Get single quiz by slug or id (including questions and answers for creator)
  async getQuizBySlug(slug: string): Promise<Quiz | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data: quiz, error } = await supabase
          .from('quizzes')
          .select('*, questions(*)')
          .eq('slug', slug)
          .single();

        if (!error && quiz) {
          if (quiz.questions) {
            quiz.questions.sort((a: any, b: any) => a.position - b.position);
          }
          return quiz as Quiz;
        }
      } catch (err) {
        console.warn('Error getting quiz by slug in Supabase, using local store:', err);
      }
    }
    return localQuizStore.getQuizBySlug(slug);
  },

  async getQuizById(id: string): Promise<Quiz | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data: quiz, error } = await supabase
          .from('quizzes')
          .select('*, questions(*)')
          .eq('id', id)
          .single();

        if (!error && quiz) {
          if (quiz.questions) {
            quiz.questions.sort((a: any, b: any) => a.position - b.position);
          }
          return quiz as Quiz;
        }
      } catch (err) {
        console.warn('Error getting quiz by id in Supabase, using local store:', err);
      }
    }
    return localQuizStore.getQuizById(id);
  },

  // Save / Publish Quiz
  async saveQuiz(
    quizData: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>,
    questions: Array<Omit<Question, 'id' | 'quiz_id' | 'created_at'>>,
    quizId?: string
  ): Promise<Quiz> {
    if (isSupabaseConfigured()) {
      try {
        let savedQuizId = quizId;

        if (quizId) {
          const { error: updateError } = await supabase
            .from('quizzes')
            .update({
              creator_name: quizData.creator_name,
              title: quizData.title,
              description: quizData.description,
              slug: quizData.slug,
              theme: quizData.theme,
              status: quizData.status,
              visibility: quizData.visibility,
              allow_anonymous: quizData.allow_anonymous,
              allow_retake: quizData.allow_retake,
              show_answers_after_submission: quizData.show_answers_after_submission,
              leaderboard_visibility: quizData.leaderboard_visibility,
              updated_at: new Date().toISOString(),
            })
            .eq('id', quizId);

          if (updateError) throw updateError;

          // Delete existing questions to re-insert updated list
          await supabase.from('questions').delete().eq('quiz_id', quizId);
        } else {
          const { data: newQuiz, error: insertError } = await supabase
            .from('quizzes')
            .insert({
              owner_id: quizData.owner_id,
              creator_name: quizData.creator_name,
              title: quizData.title,
              description: quizData.description,
              slug: quizData.slug,
              theme: quizData.theme,
              status: quizData.status,
              visibility: quizData.visibility,
              allow_anonymous: quizData.allow_anonymous,
              allow_retake: quizData.allow_retake,
              show_answers_after_submission: quizData.show_answers_after_submission,
              leaderboard_visibility: quizData.leaderboard_visibility,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          savedQuizId = newQuiz.id;
        }

        // Insert questions
        const questionsPayload = questions.map((q, idx) => ({
          quiz_id: savedQuizId,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          correct_answer: q.correct_answer,
          position: idx,
        }));

        const { data: savedQuestions, error: qError } = await supabase
          .from('questions')
          .insert(questionsPayload)
          .select();

        if (qError) throw qError;

        return {
          ...quizData,
          id: savedQuizId!,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          questions: savedQuestions as Question[],
        };
      } catch (err) {
        console.warn('Error saving quiz to Supabase, falling back to local store:', err);
      }
    }

    return localQuizStore.saveQuiz(quizData, questions, quizId);
  },

  // Delete Quiz
  async deleteQuiz(quizId: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
        if (error) throw error;
        localQuizStore.deleteQuiz(quizId);
        return true;
      } catch (err) {
        console.warn('Error deleting quiz in Supabase, deleting locally:', err);
      }
    }
    return localQuizStore.deleteQuiz(quizId);
  },

  // Duplicate Quiz
  async duplicateQuiz(quizId: string): Promise<Quiz | null> {
    const original = await this.getQuizById(quizId);
    if (!original) return null;

    const newSlug = `${original.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`;
    const questions = (original.questions || []).map((q) => ({
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
      questions
    );
  },

  // Detailed Quiz Analytics
  async getQuizAnalytics(quizId: string): Promise<QuizAnalyticsData | null> {
    if (isSupabaseConfigured()) {
      try {
        const quiz = await this.getQuizById(quizId);
        if (!quiz) return null;

        const { data: submissions } = await supabase
          .from('submissions')
          .select('*')
          .eq('quiz_id', quizId)
          .order('score', { ascending: false });

        const { data: subAnswers } = await supabase
          .from('submission_answers')
          .select('*, submissions!inner(quiz_id)')
          .eq('submissions.quiz_id', quizId);

        if (submissions) {
          const totalAttempts = submissions.length;
          const uniqueParticipants = new Set(submissions.map((s: any) => s.participant_name.toLowerCase())).size;
          const questions = quiz.questions || [];

          let avgScore = 0;
          let avgPercentage = 0;
          let highestScore = 0;
          let lowestScore = totalAttempts > 0 ? questions.length : 0;

          if (totalAttempts > 0) {
            const totalPoints = submissions.reduce((acc: number, curr: any) => acc + curr.score, 0);
            avgScore = Math.round((totalPoints / totalAttempts) * 10) / 10;
            avgPercentage = Math.round(((avgScore / (questions.length || 1)) * 100) * 10) / 10;
            highestScore = Math.max(...submissions.map((s: any) => s.score));
            lowestScore = Math.min(...submissions.map((s: any) => s.score));
          }

          const distribution = [
            { range: '90-100%', count: 0 },
            { range: '70-89%', count: 0 },
            { range: '50-69%', count: 0 },
            { range: '30-49%', count: 0 },
            { range: '0-29%', count: 0 },
          ];

          for (const sub of submissions) {
            if (sub.percentage >= 90) distribution[0].count++;
            else if (sub.percentage >= 70) distribution[1].count++;
            else if (sub.percentage >= 50) distribution[2].count++;
            else if (sub.percentage >= 30) distribution[3].count++;
            else distribution[4].count++;
          }

          const questionAnalytics: QuestionAnalytics[] = questions.map((q) => {
            const answersForQ = (subAnswers || []).filter((sa: any) => sa.question_id === q.id);
            const totalResponses = answersForQ.length;
            const correctCount = answersForQ.filter((sa: any) => sa.is_correct).length;
            const correctPercentage = totalResponses > 0 ? Math.round((correctCount / totalResponses) * 100) : 0;

            return {
              question_id: q.id,
              question_text: q.question_text,
              total_responses: totalResponses,
              correct_count: correctCount,
              correct_percentage: correctPercentage,
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
            recent_submissions: submissions.slice(0, 20).map((s: any, idx: number) => ({
              ...s,
              rank: idx + 1,
            })),
          };
        }
      } catch (err) {
        console.warn('Supabase analytics fetch error, falling back:', err);
      }
    }

    return localQuizStore.getQuizAnalytics(quizId);
  },
};
