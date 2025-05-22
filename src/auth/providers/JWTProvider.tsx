import axios from 'axios';
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react';
import { type UserModel } from '@/auth';
import { callApiGetClasses } from '@/api/class.tsx';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const GET_USER_URL = `${API_URL}/user`;

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const [currentUsernameForDisplay, setCurrentUsernameForDisplay] = useState<string | null>(null);


  const getUser = useCallback(async () => {
    if (!axios.defaults.headers.common['Authorization']) {
      throw new Error('Chưa có thông tin xác thực (Authorization header) để lấy người dùng.');
    }
    setLoading(true);
    try {
      const response = await callApiGetClasses();
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);

      axios.defaults.headers.common['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
      setCurrentUsernameForDisplay(username);
      getUser()
        .then((response) => {
          if (response) {
            setCurrentUser({
              id: 0,
              email: '',
              username: username,
              password: password
            });
            setIsAuthenticated(true);
          } else {
            delete axios.defaults.headers.common['Authorization'];
            setCurrentUsernameForDisplay(null);
            setCurrentUser(undefined);
            setIsAuthenticated(false);
          }
        });
    },
    [getUser]
  );

  const logout = useCallback(() => {
    setCurrentUsernameForDisplay(null);
    setCurrentUser(undefined);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  }, []);


  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        isAuthenticated,
        currentUser,
        setCurrentUser,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng bên trong một AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider };
