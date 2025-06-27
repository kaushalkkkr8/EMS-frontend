import { useEffect, useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import EditProjectForm from './EditProjectForm'; // form for create/edit
import type { Project } from '@/context/ProjectContext';

export default function AllProjects() {
  const { projects, getProjects, deleteProject } = useProject();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editMode, setEditMode] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null); // ✅ fixed typing

  useEffect(() => {
    getProjects();
  }, []);

  const filteredProjects =
    statusFilter === 'all'
      ? projects
      : projects.filter((p) => p.status === statusFilter);

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    try {
      await deleteProject(id);
      await getProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  if (editMode && projectToEdit) {
    return (
      <EditProjectForm
        project={projectToEdit}
        onCancel={() => {
          setEditMode(false);
          setProjectToEdit(null);
        }}
        onSave={async () => {
          await getProjects();
          setEditMode(false);
          setProjectToEdit(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">All Projects</h2>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="overflow-auto border rounded-xl shadow">
          <table className="min-w-full text-sm text-left bg-white">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Team Size</th>
                <th className="p-3">Skills</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-900">{project.name}</td>
                  <td className="p-3">{project.description}</td>
                  <td className="p-3 capitalize">{project.status}</td>
                  <td className="p-3">{project.teamSize}</td>
                  <td className="p-3">{project.requiredSkills?.join(', ') || 'N/A'}</td>
                  <td className="p-3">
                    {new Date(project.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(project.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => {
                        setEditMode(true);
                        setProjectToEdit(project); 
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
