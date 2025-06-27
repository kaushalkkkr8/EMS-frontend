// src/components/manager/ProjectForm/type.ts

export type Project = {
  _id:string
  name: string;
  description: string;
  startDate: string; // ISO date string (e.g., "2025-06-25")
  endDate: string;
  requiredSkills?: string[]; // parsed from "skills" input field
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
};
