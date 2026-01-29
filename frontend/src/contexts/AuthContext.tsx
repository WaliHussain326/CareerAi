import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, onboardingAPI, type User as APIUser } from "../services/api";
import { toast } from "../hooks/use-toast";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const apiUser = response.data;
      
      // Check if user has completed onboarding
      let hasCompletedOnboarding = false;
      try {
        await onboardingAPI.get();
        hasCompletedOnboarding = true;
      } catch (error) {
        // Onboarding not found, user hasn't completed it
        hasCompletedOnboarding = false;
      }

      const userData: User = {
        ...apiUser,
        hasCompletedOnboarding,
      };

      setUser(userData);
      // Don't store user in localStorage - always fetch from backend
    } catch (error) {
      throw error;
    }
  };

  // Load user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to load user:', error);
          // Clear invalid token
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, refresh_token } = response.data;

      // Store tokens
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Fetch user data
      await refreshUser();

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Login failed. Please check your credentials.";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, full_name: string) => {
    try {
      // Clear ALL existing data first to prevent data bleeding
      localStorage.clear();
      
      const response = await authAPI.signup({ email, password, full_name });
      const { access_token, refresh_token } = response.data;

      // Store tokens
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Fetch user data
      await refreshUser();

      toast({
        title: "Account created",
        description: "Welcome! Let's get you started.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Signup failed. Please try again.";
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      // Clear all localStorage to prevent data bleeding
      localStorage.clear();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      // Don't store in localStorage - always fetch from backend
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        completeOnboarding,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
