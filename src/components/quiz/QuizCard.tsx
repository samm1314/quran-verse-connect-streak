import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Quiz, QuizQuestion, QuizAnswer } from '@/types/user';
import { Clock, Award, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface QuizCardProps {
  quiz: Quiz;
  onComplete: (score: number, answers: QuizAnswer[]) => void;
}

export const QuizCard = ({ quiz, onComplete }: QuizCardProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 300); // 5 minutes default
  const [isFinished, setIsFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isFinished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinishQuiz();
    }
  }, [timeLeft, isFinished]);

  const handleAnswerSelect = (questionId: string, selectedAnswer: number) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) return;

    const answer: QuizAnswer = {
      questionId,
      selectedAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
      timeSpent: (quiz.timeLimit || 300) - timeLeft
    };

    setSelectedAnswers(prev => [
      ...prev.filter(a => a.questionId !== questionId),
      answer
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setIsFinished(true);
    setShowResults(true);
    
    const correctAnswers = selectedAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    // Update user progress
    if (user) {
      const pointsEarned = selectedAnswers.reduce((total, answer) => {
        if (answer.isCorrect) {
          const question = quiz.questions.find(q => q.id === answer.questionId);
          return total + (question?.points || 0);
        }
        return total;
      }, 0);

      updateUser({
        totalPoints: user.totalPoints + pointsEarned,
        currentStreak: user.currentStreak + 1
      });

      toast({
        title: 'Quiz completed!',
        description: `You scored ${score}% and earned ${pointsEarned} points!`,
      });
    }
    
    onComplete(score, selectedAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (showResults) {
    const correctAnswers = selectedAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    return (
      <Card className="max-w-2xl mx-auto bg-gradient-card shadow-soft">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          <CardDescription>
            You scored {correctAnswers} out of {quiz.questions.length} questions correctly
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {score}%
            </div>
            <p className="text-muted-foreground">Final Score</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-accent/50 rounded-lg p-3">
              <div className="font-semibold">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="bg-accent/50 rounded-lg p-3">
              <div className="font-semibold">{quiz.questions.length - correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers.find(a => a.questionId === question.id);
              const isCorrect = userAnswer?.isCorrect || false;
              
              return (
                <div key={question.id} className="border rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                      {question.explanation && (
                        <p className="text-sm bg-accent/50 rounded p-2 mt-2">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-gradient-card shadow-soft">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {quiz.title}
            </CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="secondary">
              {quiz.difficulty}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{currentQ.question}</h3>
          
          {currentQ.verse && (
            <Card className="bg-accent/30 border-primary/20">
              <CardContent className="pt-4">
                <div className="text-right mb-2">
                  <p className="text-lg font-arabic">{currentQ.verse.arabic}</p>
                </div>
                <p className="text-sm italic">{currentQ.verse.translation}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  - {currentQ.verse.reference}
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const selectedAnswer = selectedAnswers.find(a => a.questionId === currentQ.id);
              const isSelected = selectedAnswer?.selectedAnswer === index;
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto ${
                    isSelected ? 'bg-gradient-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => handleAnswerSelect(currentQ.id, index)}
                >
                  <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center mr-3 text-xs font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNextQuestion}
            disabled={!selectedAnswers.find(a => a.questionId === currentQ.id)}
            className="bg-gradient-primary hover:bg-primary-hover"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};