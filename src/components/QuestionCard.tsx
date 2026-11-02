import React from 'react';
import { PublicQuestion } from '../types';
import { Check, PenLine } from 'lucide-react';

interface QuestionCardProps {
  question: PublicQuestion;
  selectedAnswer: string | undefined;
  onSelectAnswer: (answer: string) => void;
  index: number;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  index,
}) => {
  const isTrueFalse = question.question_type === 'true_false';
  const isShortAnswer = question.question_type === 'short_answer';

  return (
    <div className="w-full glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-300">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Question Header */}
      <div className="relative z-10 mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
          {isShortAnswer ? 'Short Answer' : isTrueFalse ? 'True / False' : `Question ${index + 1}`}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          {question.question_text}
        </h2>
      </div>

      {/* Short Answer (1-2 lines text input) */}
      {isShortAnswer ? (
        <div className="relative z-10 space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={selectedAnswer || ''}
              onChange={(e) => onSelectAnswer(e.target.value)}
              placeholder="Type your answer here in 1 or 2 lines..."
              maxLength={200}
              className="w-full glass-input rounded-xl p-4 text-sm sm:text-base text-white placeholder:text-slate-500 focus:border-pink-500 resize-none transition-all shadow-inner"
              autoFocus
            />
            <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2 text-xs text-slate-500 pointer-events-none">
              <PenLine className="w-3.5 h-3.5 text-purple-400" />
              <span>{(selectedAnswer || '').length}/200</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 pl-1">
            <span>💡</span>
            <span>Write in your own words. Keep it short (1–2 lines).</span>
          </p>
        </div>
      ) : (
        /* Multiple Choice & True/False Choices */
        <div className={`relative z-10 grid gap-3 sm:gap-4 ${isTrueFalse ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {question.options.map((option, optIdx) => {
            const isSelected = selectedAnswer === option;
            const letter = OPTION_LETTERS[optIdx] || `${optIdx + 1}`;

            return (
              <button
                key={`${question.id}-${optIdx}`}
                type="button"
                onClick={() => onSelectAnswer(option)}
                className={`w-full group text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center justify-between min-h-[58px] ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/50 border-pink-500/80 shadow-glow-pink ring-2 ring-pink-500/30'
                    : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/10 hover:border-purple-400/40 text-slate-200 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5 pr-2">
                  <span
                    className={`w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                        : 'bg-white/10 text-slate-300 group-hover:bg-purple-500/30 group-hover:text-purple-200'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className={`text-sm sm:text-base font-medium ${isSelected ? 'text-white font-semibold' : ''}`}>
                    {option}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'border-pink-400 bg-pink-500 text-white scale-110'
                      : 'border-white/20 group-hover:border-purple-400/50'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
