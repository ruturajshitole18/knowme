import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading quiz...',
  submessage = 'Getting everything ready for you',
}) => {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-sky-400 p-0.5 animate-spin">
          <div className="w-full h-full bg-[#0A071E] rounded-[22px] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-pink-400" />
          </div>
        </div>
        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">{message}</h3>
      <p className="mt-1 text-sm text-slate-400">{submessage}</p>

      {/* Skeletons */}
      <div className="w-full max-w-md mt-8 space-y-3 opacity-60">
        <div className="h-4 bg-white/10 rounded-full animate-pulse w-3/4 mx-auto" />
        <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};
