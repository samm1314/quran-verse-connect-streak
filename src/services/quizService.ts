import { Quiz, QuizQuestion } from '@/types/user';

interface QuizGenerationRequest {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
}

export class QuizService {
  static async generateQuiz({ topic, difficulty, questionCount }: QuizGenerationRequest): Promise<Quiz> {
    // In production, this would call OpenAI API via Supabase Edge Function
    
    const prompt = `
Create a quiz about "${topic}" from an Islamic/Quranic perspective with ${questionCount} questions.
Difficulty: ${difficulty}

For each question:
1. Create a thoughtful question about the topic
2. Provide 4 multiple choice options (A, B, C, D)
3. Include the correct answer
4. Add a brief explanation citing relevant Quranic verses
5. Include the Arabic verse and English translation when relevant

Focus on connecting the topic to Quranic teachings and Islamic wisdom.
Ensure questions are educational and promote understanding.
`;

    // Mock quiz generation - replace with actual OpenAI API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockQuizzes: Record<string, Quiz> = {
      'water': {
        id: Date.now().toString(),
        title: 'Water in the Quran',
        description: 'Explore what the Quran teaches about water and its importance',
        difficulty,
        category: 'Science & Quran',
        points: questionCount * 10,
        createdAt: new Date().toISOString(),
        questions: [
          {
            id: '1',
            question: 'According to the Quran, what is made from water?',
            options: [
              'Only plants',
              'Only animals',
              'Every living thing',
              'Only humans'
            ],
            correctAnswer: 2,
            explanation: 'Allah says in Surah Al-Anbiya (21:30): "And We made from water every living thing."',
            verse: {
              arabic: 'وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ',
              translation: 'And We made from water every living thing',
              reference: 'Al-Anbiya 21:30'
            },
            points: 10
          },
          {
            id: '2',
            question: 'What does the Quran say about rain from the sky?',
            options: [
              'It is pure water',
              'It is salty water',
              'It is contaminated',
              'It is just ordinary water'
            ],
            correctAnswer: 0,
            explanation: 'Allah describes rain as "pure water" (ma\'an tahuran) in Surah Al-Furqan.',
            verse: {
              arabic: 'وَأَنزَلْنَا مِنَ السَّمَاءِ مَاءً طَهُورًا',
              translation: 'And We send down from the sky pure water',
              reference: 'Al-Furqan 25:48'
            },
            points: 10
          }
        ]
      },
      'mountains': {
        id: Date.now().toString(),
        title: 'Mountains in Islamic Perspective',
        description: 'Learn about the Quranic view of mountains and their purpose',
        difficulty,
        category: 'Geography & Quran',
        points: questionCount * 10,
        createdAt: new Date().toISOString(),
        questions: [
          {
            id: '1',
            question: 'What does the Quran say about the function of mountains?',
            options: [
              'They are just decorations',
              'They stabilize the earth',
              'They block the view',
              'They have no purpose'
            ],
            correctAnswer: 1,
            explanation: 'The Quran describes mountains as "stakes" or "pegs" that stabilize the earth.',
            verse: {
              arabic: 'وَالْجِبَالَ أَوْتَادًا',
              translation: 'And the mountains as stakes',
              reference: 'An-Naba 78:7'
            },
            points: 10
          }
        ]
      }
    };

    const baseQuiz = mockQuizzes[topic.toLowerCase()] || mockQuizzes['water'];
    
    return {
      ...baseQuiz,
      id: Date.now().toString(),
      difficulty,
      questions: baseQuiz.questions.slice(0, questionCount)
    };
  }

  static async getRandomQuiz(): Promise<Quiz> {
    const topics = ['water', 'mountains', 'astronomy', 'embryology'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    return this.generateQuiz({
      topic: randomTopic,
      difficulty: 'medium',
      questionCount: 5
    });
  }

  static async getDailyQuiz(): Promise<Quiz> {
    // Generate a daily quiz based on the current date
    const today = new Date().toDateString();
    const topics = ['science', 'history', 'morality', 'worship'];
    const topicIndex = new Date().getDate() % topics.length;
    
    return this.generateQuiz({
      topic: topics[topicIndex],
      difficulty: 'medium',
      questionCount: 3
    });
  }
}