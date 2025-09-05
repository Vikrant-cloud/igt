import { Link, useLocation } from 'react-router';
import { HiOutlineHome, HiOutlineUsers, HiOutlineDocumentText, HiOutlineCreditCard } from 'react-icons/hi';

export default function AdminSideBar() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.includes(path) ? 'text-indigo-600 bg-indigo-100 flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors' : 'flex items-center gap-3 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg px-2 py-2 transition-colors';
    return (
        <aside className="md:flex flex-col space-y-6">
            <h2 className="text-xl font-bold text-left text-indigo-600">Quick links</h2>
            <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
                <Link to="/admin/dashboard" className={isActive('/dashboard')}>
                    <HiOutlineHome size={20} />
                    Home
                </Link>

                <Link to={`/admin/students`} className={isActive('/students')}>
                    <HiOutlineUsers size={20} />
                    Students
                </Link>

                <Link to={`/admin/teachers`} className={isActive('/teachers')}>
                    <HiOutlineDocumentText size={20} />
                    Teachers
                </Link>
                <Link to="/admin/courses" className={isActive('/courses')}>
                    <HiOutlineCreditCard size={20} />
                    Courses
                </Link>
                {/* <Link to="/admin/stats" className={isActive('/stats')}>
                    <HiOutlineCreditCard size={20} />
                    Stats
                </Link> */}
            </nav>
        </aside>
    );
};