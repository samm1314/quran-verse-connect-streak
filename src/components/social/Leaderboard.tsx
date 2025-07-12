import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardEntry } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Medal, Crown, Flame, Calendar, Star } from 'lucide-react';

export const Leaderboard = () => {
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  const { user } = useAuth();

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    // Mock leaderboard data - in production, this would come from the database
    const mockUsers = [
      {
        id: '1',
        username: 'Ahmad',
        email: 'ahmad@example.com',
        level: 15,
        totalPoints: 2450,
        currentStreak: 7,
        longestStreak: 15,
        lastActivityDate: new Date().toISOString(),
        joinedDate: '2024-01-15',
        badges: [],
        friends: [],
        friendRequests: { sent: [], received: [] }
      },
      {
        id: '4',
        username: 'Aisha',
        email: 'aisha@example.com',
        level: 20,
        totalPoints: 3200,
        currentStreak: 25,
        longestStreak: 30,
        lastActivityDate: new Date().toISOString(),
        joinedDate: '2024-01-10',
        badges: [],
        friends: [],
        friendRequests: { sent: [], received: [] }
      },
      {
        id: '3',
        username: 'Omar',
        email: 'omar@example.com',
        level: 8,
        totalPoints: 1200,
        currentStreak: 12,
        longestStreak: 20,
        lastActivityDate: new Date().toISOString(),
        joinedDate: '2024-02-01',
        badges: [],
        friends: [],
        friendRequests: { sent: [], received: [] }
      },
      {
        id: '2',
        username: 'Fatima',
        email: 'fatima@example.com',
        level: 12,
        totalPoints: 1800,
        currentStreak: 5,
        longestStreak: 15,
        lastActivityDate: new Date().toISOString(),
        joinedDate: '2024-01-20',
        badges: [],
        friends: [],
        friendRequests: { sent: [], received: [] }
      }
    ];

    // Sort by total points for all-time
    const allTimeSorted = mockUsers
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        user,
        rank: index + 1,
        points: user.totalPoints,
        streak: user.currentStreak
      }));

    // Mock weekly/monthly data (in production, calculate from activity within timeframe)
    const weeklySorted = [...mockUsers]
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .map((user, index) => ({
        user,
        rank: index + 1,
        points: Math.floor(user.totalPoints * 0.3), // Mock weekly points
        streak: user.currentStreak
      }));

    const monthlySorted = [...mockUsers]
      .sort((a, b) => (b.totalPoints + b.currentStreak * 10) - (a.totalPoints + a.currentStreak * 10))
      .map((user, index) => ({
        user,
        rank: index + 1,
        points: Math.floor(user.totalPoints * 0.7), // Mock monthly points
        streak: user.currentStreak
      }));

    setAllTimeLeaderboard(allTimeSorted);
    setWeeklyLeaderboard(weeklySorted);
    setMonthlyLeaderboard(monthlySorted);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 2:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 3:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const LeaderboardList = ({ entries }: { entries: LeaderboardEntry[] }) => (
    <div className="space-y-3">
      {entries.map((entry) => {
        const isCurrentUser = entry.user.id === user?.id;
        
        return (
          <Card
            key={entry.user.id}
            className={`transition-all duration-300 ${
              isCurrentUser 
                ? 'bg-gradient-primary/10 border-primary shadow-glow' 
                : 'bg-gradient-card shadow-soft hover:shadow-medium'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                  <Badge className={getRankBadgeColor(entry.rank)}>
                    #{entry.rank}
                  </Badge>
                </div>
                
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  {entry.user.username.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{entry.user.username}</span>
                    {isCurrentUser && (
                      <Badge variant="secondary">You</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Level {entry.user.level}
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <Trophy className="w-4 h-4" />
                    {entry.points.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-orange-500 text-sm">
                    <Flame className="w-3 h-3" />
                    {entry.streak} day streak
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          See how you rank among other learners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly" className="gap-1">
              <Calendar className="w-4 h-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-1">
              <Star className="w-4 h-4" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="alltime" className="gap-1">
              <Crown className="w-4 h-4" />
              All Time
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">This Week's Champions</h3>
                <p className="text-sm text-muted-foreground">Based on consistency and daily activity</p>
              </div>
              <LeaderboardList entries={weeklyLeaderboard} />
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">Monthly Leaders</h3>
                <p className="text-sm text-muted-foreground">Top performers this month</p>
              </div>
              <LeaderboardList entries={monthlyLeaderboard} />
            </div>
          </TabsContent>
          
          <TabsContent value="alltime" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">Hall of Fame</h3>
                <p className="text-sm text-muted-foreground">The greatest learners of all time</p>
              </div>
              <LeaderboardList entries={allTimeLeaderboard} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};