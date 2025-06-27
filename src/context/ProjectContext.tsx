


// src/context/ProjectContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

// ----------- Types ------------
export type Project = {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills?: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
};

type ProjectContextType = {
  projects: Project[];
  createProject: (data: Project) => Promise<void>;
  getProjects: () => Promise<void>;
  getProjectsByEngineer: () => Promise<Project[]>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// ----------- Provider ------------
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const createProject = async (projectData: Project) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        throw new Error('Authentication token missing');
      }

      const res = await api.post('/projects', projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => [...prev, res.data.project]);
    } catch (error) {
      throw error;
    }
  };

  const getProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        throw new Error('Authentication token missing');
      }

      const res = await api.get('/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(res?.data?.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const getProjectsByEngineer = async (): Promise<Project[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        throw new Error('Authentication token missing');
      }

      const res = await api.get('/projects/engineer/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // The backend returns: { success: true, project: [...] }
      const populatedProjects = res.data.project.map((p: any) => p.projectId);
      return populatedProjects;
    } catch (error) {
      console.error('Failed to fetch engineer projects:', error);
      throw error;
    }
  };

const updateProject = async (id: string, updatedData: Partial<Project>): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token missing');
  
  const res = await api.put(`/projects/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  setProjects((prev) =>
    prev.map((proj) => (proj._id === id ? res.data.project : proj))
  );
};
const deleteProject = async (id: string) => {
  const token = localStorage.getItem('token');
  await api.delete(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  setProjects((prev) => prev.filter((p) => p._id !== id));
};


  return (
    <ProjectContext.Provider value={{ projects, createProject, getProjects, getProjectsByEngineer,updateProject,deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

// ----------- Hook ------------
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
};
