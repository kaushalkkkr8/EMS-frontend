import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Project } from '@/context/ProjectContext';
import { useProject } from '@/context/ProjectContext';
import { useEffect } from 'react';

type Props = {
  project?: Project;
  onCancel: () => void;
  onSave: () => void;
};

type ProjectFormData = Omit<Project, 'requiredSkills'> & {
  requiredSkills: string;
};

export default function EditProjectForm({ project, onCancel, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: project
      ? {
          ...project,
          requiredSkills: project.requiredSkills?.join(', ') ?? '',
        }
      : {
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          requiredSkills: '',
          teamSize: 1,
          status: 'planning',
          _id: '',
        },
  });

  const { createProject, updateProject } = useProject();

  useEffect(() => {
    if (project) {
      reset({
        ...project,
        requiredSkills: project.requiredSkills?.join(', ') ?? '',
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    const payload: Project = {
      ...data,
      requiredSkills: data.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (project?._id) {
        await updateProject(project._id, payload);
        alert('Project updated');
      } else {
        await createProject(payload);
        alert('Project created');
      }

      onSave();
    } catch (err) {
      alert('Failed to save project');
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          {project ? 'Edit Project' : 'Create Project'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <Label>Project Name</Label>
            <Input {...register('name', { required: true, minLength: 3 })} />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

         
          <div>
            <Label>Description</Label>
            <Input {...register('description', { required: true })} />
            {errors.description && <p className="text-red-500 text-sm">Required</p>}
          </div>

   
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Start Date</Label>
              <Input type="date" {...register('startDate', { required: true })} />
              {errors.startDate && <p className="text-red-500 text-sm">Required</p>}
            </div>
            <div className="flex-1">
              <Label>End Date</Label>
              <Input type="date" {...register('endDate', { required: true })} />
              {errors.endDate && <p className="text-red-500 text-sm">Required</p>}
            </div>
          </div>

          <div>
            <Label>Skills (comma separated)</Label>
            <Input
              {...register('requiredSkills')}
              placeholder="React, Node.js"
            />
          </div>

      
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Team Size</Label>
              <Input
                type="number"
                className="h-10"
                {...register('teamSize', { required: true, min: 1 })}
              />
              {errors.teamSize && <p className="text-red-500 text-sm">Min team size is 1</p>}
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

         
          <div className="flex gap-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
               Update Project
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
