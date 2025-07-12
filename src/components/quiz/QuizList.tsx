import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quiz } from '@/types/user';
import { QuizService } from '@/services/quizService';
import { Clock, Trophy, BookOpen, Sparkles, Calendar, Zap } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface QuizListProps {
  onSelectQuiz: (quiz: Quiz) => void;
}

export const QuizList = ({ onSelectQuiz }: QuizListProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [dailyQuiz, setDailyQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      // Load daily quiz
      const daily = await QuizService.getDailyQuiz();
      setDailyQuiz(daily);

      // Generate some sample quizzes
      const topics = [
        { topic: 'water', difficulty: 'easy' as const },
        { topic: 'mountains', difficulty: 'medium' as const },
        { topic: 'astronomy', difficulty: 'hard' as const },
        { topic: 'embryology', difficulty: 'medium' as const },
      ];

      const generatedQuizzes = await Promise.all(
        topics.map(({ topic, difficulty }) =>
          QuizService.generateQuiz({ topic, difficulty, questionCount: 5 })
        )
      );

      setQuizzes(generatedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading quizzes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Quiz Highlight */}
      {dailyQuiz && (
        <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <CardTitle>Daily Quiz</CardTitle>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                Today
              </Badge>
            </div>
            <CardDescription className="text-primary-foreground/80">
              {dailyQuiz.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  5 min
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {dailyQuiz.points} pts
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {dailyQuiz.questions.length} questions
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => onSelectQuiz(dailyQuiz)}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Daily Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regular Quizzes */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Available Quizzes
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {quiz.description}
                    </CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(quiz.difficulty)}>
                    {quiz.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {quiz.questions.length} questions
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.ceil((quiz.timeLimit || 300) / 60)} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {quiz.points} pts
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onSelectQuiz(quiz)}
                    className="w-full bg-gradient-primary hover:bg-primary-hover shadow-medium"
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};