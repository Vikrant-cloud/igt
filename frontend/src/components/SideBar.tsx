import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { HiOutlineHome, HiOutlineUsers, HiOutlineDocumentText, HiOutlineCreditCard } from 'react-icons/hi';

export default function SideBar() {
  const { user } = useAuth();
  return (
    <aside className="   md:flex flex-col py-8 space-y-6">
      <h2 className="text-xl font-bold text-left text-indigo-600">Quick links</h2>
      <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
        <Link to="/" className="flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors">
          <HiOutlineHome size={20} />
          Home
        </Link>
        {user?.role === 'admin' && (
          <Link to={`/users`} className="flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors">
            <HiOutlineUsers size={20} />
            Users
          </Link>
        )}
        <Link to={`/content`} className="flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors">
          <HiOutlineDocumentText size={20} />
          Content
        </Link>
        <Link to="/subscription" className="flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors">
          <HiOutlineCreditCard size={20} />
          Subscription
        </Link>
      </nav>
    </aside>
  );
};