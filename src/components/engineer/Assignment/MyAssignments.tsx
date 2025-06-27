// src/components/engineer/MyAssignments.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CapacityBar from '@/components/common/CapacityBar';
import SkillTagList from '@/components/common/SkillTagList';
import { useProject } from '@/context/ProjectContext';
import type { Project } from '@/context/ProjectContext';

export default function MyAssignments() {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const { getProjectsByEngineer } = useProject();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await getProjectsByEngineer();
        setMyProjects(projects);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
    };
    fetchData();
  }, [getProjectsByEngineer]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-2">My Assignments</h1>
      <div className="flex flex-wrap mx-auto">
        {myProjects.map((project) => (
          <div key={project?._id} className="w-full md:w-1/2 px-2 mb-4">
            <Card >
              <CardHeader>
                <CardTitle>{project?.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {project?.startDate} → {project?.endDate}
                </p>
              </CardHeader>
              <CardContent>
                {/* You can modify this if you store allocation per assignment */}
                <CapacityBar value={project?.teamSize || 0} />
                <div className="mt-2">
                  <SkillTagList skills={project?.requiredSkills || []} />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
