import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  ClipboardPlus,
  FolderKanban,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import dashBg from '@/assets/dasbd.jpg'

import TeamOverview from '@/components/manager/TeamOverview';
import ProjectForm from '@/components/manager/Projectform/ProjectForm';
import Assignment from '@/components/manager/Assignment/Assignments';
import CreateAssignmentForm from '@/components/manager/Assignment/CreateAssignmentForm';
import AllProjects from '@/components/manager/Projectform/Projects';

type User = {
  name: string;
  email: string;
  role: 'manager' | 'engineer';
  department?: string;
};

export default function ManagerDashboard() {
  const [view, setView] = useState<string>('team');
  const { logout } = useAuth();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [assignmentDropdown, setAssignmentDropdown] = useState(false);
  const [projectDropdown, setProjectDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>

      <div className="flex min-h-screen" style={{
        backgroundImage: `url(${dashBg})`
      }}>
        {/* Sidebar */}
        <div className="w-64  border-r px-4 py-6 space-y-8 shadow-sm">
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

          <div className="px-3 py-2   text-center ">
            <h1 className="text-base font-semibold text-gray-700">👔 Manager Panel</h1>
          </div>


          {/* Navigation */}
          <div className="space-y-2 text-sm font-medium">
            <button
              className={`flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 transition ${view === 'team' ? 'bg-gray-200 font-semibold' : ''
                }`}
              onClick={() => setView('team')}
            >
              <Users size={18} className="mr-3" />
              Team Overview
            </button>

            {/* Assignment Dropdown */}
            <div>
              <button
                onClick={() => setAssignmentDropdown(!assignmentDropdown)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <span className="flex items-center">
                  <ClipboardPlus size={18} className="mr-3" /> Assignments
                </span>
                <ChevronDown size={16} />
              </button>
              {assignmentDropdown && (
                <div className="ml-6 space-y-1">
                  <button
                    onClick={() => setView('all-assignments')}
                    className="block w-full text-left text-sm hover:text-blue-600"
                  >
                    All Assignments
                  </button>
                  <button
                    onClick={() => setView('create-assignment')}
                    className="block w-full text-left text-sm hover:text-blue-600"
                  >
                    Create Assignment
                  </button>
                </div>
              )}
            </div>

            {/* Projects Dropdown */}
            <div>
              <button
                onClick={() => setProjectDropdown(!projectDropdown)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <span className="flex items-center">
                  <FolderKanban size={18} className="mr-3" /> Projects
                </span>
                <ChevronDown size={16} />
              </button>
              {projectDropdown && (
                <div className="ml-6 space-y-1">
                  <button
                    onClick={() => setView('all-projects')}
                    className="block w-full text-left text-sm hover:text-blue-600"
                  >
                    All Projects
                  </button>
                  <button
                    onClick={() => setView('create-project')}
                    className="block w-full text-left text-sm hover:text-blue-600"
                  >
                    Create Project
                  </button>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 mt-10"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {view === 'team' && <TeamOverview />}
          {view === 'create-assignment' && <CreateAssignmentForm />}
          {view === 'all-assignments' && <Assignment />}
          {view === 'create-project' && <ProjectForm />}
          {view === 'all-projects' && <AllProjects />}
        </div>
      </div>
    </>
  );
}
