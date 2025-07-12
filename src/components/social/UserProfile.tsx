import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User } from '@/types/user';
import { Trophy, Flame, Calendar, Star, Award, Users } from 'lucide-react';

interface UserProfileProps {
  user: User;
  showStats?: boolean;
}

export const UserProfile = ({ user, showStats = true }: UserProfileProps) => {
  const getLevel = (points: number) => Math.floor(points / 100) + 1;
  const getPointsToNextLevel = (points: number) => 100 - (points % 100);
  const getLevelProgress = (points: number) => (points % 100);

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="gap-1">
                  <Trophy className="w-3 h-3" />
                  Level {user.level}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Flame className="w-3 h-3" />
                  {user.currentStreak} day streak
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        {showStats && (
          <CardContent className="space-y-4">
            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level Progress</span>
                <span>{getLevelProgress(user.totalPoints)}/100 XP</span>
              </div>
              <Progress value={getLevelProgress(user.totalPoints)} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {getPointsToNextLevel(user.totalPoints)} XP to level {user.level + 1}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-accent/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">{user.totalPoints}</div>
                <div className="text-xs text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center bg-accent/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-500">{user.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center bg-accent/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-500">{user.longestStreak}</div>
                <div className="text-xs text-muted-foreground">Longest Streak</div>
              </div>
              <div className="text-center bg-accent/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-500">{user.friends.length}</div>
                <div className="text-xs text-muted-foreground">Friends</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Badges */}
      {user.badges.length > 0 && (
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badges ({user.badges.length})
            </CardTitle>
            <CardDescription>
              Achievements you've unlocked on your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg"
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{badge.name}</span>
                      <Badge className={getBadgeRarityColor(badge.rarity)}>
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(badge.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Member Since */}
      <Card className="bg-gradient-card shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              Member since {new Date(user.joinedDate).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};