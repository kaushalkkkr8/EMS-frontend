// src/constants/api.ts

const api = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    profile: '/auth/profile',
  },
  engineer: {
    list: '/engineer',
    capacity: (id: string) => `/engineer/${id}/capacity`,
  },
  assignment: {
    create: '/assignments',
    list: '/assignments',
    byProject: (projectId: string) => `/assignments/project/${projectId}`,
    byEngineer: (engineerId: string) => `/assignments/engineer/${engineerId}`,
  },
   project: {
    list: '/projects',
    create: '/projects',
    detail: (id: string) => `/projects/${id}`,
    engProj: (engineerId: string) => `/projects/engineer/${engineerId}`,
  },
};

export default api;
