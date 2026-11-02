import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  title?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, title }) => {
  const progressPercent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
        <span className="text-purple-300">
          Question <strong className="text-white text-base">{current + 1}</strong> of {total}
        </span>
        {title && <span className="text-slate-400 truncate max-w-[200px] hidden sm:inline">{title}</span>}
        <span className="text-pink-400 font-bold">{progressPercent}%</span>
      </div>

      <div className="w-full h-2.5 sm:h-3 bg-white/10 rounded-full overflow-hidden p-0.5 relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-sky-400 transition-all duration-300 ease-out shadow-glow-purple"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
