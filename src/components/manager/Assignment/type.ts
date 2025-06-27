export type AssignmentForm = {
  engineerId: string;
  projectId: string;
  allocationPercentage: number; // frontend input
  startDate: string;  // ISO date string, e.g. '2025-06-25'
  endDate: string;
  role: string;
};