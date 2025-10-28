import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token
    const token = api.getToken();
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          setLoading(false);
        })
        .catch(() => {
          api.logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { user: userData } = await api.register(email, password, fullName);
      setUser(userData);
      navigate("/dashboard");
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData } = await api.login(email, password);
      setUser(userData);
      navigate("/dashboard");
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signOut = async () => {
    api.logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
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
