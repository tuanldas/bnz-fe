import axios, { AxiosError } from 'axios';
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { type UserModel } from '@/auth';
import { callApiGetClasses } from '@/api/class.tsx';
import { callApiDoActualRegistration, RegistrationPayload } from '@/api/auth';

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegistrationPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const [currentUsernameForDisplay, setCurrentUsernameForDisplay] = useState<string | null>(null);

  const checkCredentialsWithApi = useCallback(async (): Promise<boolean> => {
    if (!axios.defaults.headers.common['Authorization']) {
      return false;
    }
    try {
      await callApiGetClasses();
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      setLoading(true);
      axios.defaults.headers.common['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
      setCurrentUsernameForDisplay(username);

      try {
        const credentialsValid = await checkCredentialsWithApi();
        if (credentialsValid) {
          setCurrentUser({
            id: 0,
            username: username,
            email: '',
          } as UserModel);
          setIsAuthenticated(true);
        } else {
          delete axios.defaults.headers.common['Authorization'];
          setCurrentUsernameForDisplay(null);
          setCurrentUser(undefined);
          setIsAuthenticated(false);
          throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
        }
      } catch (error) {
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUsernameForDisplay(null);
        setCurrentUser(undefined);
        setIsAuthenticated(false);
        if (error instanceof Error) throw error;
        throw new Error('Đăng nhập thất bại do lỗi không xác định.');
      } finally {
        setLoading(false);
      }
    },
    [checkCredentialsWithApi, setLoading]
  );

  const register = useCallback(
    async (payload: RegistrationPayload): Promise<void> => {
      setLoading(true);
      try {
        const registrationResponse = await callApiDoActualRegistration(payload);
        await login(payload.email, payload.password);
      } catch (error) {
        if (error instanceof Error) {
          throw error.message;
        }
        throw new Error('Đăng ký hoặc tự động đăng nhập thất bại do lỗi không xác định.');
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading]
  );

  const logout = useCallback(() => {
    setCurrentUsernameForDisplay(null);
    setCurrentUser(undefined);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    setLoading(false);
  }, [setLoading]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        isAuthenticated,
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
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
