import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function SideBar() {
  const { user } = useAuth();
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white shadow-md px-6 py-8 space-y-6">
      <h2 className="text-xl font-bold text-left text-indigo-600">Quick links</h2>
      <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
        <Link to="/" className="flex items-center gap-3 hover:text-indigo-600">
          Home
        </Link>
        {user?.role === 'admin' && (
          <Link to={`/users`} className="flex items-center gap-3 hover:text-indigo-600">
            Users
          </Link>
        )}

        <Link to={`/content`} className="flex items-center gap-3 hover:text-indigo-600">
          Content
        </Link>
        <Link to="/settings" className="flex items-center gap-3 hover:text-indigo-600">
          Settings
        </Link>
      </nav>
    </aside>
  );
};