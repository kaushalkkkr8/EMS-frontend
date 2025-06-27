import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';

// ----------- Types ------------
type User = {
  _id?: string;
  name: string;
  email: string;
  role: 'manager' | 'engineer';
  department?: string;
  skills?: string[];
  seniority?: string;
};

type SignupForm = {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'engineer';
  department: string;
};

type AuthContextType = {
  user: User | null;
  signup: (data: SignupForm) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const signup = async (formData: SignupForm) => {
    const res = await api.post('/auth/signup', formData);
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    navigate('/');
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    navigate(res.data.user.role === 'manager' ? '/manager/dashboard' : '/engineer/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const updateProfile = async (data: Partial<User>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/")
      throw new Error('Authentication token missing');
    }
    if (!user) return;
    console.log({ user });
    try {
      const res = await api.put(`/auth/${user?._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log({ res });


      const updatedUser: User = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};