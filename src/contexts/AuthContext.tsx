import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  jobTitle?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session via stored token
    const initAuth = async () => {
      try {
        if (api.isAuthenticated()) {
          const userData = await api.getMe();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Token might be invalid/expired, clear it
        await api.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { user: userData } = await api.register(email, password, fullName);
      if (userData) {
        setUser(userData);
      }
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      if (response?.user) {
        setUser(response.user);
      }
      return { error: null };
    } catch (error: any) {
      console.error('[Auth] signIn error:', error);
      return { error: { message: error.message } };
    }
  };

  const signOut = async () => {
    await api.logout();
    setUser(null);
    navigate("/login");
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signUp, signIn, signOut, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
