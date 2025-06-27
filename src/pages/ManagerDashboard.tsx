import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  ClipboardPlus,
  FolderKanban,
  LogOut,
} from 'lucide-react';

import TeamOverview from '@/components/manager/TeamOverview';
import CreateAssignmentForm from '@/components/manager/Assignment/CreateAssignmentForm';
import ProjectForm from '@/components/manager/Projectform/ProjectForm';

type User = {
  name: string;
  email: string;
  role: 'manager' | 'engineer';
  department?: string;
};

export default function ManagerDashboard() {
  const [view, setView] = useState<'team' | 'assignment' | 'projects'>('team');
  const { logout } = useAuth();
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* ✅ Sidebar */}
      <div className="w-64 bg-white border-r px-4 py-6 space-y-8 shadow-sm">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name || 'User')}`}
              alt={userInfo?.name || 'User'}
            />
            <AvatarFallback>
              {userInfo?.name?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{userInfo?.name}</p>
            <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
          </div>
        </div>
<div className=" shadow-xl">
        <h2 className="text-lg   text-center">Manager Panel</h2>

</div>

        {/* ✅ Sidebar Navigation Buttons */}
        <div className="space-y-2 text-sm font-medium">
          <button
            className={`flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 transition ${
              view === 'team' ? 'bg-gray-200 font-semibold' : ''
            }`}
            onClick={() => setView('team')}
          >
            <Users size={18} className="mr-3" />
            Team Overview
          </button>

          <button
            className={`flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 transition ${
              view === 'assignment' ? 'bg-gray-200 font-semibold' : ''
            }`}
            onClick={() => setView('assignment')}
          >
            <ClipboardPlus size={18} className="mr-3" />
            Create Assignment
          </button>

          <button
            className={`flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 transition ${
              view === 'projects' ? 'bg-gray-200 font-semibold' : ''
            }`}
            onClick={() => setView('projects')}
          >
            <FolderKanban size={18} className="mr-3" />
            Projects
          </button>

          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 mt-10"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 p-6">
        {view === 'team' && <TeamOverview />}
        {view === 'assignment' && <CreateAssignmentForm />}
        {view === 'projects' && <ProjectForm />}
      </div>
    </div>
  );
}
