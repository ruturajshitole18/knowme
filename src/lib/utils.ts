import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(prefix: string = 'quiz'): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let randomPart = '';
  for (let i = 0; i < 7; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const cleanPrefix = prefix
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 15);
  return cleanPrefix ? `${cleanPrefix}-${randomPart}` : randomPart;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export interface ScoreCategory {
  title: string;
  message: string;
  badge: string;
  colorClass: string;
}

export function getScoreMessage(score: number, total: number): ScoreCategory {
  if (total <= 0) {
    return {
      title: "Quiz Completed!",
      message: "Thanks for taking the quiz!",
      badge: "🎉",
      colorClass: "from-blue-500 to-indigo-500",
    };
  }

  const percentage = Math.round((score / total) * 100);

  if (percentage >= 90) {
    return {
      title: "Best Friend Material!",
      message: "You know them inside out. A true soulmate!",
      badge: "👑",
      colorClass: "from-purple-500 via-pink-500 to-amber-400",
    };
  } else if (percentage >= 70) {
    return {
      title: "Pretty Close!",
      message: "You definitely pay attention. Almost in the inner circle!",
      badge: "✨",
      colorClass: "from-purple-500 to-pink-500",
    };
  } else if (percentage >= 50) {
    return {
      title: "Not Bad!",
      message: "There is still a lot to learn, but you're on the right track.",
      badge: "🤝",
      colorClass: "from-blue-500 to-indigo-500",
    };
  } else if (percentage >= 30) {
    return {
      title: "Just Acquaintances?",
      message: "Time to talk more and hang out!",
      badge: "👀",
      colorClass: "from-amber-500 to-orange-500",
    };
  } else {
    return {
      title: "Do You Even Know This Person?",
      message: "Were you guessing with your eyes closed?",
      badge: "💀",
      colorClass: "from-red-500 to-pink-600",
    };
  }
}
