import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import authService from "../api/AuthService";
import { User } from "../types";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();

        return setUser(userData);
      } else {
        return setUser(null);
      }
    } catch (err) {
      setError("Erreur lors de la récupération de l'utilisateur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, error, refreshUser: fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser doit être utilisé avec UserProvider");
  }

  return context;
};
