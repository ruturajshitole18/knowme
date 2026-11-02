import React from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Award, RefreshCw, Clock, UserCheck, ShieldAlert } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  highlightSubmissionId?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  isPrivate?: boolean;
  isOwner?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  highlightSubmissionId,
  onRefresh,
  isLoading = false,
  isPrivate = false,
  isOwner = false,
}) => {
  if (isPrivate && !isOwner) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-white/10 text-center max-w-lg mx-auto space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Private Leaderboard</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The creator has set this quiz's leaderboard to private. Only the quiz creator can view participant scores.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full glass-card rounded-2xl p-5 sm:p-7 border border-white/10 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Leaderboard</h3>
            <p className="text-xs text-purple-300">
              {entries.length} {entries.length === 1 ? 'participant' : 'participants'}
            </p>
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            title="Refresh Leaderboard"
            aria-label="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
          </button>
        )}
      </div>

      {/* Leaderboard Table / Cards */}
      {entries.length === 0 ? (
        <div className="text-center py-10 space-y-2 border border-dashed border-white/10 rounded-xl p-6">
          <p className="text-base font-semibold text-slate-300">No scores yet!</p>
          <p className="text-xs text-slate-400">
            Be the very first friend to take the quiz and claim the #1 spot on the podium!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry, index) => {
            const isHighlight = highlightSubmissionId === entry.id;
            const rank = entry.rank || index + 1;
            const isFirst = rank === 1;
            const isSecond = rank === 2;
            const isThird = rank === 3;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
                  isHighlight
                    ? 'bg-gradient-to-r from-purple-900/50 via-pink-900/40 to-purple-900/50 border-pink-500/70 shadow-glow-pink ring-1 ring-pink-500/30 scale-[1.01]'
                    : isFirst
                    ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/40 shadow-sm'
                    : isSecond
                    ? 'bg-gradient-to-r from-slate-400/10 to-transparent border-slate-400/30'
                    : isThird
                    ? 'bg-gradient-to-r from-amber-700/10 to-transparent border-amber-700/30'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                }`}
              >
                {/* Left: Rank & Participant */}
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  {/* Rank Badge */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    {isFirst ? (
                      <span className="w-full h-full rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-500 text-amber-950 flex items-center justify-center shadow-sm">
                        <Trophy className="w-4 h-4 fill-amber-950" />
                      </span>
                    ) : isSecond ? (
                      <span className="w-full h-full rounded-lg bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-900 flex items-center justify-center shadow-sm">
                        <Medal className="w-4 h-4" />
                      </span>
                    ) : isThird ? (
                      <span className="w-full h-full rounded-lg bg-gradient-to-tr from-amber-600 to-orange-700 text-amber-100 flex items-center justify-center shadow-sm">
                        <Award className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">#{rank}</span>
                    )}
                  </div>

                  {/* Name and submission time */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${isHighlight ? 'text-pink-300' : 'text-white'}`}>
                        {entry.participant_name}
                      </p>
                      {entry.anonymous && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-normal">
                          anon
                        </span>
                      )}
                      {isHighlight && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-0.5">
                      <Clock className="w-3 h-3 opacity-60" />
                      <span>{formatDate(entry.submitted_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score & Percentage */}
                <div className="text-right flex-shrink-0">
                  <p className="text-base sm:text-lg font-black bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    {entry.score}/{entry.total_questions}
                  </p>
                  <p className="text-xs font-bold text-pink-400">{entry.percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
