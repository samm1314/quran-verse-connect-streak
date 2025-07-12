import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ChatInterface } from '@/components/ChatInterface';
import { QuizList } from '@/components/quiz/QuizList';
import { QuizCard } from '@/components/quiz/QuizCard';
import { UserProfile } from '@/components/social/UserProfile';
import { FriendsList } from '@/components/social/FriendsList';
import { Leaderboard } from '@/components/social/Leaderboard';
import { StreakTracker } from '@/components/gamification/StreakTracker';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Quiz, QuizAnswer } from '@/types/user';
import { 
  MessageSquare, 
  Brain, 
  User, 
  Users, 
  Trophy, 
  Flame,
  LogOut,
  Book
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [activeTab, setActiveTab] = useState('chat');

  const handleQuizComplete = (score: number, answers: QuizAnswer[]) => {
    console.log('Quiz completed:', { score, answers });
    setCurrentQuiz(null);
    setActiveTab('profile'); // Show updated profile after quiz
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <Book className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              QuranVerse.ai
            </h1>
            <p className="text-muted-foreground">
              Discover Quranic wisdom through AI-powered learning
            </p>
          </div>
          <Button 
            onClick={() => setShowAuthDialog(true)}
            className="bg-gradient-primary hover:bg-primary-hover shadow-medium"
          >
            Get Started
          </Button>
        </div>
        
        <AuthDialog 
          isOpen={showAuthDialog} 
          onClose={() => setShowAuthDialog(false)} 
        />
      </div>
    );
  }

  // Show quiz interface when a quiz is selected
  if (currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-background p-4">
        <div className="container mx-auto max-w-4xl py-6">
          <QuizCard 
            quiz={currentQuiz} 
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  QuranVerse.ai
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.username}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">{user.currentStreak}</span>
                <span className="text-muted-foreground">day streak</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2">
              <Brain className="w-4 h-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="streak" className="gap-2">
              <Flame className="w-4 h-4" />
              Streak
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="friends" className="gap-2">
              <Users className="w-4 h-4" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-0">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="quiz" className="mt-0">
            <QuizList onSelectQuiz={setCurrentQuiz} />
          </TabsContent>

          <TabsContent value="streak" className="mt-0">
            <StreakTracker />
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <UserProfile user={user} />
          </TabsContent>

          <TabsContent value="friends" className="mt-0">
            <FriendsList />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;