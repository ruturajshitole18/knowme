import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  Trophy, 
  Flame, 
  Users, 
  ShieldCheck, 
  Smile, 
  Zap, 
  HelpCircle,
  Play
} from 'lucide-react';
import { TakeFriendQuizModal } from '../components/TakeFriendQuizModal';

export const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewSelected, setPreviewSelected] = useState<string>('Sushi');
  const [previewScore, setPreviewScore] = useState<number>(4);

  return (
    <div className="w-full relative overflow-hidden bg-radial-gradient">
      <TakeFriendQuizModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span>The Viral Friendship Test</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              How well do your friends <span className="text-gradient">REALLY</span> know you?
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Create your personal quiz, send it to your friends, and discover who actually pays attention.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/create"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
              >
                <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                <span>Create My Quiz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-base bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-purple-400/40 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-pink-400 fill-pink-400" />
                <span>Take a Friend's Quiz</span>
              </button>
            </div>

            {/* Social Proof badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>No App Download Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Instant Live Scores</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quiz Card Preview */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-40 animate-pulse-slow" />
            
            <div className="relative glass-card rounded-3xl p-6 sm:p-7 border border-white/15 shadow-2xl space-y-5">
              
              {/* Creator Mock Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    R
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">Ruturaj's Official Quiz</h4>
                    <p className="text-[11px] text-purple-300">Question 3 of 5 • Active</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  LIVE DEMO
                </span>
              </div>

              {/* Sample Question */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Question 3
                </p>
                <h3 className="text-lg font-bold text-white leading-snug">
                  What is my absolute favourite food to binge on weekends?
                </h3>

                {/* Sample Options */}
                <div className="space-y-2 pt-1">
                  {[
                    { label: 'Wood-fired Margherita Pizza', val: 'Pizza' },
                    { label: 'Fresh Salmon Sushi Roll', val: 'Sushi' },
                    { label: 'Crispy Double Cheeseburger', val: 'Burger' },
                    { label: 'Spicy Chicken Biryani', val: 'Biryani' },
                  ].map((item) => {
                    const isSelected = previewSelected === item.val;
                    return (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => {
                          setPreviewSelected(item.val);
                          setPreviewScore(item.val === 'Sushi' ? 5 : 4);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-900/70 to-pink-900/60 border-pink-400 text-white shadow-glow-pink ring-1 ring-pink-400/40'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <Sparkles className="w-4 h-4 text-pink-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sample Live Scoreboard Mini-preview */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs bg-black/20 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">Current Score Preview:</span>
                </div>
                <div className="font-extrabold text-pink-400 text-sm">
                  {previewScore}/5 ({Math.round((previewScore / 5) * 100)}%)
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
            Simple & Fast
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How It Works in <span className="text-gradient">3 Simple Steps</span>
          </h2>
          <p className="text-base text-slate-300">
            No long registrations for friends. Just pure fun and friendly competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-xl space-y-4 relative group hover:border-purple-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-glow-purple">
              1
            </div>
            <h3 className="text-xl font-bold text-white pt-2">Create Your Quiz</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pick from our fun question library or write your own. Mark your real answers and customize your quiz theme.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-xl space-y-4 relative group hover:border-pink-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-white font-black text-xl shadow-glow-pink">
              2
            </div>
            <h3 className="text-xl font-bold text-white pt-2">Share Your Unique Link</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Get an unguessable share link. Drop it into your WhatsApp group, Instagram bio, Snapchat story, or group chats.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-xl space-y-4 relative group hover:border-sky-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-glow-blue">
              3
            </div>
            <h3 className="text-xl font-bold text-white pt-2">See Who Knows You Best</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Watch the live leaderboard update in real time. Compare scores, laugh at wrong answers, and crown your true best friend!
            </p>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            Why Everyone Loves KnowMe
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Packed with <span className="text-gradient">Fun & Smart Features</span>
          </h2>
          <p className="text-base text-slate-300">
            Engineered for high engagement, ironclad privacy, and seamless social sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Personalized Quizzes</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Choose from favorite foods, dream destinations, secret fears, and funny habits. Add custom multiple-choice or true/false options.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">One-Tap Sharing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant WhatsApp sharing with prefilled challenge messages, Web Share API support, and 1-click link copying.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Podium Scoreboards</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time leaderboards sorted by top score and earliest submission, with Gold, Silver, and Bronze podium badges.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Smile className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Funny Result Messages</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              From "Best Friend Material!" to "Do You Even Know This Person?", get hilariously accurate personality assessments.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">No Signup for Friends</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Friends can jump straight in by just entering their name. Anonymous participation option is also supported!
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Server-Side Scoring</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The answer key is never exposed in client HTML or API payloads. Prevents cheating and inspect-element hacks!
            </p>
          </div>

        </div>
      </section>

      {/* Featured Community Quizzes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">Popular Community Quizzes</h3>
            <p className="text-xs sm:text-sm text-slate-400">Try these live quizzes to see how the experience feels!</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
          >
            <span>Have a link? Enter code</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Featured
                </span>
                <span className="text-xs text-slate-400">6 questions</span>
              </div>
              <h4 className="text-xl font-bold text-white mt-3">How Well Do You Really Know Alex?</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Secrets, Friday night cravings, travel bucket lists, and career ambitions.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-slate-400 font-medium">Created by Alex Chen</span>
              <Link
                to="/quiz/alex-super-quiz-2026"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Play Quiz
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  Trending
                </span>
                <span className="text-xs text-slate-400">5 questions</span>
              </div>
              <h4 className="text-xl font-bold text-white mt-3">Sarah’s Ultimate Vibe & Friendship Check</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Coffee habits, favorite music vibes, pet peeves, and wild dream adventures.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-slate-400 font-medium">Created by Sarah Jenkins</span>
              <Link
                to="/quiz/sarah-vibe-check-99"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-glow-pink hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Play Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-14 border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-sky-600/20 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to test your friendships?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Create your custom KnowMe quiz in under 2 minutes and share your link with friends.
            </p>
            <div className="pt-2">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-[1.03] transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Create My Quiz Now — It's Free</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
