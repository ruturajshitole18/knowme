export function getQuizUrl(slug: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://knowme.app';
  return `${origin}/quiz/${slug}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-https
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

export function getWhatsAppShareUrl(creatorName: string, slug: string): string {
  const quizUrl = getQuizUrl(slug);
  const message = `Think you know me? Prove it! Take my KnowMe quiz and see how well you actually know me: ${quizUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

export function getTwitterShareUrl(creatorName: string, slug: string): string {
  const quizUrl = getQuizUrl(slug);
  const message = `Think you know ${creatorName}? Prove it on KnowMe! Take the quiz:`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(quizUrl)}`;
}

export async function shareQuiz(creatorName: string, slug: string): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const quizUrl = getQuizUrl(slug);
  const shareData = {
    title: `${creatorName}'s KnowMe Quiz`,
    text: `Think you know me? Prove it! Take my KnowMe quiz:`,
    url: quizUrl,
  };

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const copied = await copyToClipboard(quizUrl);
        return { success: copied, method: 'clipboard' };
      }
      return { success: false, method: 'native' };
    }
  }

  const copied = await copyToClipboard(quizUrl);
  return { success: copied, method: 'clipboard' };
}

export async function shareQuizResult(
  creatorName: string,
  score: number,
  totalQuestions: number,
  slug: string
): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const quizUrl = getQuizUrl(slug);
  const text = `I scored ${score}/${totalQuestions} on ${creatorName}'s KnowMe quiz! Can you beat my score?`;

  const shareData = {
    title: `KnowMe Quiz Result`,
    text: text,
    url: quizUrl,
  };

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const copied = await copyToClipboard(`${text} ${quizUrl}`);
        return { success: copied, method: 'clipboard' };
      }
      return { success: false, method: 'native' };
    }
  }

  const copied = await copyToClipboard(`${text} ${quizUrl}`);
  return { success: copied, method: 'clipboard' };
}
