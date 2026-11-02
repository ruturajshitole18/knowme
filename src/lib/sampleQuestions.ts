import { QuestionType } from '../types';

export interface SampleQuestionItem {
  id: string;
  category: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  default_correct_answer: string;
}

export const SAMPLE_QUESTIONS: SampleQuestionItem[] = [
  // Short Answer Questions (No options, 1-2 lines in friend's words)
  {
    id: 'sq-sa-1',
    category: 'Short Answer (No Options)',
    question_text: 'Describe my personality or energy in 2 or 3 words.',
    question_type: 'short_answer',
    options: [],
    default_correct_answer: 'Kind, funny, and ambitious',
  },
  {
    id: 'sq-sa-2',
    category: 'Short Answer (No Options)',
    question_text: 'What is our funniest or best memory together? (1–2 lines)',
    question_type: 'short_answer',
    options: [],
    default_correct_answer: 'Our late night road trip and laughing uncontrollably',
  },
  {
    id: 'sq-sa-3',
    category: 'Short Answer (No Options)',
    question_text: 'What is a secret talent or weird habit of mine?',
    question_type: 'short_answer',
    options: [],
    default_correct_answer: 'Singing every lyric dramatically in the car',
  },
  {
    id: 'sq-sa-4',
    category: 'Short Answer (No Options)',
    question_text: 'What is a nickname that only you call me?',
    question_type: 'short_answer',
    options: [],
    default_correct_answer: 'Bestie',
  },

  // Multiple Choice Questions
  {
    id: 'sq-1',
    category: 'Favorites',
    question_text: 'What is my favourite food?',
    question_type: 'multiple_choice',
    options: ['Pizza', 'Burgers & Fries', 'Sushi', 'Biryani / Spicy Curry'],
    default_correct_answer: 'Pizza',
  },
  {
    id: 'sq-2',
    category: 'Career & Ambition',
    question_text: 'What is my dream job?',
    question_type: 'multiple_choice',
    options: ['Tech Founder / CEO', 'Creative Designer / Artist', 'Travel Influencer', 'AI Researcher / Scientist'],
    default_correct_answer: 'Tech Founder / CEO',
  },
  {
    id: 'sq-3',
    category: 'Travel & Dreams',
    question_text: 'Which city would I love to visit the most?',
    question_type: 'multiple_choice',
    options: ['Tokyo, Japan', 'Paris, France', 'New York City, USA', 'Reykjavik, Iceland'],
    default_correct_answer: 'Tokyo, Japan',
  },
  {
    id: 'sq-4',
    category: 'Secrets & Fears',
    question_text: 'What is my biggest fear?',
    question_type: 'multiple_choice',
    options: ['Spiders & Insects', 'Heights / Flying', 'FOMO & Being alone', 'Public Speaking'],
    default_correct_answer: 'Heights / Flying',
  },
  {
    id: 'sq-5',
    category: 'Entertainment',
    question_text: 'What is my favourite movie genre or film?',
    question_type: 'multiple_choice',
    options: ['Sci-Fi (Interstellar / Matrix)', 'Mind-bending Thriller', 'Classic Comedy', 'Action & Marvel Heroes'],
    default_correct_answer: 'Sci-Fi (Interstellar / Matrix)',
  },
  {
    id: 'sq-6',
    category: 'Daily Life',
    question_text: 'What is my favourite hobby to unwind?',
    question_type: 'multiple_choice',
    options: ['Gaming until 2 AM', 'Binge-watching shows', 'Cooking or baking', 'Listening to music on loop'],
    default_correct_answer: 'Gaming until 2 AM',
  },
  {
    id: 'sq-7',
    category: 'Personality',
    question_text: 'What is my most-used catchphrase or reaction?',
    question_type: 'multiple_choice',
    options: ['"Literally!"', '"No way, are you serious?"', '"I need coffee right now."', '"It is what it is."'],
    default_correct_answer: '"It is what it is."',
  },
  {
    id: 'sq-8',
    category: 'Personality',
    question_text: 'What instantly makes me happy?',
    question_type: 'multiple_choice',
    options: ['Good food with friends', 'A long road trip with music', 'Buying something new online', 'Canceling plans and staying home'],
    default_correct_answer: 'Good food with friends',
  },
  {
    id: 'sq-9',
    category: 'Career & Ambition',
    question_text: 'What is my dream company to work at or build?',
    question_type: 'multiple_choice',
    options: ['Google / DeepMind', 'Apple', 'SpaceX / Tesla', 'My own startup'],
    default_correct_answer: 'Google / DeepMind',
  },
  {
    id: 'sq-10',
    category: 'Favorites',
    question_text: 'What was my favourite subject back in school?',
    question_type: 'multiple_choice',
    options: ['Computer Science', 'Mathematics', 'Literature / English', 'Science / Physics'],
    default_correct_answer: 'Computer Science',
  },
  {
    id: 'sq-11',
    category: 'True / False',
    question_text: 'Am I a morning person?',
    question_type: 'true_false',
    options: ['True', 'False'],
    default_correct_answer: 'False',
  },
  {
    id: 'sq-12',
    category: 'True / False',
    question_text: 'I prefer texting over making phone calls.',
    question_type: 'true_false',
    options: ['True', 'False'],
    default_correct_answer: 'True',
  },
  {
    id: 'sq-13',
    category: 'Daily Life',
    question_text: 'What is my go-to beverage of choice?',
    question_type: 'multiple_choice',
    options: ['Iced Caramel Latte', 'Matcha Green Tea', 'Boba / Milk Tea', 'Chilled Soda / Energy Drink'],
    default_correct_answer: 'Iced Caramel Latte',
  },
  {
    id: 'sq-14',
    category: 'Friendship',
    question_text: 'How do I handle arguments with friends?',
    question_type: 'multiple_choice',
    options: ['Talk it out immediately', 'Need 24 hours of space first', 'Send a funny meme to break tension', 'Pretend nothing happened'],
    default_correct_answer: 'Need 24 hours of space first',
  },
];
