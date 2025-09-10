import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User; token: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string };

const AuthContext = createContext<{
  state: AuthState;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  googleLogin: () => void;
  logout: () => void;
} | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, token: action.token, loading: false, error: null };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    // console.log('AuthProvider initializing:', { hasUser: !!storedUser, hasToken: !!storedToken });

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        // console.log('Restored user from localStorage:', user);
        authAPI.setAuthHeader(storedToken);
        dispatch({ type: 'SET_USER', payload: user, token: storedToken });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const setSession = (user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    authAPI.setAuthHeader(token);
    dispatch({ type: 'SET_USER', payload: user, token });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    authAPI.setAuthHeader(null);
    dispatch({ type: 'LOGOUT' });
  };

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.signup({
        name,
        email,
        password,
        role: 'customer'
      });
      const { user, token } = response.data;
      setSession(user, token);
      return user as User;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Signup failed' });
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.login({
        email,
        password,
        role: 'customer'
      });
      const { user, token } = response.data;
      setSession(user, token);
      return user as User;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      throw error;
    }
  };

  const googleLogin = () => {
    const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001/api';
    const serverBase = String(base).replace(/\/api$/, '');
    const redirectUri = (import.meta as any).env.VITE_GOOGLE_REDIRECT_URI || 'http://10.209.28.147:8080';
    window.location.href = `${serverBase}/api/auth/google?role=customer&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  const value = {
    state,
    user: state.user,
    isLoading: state.loading,
    login,
    signup,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
