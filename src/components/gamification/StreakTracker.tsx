import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Flame, Calendar, Target, Trophy } from 'lucide-react';

export const StreakTracker = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getDaysInWeek = () => {
    const today = new Date();
    const days = [];
    
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      
      const isToday = day.toDateString() === today.toDateString();
      const isPast = day < today;
      const hasActivity = isPast || isToday; // Mock: assume user has been active on past days
      
      days.push({
        date: day,
        day: day.toLocaleDateString('en', { weekday: 'short' }),
        dayNum: day.getDate(),
        isToday,
        isPast,
        hasActivity: hasActivity && day.getDate() <= today.getDate()
      });
    }
    
    return days;
  };

  const weekDays = getDaysInWeek();
  const weeklyGoal = 7; // Complete activity 7 days
  const weeklyProgress = weekDays.filter(d => d.hasActivity).length;
  const progressPercentage = (weeklyProgress / weeklyGoal) * 100;

  const getStreakMessage = () => {
    if (user.currentStreak === 0) {
      return "Start your learning streak today!";
    } else if (user.currentStreak < 7) {
      return `Great start! Keep going to reach a week.`;
    } else if (user.currentStreak < 30) {
      return `Amazing consistency! You're building a strong habit.`;
    } else {
      return `Incredible dedication! You're a true scholar.`;
    }
  };

  const getNextMilestone = () => {
    if (user.currentStreak < 7) return 7;
    if (user.currentStreak < 30) return 30;
    if (user.currentStreak < 100) return 100;
    if (user.currentStreak < 365) return 365;
    return Math.ceil(user.currentStreak / 100) * 100;
  };

  const nextMilestone = getNextMilestone();
  const milestoneProgress = (user.currentStreak / nextMilestone) * 100;

  return (
    <div className="space-y-6">
      {/* Current Streak */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-6 h-6" />
            Learning Streak
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {getStreakMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{user.currentStreak}</div>
              <div className="text-sm opacity-80">Days in a row</div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                Best: {user.longestStreak} days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Week
          </CardTitle>
          <CardDescription>
            Stay consistent to maintain your streak
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Weekly Goal</span>
            <span className="text-sm text-muted-foreground">
              {weeklyProgress}/{weeklyGoal} days
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="grid grid-cols-7 gap-2 mt-4">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  {day.day}
                </div>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    day.hasActivity 
                      ? 'bg-gradient-primary text-primary-foreground shadow-medium' 
                      : day.isToday 
                        ? 'bg-accent border-2 border-primary text-primary' 
                        : 'bg-accent/30 text-muted-foreground'
                  }`}
                >
                  {day.hasActivity ? (
                    <Flame className="w-4 h-4" />
                  ) : (
                    day.dayNum
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestone Progress */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Next Milestone
          </CardTitle>
          <CardDescription>
            Keep going to reach {nextMilestone} days!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress to {nextMilestone} days</span>
            <span className="text-sm text-muted-foreground">
              {user.currentStreak}/{nextMilestone}
            </span>
          </div>
          <Progress value={milestoneProgress} className="h-3" />
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {nextMilestone - user.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">days to go</div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Benefits */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Streak Benefits
          </CardTitle>
          <CardDescription>
            Rewards for maintaining your streak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 font-bold">7</span>
                </div>
                <div>
                  <div className="font-semibold">Weekly Warrior</div>
                  <div className="text-xs text-muted-foreground">+10% bonus points</div>
                </div>
              </div>
              <Badge variant={user.currentStreak >= 7 ? "default" : "outline"}>
                {user.currentStreak >= 7 ? "Unlocked" : "Locked"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-bold">30</span>
                </div>
                <div>
                  <div className="font-semibold">Monthly Master</div>
                  <div className="text-xs text-muted-foreground">Exclusive badge + 25% bonus</div>
                </div>
              </div>
              <Badge variant={user.currentStreak >= 30 ? "default" : "outline"}>
                {user.currentStreak >= 30 ? "Unlocked" : "Locked"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-300 font-bold">100</span>
                </div>
                <div>
                  <div className="font-semibold">Century Scholar</div>
                  <div className="text-xs text-muted-foreground">Legendary status + special features</div>
                </div>
              </div>
              <Badge variant={user.currentStreak >= 100 ? "default" : "outline"}>
                {user.currentStreak >= 100 ? "Unlocked" : "Locked"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};