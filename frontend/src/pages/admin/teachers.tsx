import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { fetchUsers } from "@/api/auth";
import Layout from "@/components/Layouts/Layout";
import { useReactQuery } from "@/utils/useReactQuery";
import Loading from "@/components/Loading";
import api from "@/utils/axios";
import Pagination from "@/components/Pagination";
import { Link, useSearchParams } from "react-router";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const limit = 4;
    const role = "teacher";
    const { data, isLoading, isError, error, refetch } = useReactQuery(
        ["users", page, limit],
        () => fetchUsers(page, limit, role)
    );

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const teachers =
        data?.users?.filter((user: User) => user.role === "teacher") || [];

    const handleDelete = async (userId: string) => {
        await api.delete(`/users/${userId}`);
        await refetch();
    };

    const handleApprove = async (userId: string) => {
        await api.post(`/users/approve-request/${userId}`);
        await refetch();
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
    };

    if (isLoading) return <Loading />;
    if (isError) return <p>Error: {error.message}</p>;

    return (
        <Layout>
            <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
                {/* Header */}
                <div className="w-full max-w-7xl mb-6">
                    <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 px-6 py-8 shadow-xl text-center">
                        <h2 className="text-3xl font-bold text-white tracking-wide mb-2">
                            Teachers Management
                        </h2>
                        <p className="text-white/90">View, approve, edit and manage all teachers in one place</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="w-full max-w-7xl mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between px-4">
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>All</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Verified</option>
                        <option>Pending</option>
                    </select>
                </div>

                {/* Teachers Grid */}
                <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                    {teachers.map((user: User) => (
                        <Link to={`/admin/teacher/${user._id}`}
                            key={user._id}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all flex flex-col items-center text-center"
                        >
                            <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="h-20 w-20 rounded-full object-cover border-4 border-indigo-100 shadow-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>

                            {/* Status Pills */}
                            <div className="flex gap-2 mt-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {user.isActive ? "Active" : "Inactive"}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${user.isVerified
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {user.isVerified ? "Verified" : "Pending"}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100"
                                >
                                    ✏️ Edit
                                </button>
                                {!user.isVerified && (
                                    <button
                                        onClick={() => handleApprove(user._id)}
                                        className="px-3 py-1 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100"
                                    >
                                        ✅ Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setDeleteId(user._id);
                                        setConfirmOpen(true);
                                    }}
                                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </Link>

                    ))}

                    {teachers.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            No teachers found.
                        </p>
                    )}
                </div>

                <Pagination
                    total={data?.pagination?.totalUsers}
                    pageSize={limit}
                    currentPage={page}
                    onPageChange={onPageChange}
                />
            </div>


            {/* Edit Modal */}
            <Dialog
                open={isEditModalOpen}
                onClose={handleEditModalClose}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={handleEditModalClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <Dialog.Title className="text-xl font-bold mb-6 text-indigo-700">
                            Edit Teacher
                        </Dialog.Title>
                        {selectedUser && (
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        defaultValue={selectedUser.name}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={selectedUser.email}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow-sm"
                                        onClick={handleEditModalClose}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl relative">
                        <Dialog.Title className="text-xl font-bold mb-4 text-red-600">
                            Confirm Delete
                        </Dialog.Title>
                        <p className="mb-6 text-gray-700">
                            Are you sure you want to delete this teacher? This action cannot be
                            undone.
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
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
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
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
