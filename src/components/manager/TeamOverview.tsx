// src/components/manager/TeamOverview/index.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEngineer } from '@/context/EngineerContext';
import type { EngineerCapacity } from '@/context/EngineerContext';

export default function TeamOverview() {
  const { engineers, fetchEngineers, fetchEngineerCapacity } = useEngineer();
  const [capacities, setCapacities] = useState<Record<string, EngineerCapacity>>({});

  useEffect(() => {
    const loadData = async () => {
      await fetchEngineers();
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadCapacities = async () => {
      const allCapacities: Record<string, EngineerCapacity> = {};
      await Promise.all(
        engineers?.map(async (eng) => {
          try {
            const capacity = await fetchEngineerCapacity(eng._id);
            allCapacities[eng._id] = capacity;
          } catch (err) {
            console.error(`Failed to fetch capacity for ${eng.name}`);
          }
        })
      );
      setCapacities(allCapacities);
    };

    if (engineers?.length) {
      loadCapacities();
    }
  }, [engineers]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Team Overview</h2>
      {engineers?.map((eng) => {
        const cap = capacities[eng._id];
        const percent = cap ? Math.min(100, Math.round((cap.allocated / cap.maxCapacity) * 100)) : 0;

        return (
          <Card key={eng._id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{eng.name}</CardTitle>
              <span className="text-sm text-muted-foreground">
                {cap ? `${percent}% allocated` : 'Loading...'}
              </span>
            </CardHeader>
            <CardContent>
              <Progress value={percent} />
              <p className="mt-2 text-sm">Skills: {eng.skills.join(', ')}</p>
              {cap && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Capacity: {cap.allocated} / {cap.maxCapacity}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
