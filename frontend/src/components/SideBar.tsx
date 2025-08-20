import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { HiOutlineHome, HiOutlineUsers, HiOutlineDocumentText, HiOutlineCreditCard } from 'react-icons/hi';

export default function SideBar() {
  const { user } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'text-indigo-600 bg-indigo-100 flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors' : 'flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors';
  return (
    <aside className="md:flex flex-col space-y-6">
      <h2 className="text-xl font-bold text-left text-indigo-600">Quick links</h2>
      <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
        <Link to="/" className={isActive('/')}>
          <HiOutlineHome size={20} />
          Home
        </Link>
        {user?.role === 'admin' && (
          <Link to={`/users`} className={isActive('/users')}>
            <HiOutlineUsers size={20} />
            Users
          </Link>
        )}
        <Link to={`/courses`} className={isActive('/courses')}>
          <HiOutlineDocumentText size={20} />
          My Courses
        </Link>
        <Link to="/subscription" className={isActive('/subscription')}>
          <HiOutlineCreditCard size={20} />
          Subscription
        </Link>
      </nav>
    </aside>
  );
};