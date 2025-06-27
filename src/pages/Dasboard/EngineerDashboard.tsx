// src/pages/EngineerDashboard.tsx
import {  useState } from 'react';
import MyAssignments from '@/components/engineer/Assignment/MyAssignments';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileCard from '@/components/engineer/Engineer/ProfileCard';
import {
  ClipboardList,
  User,
  LogOut,
} from 'lucide-react'; // Add more icons if needed
import dashBg from '@/assets/dasbd.jpg'

// Define User type if not already imported
type User = {
  name: string;
  email: string;
  role: 'engineer' | 'manager';
  department?: string;
};

export default function EngineerDashboard() {
  const [view, setView] = useState<'assignments' | 'profile'>('assignments');
  const { user,logout } = useAuth();
  

   return (
    <div className="flex min-h-screen" style={{
        backgroundImage: `url(${dashBg})`
      }}>
      {/* ✅ Sidebar */}
      <div className="w-64 bg-white border-r px-4 py-6 space-y-8 shadow-sm">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name.toUpperCase() || 'User')}`}
              alt={user?.name || 'User'}
            />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{user?.name.toUpperCase()}</p>
            {/* <p className="text-xs text-muted-foreground">{userData?.email}</p> */}
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2 text-sm font-medium">
          <button
            className={`flex items-center w-full px-3 curser-pointer py-2 rounded-md hover:bg-gray-100 transition ${
              view === 'assignments' ? 'bg-gray-200 font-semibold' : ''
            }`}
            onClick={() => setView('assignments')}
          >
            <ClipboardList size={18} className="mr-3" />
            My Assignments
            <span className="ml-auto  bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
              new
            </span>
          </button>

          <button
            className={`flex items-center curser-pointer w-full px-3 py-2 rounded-md hover:bg-gray-100 transition ${
              view === 'profile' ? 'bg-gray-200 font-semibold' : ''
            }`}
            onClick={() => setView('profile')}
          >
            <User size={18} className="mr-3" />
            Profile
          </button>

          <button
            onClick={logout}
            className="flex items-center curser-pointer w-full px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 mt-10"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 p-6">
        {view === 'assignments' && <MyAssignments />}
        {view === 'profile' && <ProfileCard />}
      </div>
    </div>
  );
}
