// src/context/EngineerContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

// ---------- Types ----------
export type Engineer = {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  seniority: string;
  maxCapacity: number;
  department: string;
};

export type EngineerCapacity = {
  engineer: string;
  maxCapacity: number;
  allocated: number;
  available: number;
};

type EngineerContextType = {
  engineers: Engineer[];
  fetchEngineers: () => Promise<void>;
  fetchEngineerCapacity: (id: string) => Promise<EngineerCapacity>;
};

// ---------- Context ----------
const EngineerContext = createContext<EngineerContextType | undefined>(undefined);

// ---------- Provider ----------
export const EngineerProvider = ({ children }: { children: ReactNode }) => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const navigate= useNavigate()

  const fetchEngineers = async () => {
    try {
      const token = localStorage.getItem('token');
          if (!token){
        navigate("/")
        throw new Error('Authentication token missing');
      } 
      
      const res = await api.get('/engineers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setEngineers(res.data.engineers);
    } catch (error) {
      console.error('Error fetching engineers:', error);
    }
  };

  const fetchEngineerCapacity = async (id: string): Promise<EngineerCapacity> => {
    try {
      const token = localStorage.getItem('token');
          if (!token){
        navigate("/")
        throw new Error('Authentication token missing');
      } 
      const res = await api.get(`/engineers/${id}/capacity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching capacity:', error);
      throw error;
    }
  };

  return (
    <EngineerContext.Provider value={{ engineers, fetchEngineers, fetchEngineerCapacity }}>
      {children}
    </EngineerContext.Provider>
  );
};

// ---------- Hook ----------
export const useEngineer = () => {
  const context = useContext(EngineerContext);
  if (!context) throw new Error('useEngineer must be used within EngineerProvider');
  return context;
};
