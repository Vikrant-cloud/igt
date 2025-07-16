import { fetchUsers } from "../api/auth";
import Layout from "../components/Layouts/Layout";
import { useReactQuery } from "../utils/useReactQuery";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

export default function Users() {

    const { data, isLoading, isError, error } = useReactQuery(
        ['users'],
        fetchUsers,
    );

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;
    const handleEdit = (userId: string) => {
        console.log('Edit user:', userId);
        // Navigate to edit form or open modal
    };

    const handleDelete = (userId: string) => {
        console.log('Delete user:', userId);
        // Call API or open confirm dialog
    };

    return (
        <Layout>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Users List</h2>
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Active</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.users.map((user: User) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => handleEdit(user?.id)}
                                            className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {data?.users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
