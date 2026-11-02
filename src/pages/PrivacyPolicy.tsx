import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, Trash2, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-300">
      
      {/* Top Heading */}
      <div className="space-y-3 pb-6 border-b border-white/10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Last updated: October 2026 • Your trust and privacy are our top priorities.
        </p>
      </div>

      {/* Sections */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-pink-400" />
            1. Information We Collect
          </h2>
          <p>
            At <strong>KnowMe</strong>, we believe in collecting only the bare minimum information needed to operate our friendly social quiz platform:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li>
              <strong>Quiz Creators:</strong> When you register an account, we store your email address, display name, and password (securely hashed with industry-standard bcrypt via Supabase Auth).
            </li>
            <li>
              <strong>Quiz Participants:</strong> Friends who take quizzes are <em>not required to register</em>. We only store the participant nickname you enter (or "Anonymous Friend" if anonymous participation is selected), your submitted answers, and calculated score.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-purple-400" />
            2. Anti-Cheating & Answer Key Privacy
          </h2>
          <p>
            Correct quiz answers are never exposed to quiz participants before submission. All answer verification and score calculations are processed securely on the server via PostgreSQL row-level security and stored procedures, preventing client-side inspection.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            3. Data Control & Deletion
          </h2>
          <p>
            You have total control over your quizzes. When a creator deletes a quiz from their dashboard, the quiz, its questions, all participant answers, and all leaderboard records are immediately and permanently wiped from the database via cascade deletion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Third-Party Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties or advertising networks. External sharing (such as WhatsApp, Twitter/X, or the Web Share API) is triggered entirely by your explicit command.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Contact Us</h2>
          <p>
            If you have questions about privacy or wish to request data removal, contact us at{' '}
            <a href="mailto:privacy@knowme.app" className="text-pink-400 hover:underline font-semibold">
              privacy@knowme.app
            </a>.
          </p>
        </section>

      </div>

    </div>
  );
};
