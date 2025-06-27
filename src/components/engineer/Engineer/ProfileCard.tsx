// src/components/engineer/EngineerProfile/ProfileCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import EngineerProfile from './EngineerProfile';

export default function ProfileCard() {
    const { user } = useAuth();
    const [editMode, setEditMode] = useState(false);

    // ✅ Avoid duplicate check
    if (!user) return <p className="text-center text-gray-500">Loading profile...</p>;

    // ✅ Show edit profile form if in edit mode
    if (editMode) return <EngineerProfile onCancel={() => setEditMode(false)} />;

    return (
        <Card className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl">

            {/* Cover & Edit Button */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
                {/* ✅ Toggle edit mode */}
                <button
                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full hover:bg-gray-100"
                    onClick={() => setEditMode(true)}
                >
                    <Pencil size={16} className="text-gray-700 cursor-pointer" />
                </button>
            </div>

            {/* Avatar */}
            <div className="flex justify-center -mt-12">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                    <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'U')}`}
                        alt={user?.name}
                    />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
            </div>

            {/* Profile Details */}

            <CardContent>
                <div className="flex flex-wrap justify-between px-10 py-6 gap-y-6 mx-4" style={{marginLeft:"70px"}}>
                    {/* Column 1 */}
                    <div className="flex flex-col w-[45%]">
                        <Label className="text-sm text-muted-foreground">Name</Label>
                        <p className="font-medium">{user.name.toUpperCase()}</p>
                    </div>

                    <div className="flex flex-col w-[45%]">
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="font-medium">{user.email}</p>
                    </div>

                    <div className="flex flex-col w-[45%]">
                        <Label className="text-sm text-muted-foreground">Role</Label>
                        <p className="font-medium">{user.role.toUpperCase()}</p>
                    </div>

                    {user.department && (
                        <div className="flex flex-col w-[45%]">
                            <Label className="text-sm text-muted-foreground">Department</Label>
                            <p className="font-medium">{user.department.toUpperCase()}</p>
                        </div>
                    )}

                    {user.seniority && (
                        <div className="flex flex-col w-[45%]">
                            <Label className="text-sm text-muted-foreground">Seniority</Label>
                            <p className="font-medium">{user.seniority.toUpperCase()}</p>
                        </div>
                    )}

                    {user.skills && (
                        <div className="flex flex-col w-[45%]">
                            <Label className="text-sm text-muted-foreground">Skills</Label>
                            <p className="font-medium">{user.skills.join(', ').toUpperCase()}</p>
                        </div>
                    )}
                </div>
            </CardContent>



        </Card>
    );
}
