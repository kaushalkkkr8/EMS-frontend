import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Project } from '@/context/ProjectContext';
import { useProject } from '@/context/ProjectContext';

import { useState } from 'react';
import AllProjects from './Projects';

export default function ProjectForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Project>();
 const [projectCreated, setProjectCreated] = useState(false);
  const { createProject } = useProject();

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        requiredSkills: data.requiredSkills
          ? data.requiredSkills.split(',').map((s: string) => s.trim())
          : [],
        teamSize: Number(data.teamSize),
      };

      await createProject(payload);
      alert('Project created successfully!');
       setProjectCreated(true);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Project creation failed.');
    }
  };
 if (projectCreated) return <AllProjects />
  return (
    <Card className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Project Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label>Project Name</Label>
            <Input {...register('name', { required: true, minLength: 3 })} />
            {errors.name && (
              <p className="text-red-500 text-sm">Name is required (min 3 chars)</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input {...register('description', { required: true })} />
            {errors.description && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Dates */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Start Date</Label>
              <Input type="date" {...register('startDate', { required: true })} />
              {errors.startDate && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>
            <div className="flex-1">
              <Label>End Date</Label>
              <Input type="date" {...register('endDate', { required: true })} />
              {errors.endDate && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label>Skills (comma separated)</Label>
            <Input
              {...register('requiredSkills')}
              placeholder="React, Node.js"
            />
          </div>

          {/* Team Size & Status */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Team Size</Label>
              <Input
                type="number"
                className="h-10"
                {...register('teamSize', { required: true, min: 1 })}
              />
              {errors.teamSize && (
                <p className="text-red-500 text-sm">Min team size is 1</p>
              )}
            </div>
            <div className="flex-1">
              <Label>Status</Label>
              <select
                {...register('status')}
                className="w-full h-10 border rounded-md px-3 py-2"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
            Create Project
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
