import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import bgImage from '@/assets/bg.jpg'
import Navbar from '@/components/common/Navbar';

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
      department: '',
    },
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();

  const onSubmit = async (data: any) => {
    setError('');
    try {
      await signup(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{
        backgroundImage: `url(${bgImage})`
      }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" {...register('name', { required: true })} />
                {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email', { required: true })} />
                {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer absolute right-3 top-2.5 text-gray-500 hover:text-black"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  {...register('role', { required: true })}
                  className="w-full border border-input rounded-md px-3 py-2 cursor-pointer"
                >
                  <option value="">Select role</option>
                  <option value="manager">Manager</option>
                  <option value="engineer">Engineer</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm">Role is required</p>}
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  {...register('department', { required: true })}
                  className="w-full border border-input rounded-md px-3 py-2 cursor-pointer"
                >
                  <option value="">Select Department</option>
                  <option value="hr">HR</option>
                  <option value="engineer">Engineer</option>
                  <option value="business">Business</option>
                </select>
                {errors.department && <p className="text-red-500 text-sm">Department is required</p>}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full cursor-pointer">Sign Up</Button>
            </form>

            <p className="text-center text-sm mt-2">
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
