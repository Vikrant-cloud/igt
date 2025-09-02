import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { HiOutlineHome, HiOutlineDocumentText, HiOutlineCreditCard } from 'react-icons/hi';

export default function SideBar() {
  const { user } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.includes(path) ? 'text-indigo-600 bg-indigo-100 flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors' : 'flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors';

  const checkRoute = (route: string) => {
    if (user?.role === 'student') return `/student/${route}`;
    if (user?.role === 'teacher') return `/teacher/${route}`;
    return '/';
  }

  return (
    <aside className="md:flex flex-col space-y-6">
      <h2 className="text-xl font-bold text-left text-indigo-600">Quick links</h2>
      <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
        <Link to={checkRoute('dashboard')} className={isActive('/')}>
          <HiOutlineHome size={20} />
          Home
        </Link>
        <Link to={checkRoute('courses')} className={isActive('/courses')}>
          <HiOutlineDocumentText size={20} />
          My Courses
        </Link>
        <Link to={checkRoute('messages')} className={isActive('/teacher/messages')}>
          <HiOutlineDocumentText size={20} />
          Messages
        </Link>
        {
          user?.role === 'teacher' && (
            <Link to={checkRoute('earnings')} className={isActive('/earnings')}>
              <HiOutlineCreditCard size={20} />
              Earnings
            </Link>
          )
        }
      </nav>
    </aside>
  );
};