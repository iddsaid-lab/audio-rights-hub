
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { mockLogin, mockUsers } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('audioRightsUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Verify this user still exists in our "database"
        const existingUser = mockUsers.find(u => u.id === parsedUser.id);
        if (existingUser) {
          setUser(existingUser);
        } else {
          localStorage.removeItem('audioRightsUser');
        }
      } catch (e) {
        localStorage.removeItem('audioRightsUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loggedInUser = mockLogin(email, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('audioRightsUser', JSON.stringify(loggedInUser));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${loggedInUser.fullName}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('audioRightsUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
