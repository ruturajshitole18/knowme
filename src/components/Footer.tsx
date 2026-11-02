import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, HelpCircle, FileText, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#070517] relative z-10 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-500 to-sky-400 p-0.5">
                <div className="w-full h-full bg-[#0A071E] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Know<span className="text-pink-400">Me</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your friends know you. But <strong className="text-purple-300">HOW well?</strong> Create personal quizzes, challenge your friends, and discover who pays attention.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>for friendship & fun</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-pink-300 transition-colors">Home</Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-pink-300 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#features" className="hover:text-pink-300 transition-colors">Features</a>
              </li>
              <li>
                <Link to="/create" className="hover:text-pink-300 transition-colors">Create My Quiz</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-pink-300 transition-colors">Creator Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Trust & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-pink-300 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-pink-300 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-pink-400" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-pink-300 transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                  Quiz FAQ
                </a>
              </li>
              <li>
                <a href="mailto:support@knowme.app" className="hover:text-pink-300 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Community Quizzes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Featured Quizzes</h4>
            <div className="space-y-2 text-xs">
              <Link 
                to="/quiz/alex-super-quiz-2026" 
                className="block p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all"
              >
                <p className="font-semibold text-slate-200">Alex Chen's Quiz</p>
                <p className="text-[11px] text-purple-300">6 questions • Live Leaderboard</p>
              </Link>
              <Link 
                to="/quiz/sarah-vibe-check-99" 
                className="block p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all"
              >
                <p className="font-semibold text-slate-200">Sarah's Vibe Check</p>
                <p className="text-[11px] text-pink-300">5 questions • Top Scores</p>
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KnowMe. All rights reserved. Built for friendly competition.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <a href="mailto:hello@knowme.app" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
