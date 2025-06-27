import { useEffect, useState } from 'react';
import { useEngineer } from '@/context/EngineerContext';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import type { EngineerCapacity } from '@/context/EngineerContext';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function TeamOverview() {
  const { engineers, fetchEngineers, fetchEngineerCapacity } = useEngineer();
  const [capacities, setCapacities] = useState<Record<string, EngineerCapacity>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEngineers();
  }, []);

  useEffect(() => {
    const loadCapacities = async () => {
      const allCapacities: Record<string, EngineerCapacity> = {};
      await Promise.all(
        engineers.map(async (eng) => {
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

    if (engineers.length) {
      loadCapacities();
    }
  }, [engineers]);

  const filteredEngineers = engineers.filter(
    (eng) =>
      eng.name.toLowerCase().includes(search.toLowerCase()) ||
      eng.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()))
  );

  const chartData = filteredEngineers.map((eng) => ({
    name: eng.name,
    allocated: capacities[eng._id]?.allocated || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Team Overview</h2>
        <Input
          type="text"
          placeholder="Search by name or skill"
          className="w-full md:w-64 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🧾 Engineer Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Skills</th>
              <th className="text-left px-4 py-2">Capacity</th>
              <th className="text-left px-4 py-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredEngineers.length > 0 ? (
              filteredEngineers.map((eng) => {
                const cap = capacities[eng._id];
                const percent = cap ? Math.min(100, Math.round((cap.allocated / cap.maxCapacity) * 100)) : 0;

                return (
                  <tr key={eng._id} className="border-t">
                    <td className="px-4 py-2 font-medium">{eng.name}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">{eng.skills.join(', ')}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">
                      {cap ? `${cap.allocated} / ${cap.maxCapacity}` : 'Loading...'}
                    </td>
                    <td className="px-4 py-2 w-64">
                      <Progress value={percent} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-muted-foreground">
                  No engineers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📊 Capacity Chart */}
      {chartData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Capacity Allocation Chart</h3>
          <div className="bg-white rounded-xl shadow p-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar
                  dataKey="allocated"
                  barSize={16}
                  fill="#22c55e" // green
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
