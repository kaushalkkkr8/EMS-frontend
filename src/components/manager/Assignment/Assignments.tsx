import { useEffect } from 'react';
import { useAssignment } from '@/context/AssignmentContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function Assignment() {
    const { assignments, getAssignments, deleteAssignment } = useAssignment();

    useEffect(() => {
        getAssignments();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this assignment?');
        if (confirmed) {
            await deleteAssignment(id);
            await getAssignments(); // refresh list
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-4">All Assignments</h2>

            {assignments.length === 0 ? (
                <p className="text-gray-500">No assignments found.</p>
            ) : (
                <div className="overflow-auto rounded-lg border shadow-sm bg-lime-50">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead>Engineer</TableHead>
                                <TableHead>Skills</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Allocation</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Team Size</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((a: any) => (
                                <TableRow key={a._id}>
                                    <TableCell>{a.projectId?.name || 'Unnamed'}</TableCell>
                                    <TableCell>{a.engineerId?.name?.toUpperCase() || 'N/A'}</TableCell>
                                    <TableCell>{a.engineerId?.skills?.join(', ').toUpperCase() || 'N/A'}</TableCell>
                                    <TableCell>{a.role || 'N/A'}</TableCell>
                                    <TableCell>{a.allocationPercentage}%</TableCell>
                                    <TableCell>{a.startDate ? new Date(a.startDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>{a.endDate ? new Date(a.endDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>{a.projectId?.status || 'Unknown'}</TableCell>
                                    <TableCell>{a.projectId?.teamSize || 'Unknown'}</TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleDelete(a._id)}
                                            className="cursor-pointer text-red-600 hover:bg-red-600 hover:text-white transition"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
