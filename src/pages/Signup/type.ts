

export type SignupFormData = {
  name: string;
  email: string;
  role: 'manager' | 'engineer';
  department?: string;
  password: string;
};
