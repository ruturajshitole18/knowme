import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 text-center bg-radial-gradient">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 max-w-md w-full shadow-2xl space-y-5">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
            404
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Oops! The page you were looking for doesn't exist or has wandered off into the digital void.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-glow-purple hover:scale-105 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
