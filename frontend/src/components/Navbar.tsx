import { useAuth } from '@/hooks/useAuth';
export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <header className="flex justify-between items-center bg-white shadow px-4 py-3 sticky top-0 z-50">
      <h1 className="text-lg font-semibold text-gray-800">Welcome Back, {user?.name}</h1>
      <div className="flex items-center space-x-4">
        <img
          src={user?.profilePicture || '/images/default-profile.png'}
          alt="Profile"
          className="w-8 h-8 rounded-full border"
        />
        <button
          onClick={() => logout()}
          className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};