import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { fetchUsers } from "@/api/auth";
import Layout from "@/components/Layouts/Layout";
import { useReactQuery } from "@/utils/useReactQuery";
import Loading from "@/components/Loading";
import api from "@/utils/axios";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    isVerified?: boolean;
    profilePicture?: string;
}

export default function Teachers() {
    const { data, isLoading, isError, error, refetch } = useReactQuery(
        ['users', 1, 100],
        fetchUsers,
    );

    // Confirmation modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Only show users with role "teacher"
    const teachers = data?.users?.filter((user: User) => user.role === "teacher") || [];

    // Actual delete logic
    const handleDelete = async (userId: string) => {
        await api.delete(`/users/${userId}`);
        await refetch();
    };

    // Approve logic
    const handleApprove = async (userId: string) => {
        await api.post(`/users/approve-request/${userId}`);
        await refetch();
    };

    // Edit logic (stub, you can expand as needed)
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    if (isLoading) return <Loading />;
    if (isError) return <p>Error: {error.message}</p>;

    return (
        <Layout>
            <div className="min-h-screen mx-auto w-full bg-gradient-to-br from-indigo-50 flex flex-col items-center justify-start">
                <div className="w-full">
                    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-400 px-6 py-5 shadow-lg flex items-center justify-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide text-center w-full">Teachers List</h2>
                    </div>
                    <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Profile</th>
                                    <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Name</th>
                                    <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Email</th>
                                    <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Role</th>
                                    <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Active</th>
                                    <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Verified</th>
                                    <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((user: User) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <img
                                                src={user.profilePicture}
                                                alt="Profile"
                                                className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border border-gray-200 mx-auto"
                                            />
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">{user.name}</td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{user.role}</td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 space-x-2 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            {
                                                !user.isVerified &&
                                                <button
                                                    onClick={() => handleApprove(user._id)}
                                                    className="px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors cursor-pointer"
                                                    disabled={user.isVerified}
                                                >
                                                    Approve
                                                </button>
                                            }
                                            <button
                                                onClick={() => {
                                                    setDeleteId(user._id);
                                                    setConfirmOpen(true);
                                                }}
                                                className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {teachers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 sm:px-6 py-4 text-center text-gray-500">
                                            No teachers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Edit Teacher Modal (stub, expand as needed) */}
            <Dialog open={isEditModalOpen} onClose={handleEditModalClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-4 sm:p-6 shadow-xl relative">
                        <button
                            onClick={handleEditModalClose}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>
                        <Dialog.Title className="text-lg font-bold mb-4 text-indigo-700">
                            Edit Teacher
                        </Dialog.Title>
                        {selectedUser && (
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        defaultValue={selectedUser.name}
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={selectedUser.email}
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                        disabled
                                    />
                                </div>
                                {/* Add more editable fields as needed */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                                        onClick={handleEditModalClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
            {/* Confirmation Modal */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm bg-white rounded-lg p-6 shadow-xl relative">
                        <Dialog.Title className="text-lg font-bold mb-4">Confirm Delete</Dialog.Title>
                        <p className="mb-6 text-gray-700">Are you sure you want to delete this teacher? This action cannot be undone.</p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (deleteId) {
                                        await handleDelete(deleteId);
                                        setConfirmOpen(false);
                                        setDeleteId(null);
                                    }
                                }}
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Layout>
    );
}