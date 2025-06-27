import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssignment } from '@/context/AssignmentContext';
import { useEngineer } from '@/context/EngineerContext';
import { useProject } from '@/context/ProjectContext';
import type { AssignmentForm } from './type';
import Assignment from './Assignments';

export default function CreateAssignmentForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<AssignmentForm>();

  const { createAssignment, assignments, getAssignments } = useAssignment();
  const { engineers, fetchEngineers } = useEngineer();
  const { projects, getProjects } = useProject();
   const [assignmentCreated, setAssignmentCreated] = useState(false);

  useEffect(() => {
    fetchEngineers();
    getProjects();
    getAssignments();
  }, []);

  // Filter out projects that already have an assignment
  const assignedProjectIds = assignments.map(a => a.projectId);
  const unassignedProjects = projects.filter(p => !assignedProjectIds.includes(p._id));

  const onSubmit = async (data: AssignmentForm) => {
    try {
      await createAssignment({
        ...data,
        allocationPercentage: Number(data.allocationPercentage),
      });
      alert('Assignment Created Successfully');
      setAssignmentCreated(true)
    } catch (error) {
      console.error('Assignment creation failed:', error);
      alert('Failed to create assignment');
    }
  };
   if (assignmentCreated) return <Assignment />

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Engineer */}
          <div>
            <Label>Engineer</Label>
            <select
              {...register('engineerId', { required: true })}
              className="w-full h-10 border px-3 py-2 rounded-md"
            >
              <option value="">Select Engineer Lead</option>
              {engineers?.map(e => (
                <option key={e._id} value={e._id}>{e.name}</option>
              ))}
            </select>
            {errors.engineerId && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Project */}
          <div>
            <Label>Project</Label>
            <select
              {...register('projectId', { required: true })}
              className="w-full h-10 border px-3 py-2 rounded-md"
            >
              <option value="">Select Project</option>
              {unassignedProjects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            {errors.projectId && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Role and Allocation */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Role</Label>
              <Input
                className="h-10"
                {...register('role', { required: true })}
                placeholder="Developer / Tech Lead"
              />
              {errors.role && <p className="text-red-500 text-sm">Role is required</p>}
            </div>
            <div className="flex-1">
              <Label>Allocation (%)</Label>
              <Input
                type="number"
                className="h-10"
                {...register('allocationPercentage', { required: true, min: 10, max: 100 })}
              />
              {errors.allocationPercentage && (
                <p className="text-red-500 text-sm">10–100% required</p>
              )}
            </div>
          </div>

          {/* Start and End Date */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Start Date</Label>
              <Input
                type="date"
                className="h-10"
                {...register('startDate', { required: true })}
              />
              {errors.startDate && <p className="text-red-500 text-sm">Required</p>}
            </div>
            <div className="flex-1">
              <Label>End Date</Label>
              <Input
                type="date"
                className="h-10"
                {...register('endDate', { required: true })}
              />
              {errors.endDate && <p className="text-red-500 text-sm">Required</p>}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
            Assign
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
