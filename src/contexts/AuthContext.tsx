import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo - in production, this would connect to Supabase
const mockUsers: User[] = [
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
    badges: [
      {
        id: 'first_quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🌟',
        unlockedAt: '2024-01-15',
        rarity: 'common'
      },
      {
        id: 'week_streak',
        name: 'Consistent Learner',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlockedAt: '2024-01-22',
        rarity: 'rare'
      }
    ],
    friends: ['2', '3'],
    friendRequests: {
      sent: [],
      received: []
    }
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('quranverse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('quranverse_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      level: 1,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString(),
      joinedDate: new Date().toISOString(),
      badges: [],
      friends: [],
      friendRequests: {
        sent: [],
        received: []
      }
    };
    
    setUser(newUser);
    localStorage.setItem('quranverse_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quranverse_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('quranverse_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};