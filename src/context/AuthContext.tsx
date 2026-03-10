import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRequest, UserCredentialsDto, UserUpdate } from '../types';
import { authAPI, usersAPI } from '../services/api';

// Декодирование user из JWT payload (для восстановления при перезагрузке)
const getUserFromToken = (accessToken: string): User | null => {
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    return {
      id: payload.sub ?? payload.userId ?? 0,
      fullName: payload.fullName ?? payload.name ?? '',
      phone: payload.phone ?? '',
      email: payload.email ?? payload.sub ?? '',
    };
  } catch {
    return null;
  }
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: UserCredentialsDto) => Promise<void>;
  register: (data: UserRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  updateProfile: (data: UserUpdate) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const baseUser = getUserFromToken(accessToken);

      try {
        const res = await usersAPI.me();
        setUser(res.data as User);
      } catch {
        // если профиль по каким-то причинам не загрузился, оставляем данные из токена
        setUser(baseUser);
      } finally {
        setIsLoading(false);
      }
    };

    void initAuth();
  }, []);

  const saveAuth = (accessToken: string, refreshToken: string, userData?: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData ?? getUserFromToken(accessToken));
    setError(null);
  };

  const login = async (credentials: UserCredentialsDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await authAPI.signIn(credentials);
      if (!data.token) throw new Error('Нет токена в ответе');
      saveAuth(data.token, data.refreshToken);

      const baseUser = getUserFromToken(data.token);
      try {
        const res = await usersAPI.me();
        setUser(res.data as User);
      } catch {
        setUser(baseUser);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const errorMessage = e.response?.data?.message || 'Ошибка входа';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: UserRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authAPI.signUp(data);
      // UserResponse не содержит токенов — после регистрации нужно войти
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const errorMessage = e.response?.data?.message || 'Ошибка регистрации';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (data: UserUpdate) => {
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }
    const res = await usersAPI.update(user.id, data);
    const updated = res.data;
    setUser({
      id: updated.id,
      fullName: updated.fullName,
      phone: updated.phone,
      email: updated.email,
      createdAt: updated.createdAt,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loginWithTokens: async (accessToken: string, refreshToken: string) => {
          saveAuth(accessToken, refreshToken);
          try {
            const res = await usersAPI.me();
            setUser(res.data as User);
          } catch {
            setUser(getUserFromToken(accessToken));
          }
        },
        updateProfile,
      }}
    >
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
