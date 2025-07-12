import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Friend, User } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Search, Flame, Trophy, Clock } from 'lucide-react';

interface FriendsListProps {
  onSelectFriend?: (friend: Friend) => void;
}

export const FriendsList = ({ onSelectFriend }: FriendsListProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  // Mock friends data - in production, this would come from the database
  const mockFriends: Friend[] = [
    {
      id: '2',
      username: 'Fatima',
      level: 12,
      currentStreak: 5,
      lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      status: 'online'
    },
    {
      id: '3',
      username: 'Omar',
      level: 8,
      currentStreak: 12,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      status: 'away'
    },
    {
      id: '4',
      username: 'Aisha',
      level: 20,
      currentStreak: 25,
      lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      status: 'offline'
    }
  ];

  const mockUsers: User[] = [
    {
      id: '5',
      username: 'Yusuf',
      email: 'yusuf@example.com',
      level: 6,
      totalPoints: 580,
      currentStreak: 3,
      longestStreak: 8,
      lastActivityDate: new Date().toISOString(),
      joinedDate: '2024-02-01',
      badges: [],
      friends: [],
      friendRequests: { sent: [], received: [] }
    },
    {
      id: '6',
      username: 'Zeinab',
      email: 'zeinab@example.com',
      level: 14,
      totalPoints: 1340,
      currentStreak: 9,
      longestStreak: 15,
      lastActivityDate: new Date().toISOString(),
      joinedDate: '2024-01-20',
      badges: [],
      friends: [],
      friendRequests: { sent: [], received: [] }
    }
  ];

  useEffect(() => {
    if (user) {
      // Load user's friends
      const userFriends = mockFriends.filter(friend => 
        user.friends.includes(friend.id)
      );
      setFriends(userFriends);
    }
  }, [user]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      // Simulate API search
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = mockUsers.filter(u => 
        u.username.toLowerCase().includes(query.toLowerCase()) &&
        u.id !== user?.id &&
        !user?.friends.includes(u.id)
      );
      
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendRequest = async (targetUserId: string) => {
    if (!user) return;

    const targetUser = mockUsers.find(u => u.id === targetUserId);
    if (!targetUser) return;

    // Update user's sent requests
    updateUser({
      friendRequests: {
        ...user.friendRequests,
        sent: [...user.friendRequests.sent, targetUserId]
      }
    });

    toast({
      title: 'Friend request sent!',
      description: `Your friend request has been sent to ${targetUser.username}`,
    });

    // Remove from search results
    setSearchResults(prev => prev.filter(u => u.id !== targetUserId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getLastSeenText = (lastSeen: string) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / (24 * 60))}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Search for Friends */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Find Friends
          </CardTitle>
          <CardDescription>
            Search for other learners to connect with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {isSearching && (
            <div className="text-center text-muted-foreground">
              Searching...
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((searchUser) => (
                <div
                  key={searchUser.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {searchUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{searchUser.username}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline">
                          Level {searchUser.level}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {searchUser.currentStreak}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => sendFriendRequest(searchUser.id)}
                    disabled={user?.friendRequests.sent.includes(searchUser.id)}
                  >
                    {user?.friendRequests.sent.includes(searchUser.id) ? 'Sent' : 'Add Friend'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Friends List */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Friends ({friends.length})
          </CardTitle>
          <CardDescription>
            Connect with friends and see their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No friends yet</p>
              <p className="text-sm">Search for users above to start building your learning community!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onSelectFriend?.(friend)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div 
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(friend.status)}`}
                      />
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {friend.username}
                        <Badge variant="outline">
                          Level {friend.level}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {friend.currentStreak} day streak
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getLastSeenText(friend.lastSeen)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Challenge
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};