// src/components/engineer/EngineerProfile/index.tsx

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import type { Profile } from './type';
import { useEffect } from 'react';

// ✅ Added prop type for cancel callback
type EngineerProfileProps = {
  onCancel?: () => void;
};

export default function EngineerProfile({ onCancel }: EngineerProfileProps) {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, reset } = useForm<Profile>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        skills: user.skills?.join(', ') ?? '',
        seniority: user.seniority ?? '',
        employmentType: user.role === 'engineer' ? 'Full-time' : 'Part-time',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: Profile) => {
    try {
      await updateProfile({
        ...data,
        skills: data.skills.split(',').map((s) => s.trim()),
      });
      alert('Profile updated successfully');
      onCancel?.(); // ✅ Call cancel if provided
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
  <Card className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input {...register('name')} />
          </div>

          <div>
            <Label>Skills (comma separated)</Label>
            <Input {...register('skills')} />
          </div>

          <div>
            <Label>Seniority</Label>
            <Input {...register('seniority')} />
          </div>

          <div>
            <Label>Employment Type</Label>
            <select {...register('employmentType')} className="w-full border px-3 py-2 rounded-md">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button className="cursor-pointer bg-green-600 hover:bg-green-700" type="submit">Save</Button>

            {/* ✅ Show cancel if onCancel is provided */}
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer "
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
