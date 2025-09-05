import { useState, useMemo } from "react";
import { Dialog } from "@headlessui/react";
import { fetchUsers } from "@/api/auth";
import Layout from "@/components/Layouts/Layout";
import { useReactQuery } from "@/utils/useReactQuery";
import Loading from "@/components/Loading";
import api from "@/utils/axios";
import {
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
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

export default function Students() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const limit = 4;
    const role = "student";
    const { data, isLoading, isError, error, refetch } = useReactQuery(
        ["users", page, limit],
        () => fetchUsers(page, limit, role)
    );

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [verifyFilter, setVerifyFilter] = useState("all");

    // Students only
    const students: User[] =
        data?.users?.filter((user: User) => user.role === "student") || [];

    // Filter logic
    const filteredStudents = useMemo(() => {
        return students.filter((s) => {
            const matchesSearch =
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.email.toLowerCase().includes(search.toLowerCase());
            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                        ? s.isActive
                        : !s.isActive;
            const matchesVerify =
                verifyFilter === "all"
                    ? true
                    : verifyFilter === "verified"
                        ? s.isVerified
                        : !s.isVerified;
            return matchesSearch && matchesStatus && matchesVerify;
        });
    }, [students, search, statusFilter, verifyFilter]);

    // Actions
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

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
    };

    if (isLoading) return <Loading />;
    if (isError) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <Layout>
            <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-2xl p-6 shadow-lg mb-6 text-center">
                    <h2 className="text-3xl font-bold text-white tracking-wide">
                        Students Management
                    </h2>
                    <p className="text-indigo-100 mt-2">
                        Manage, verify, and organize student accounts
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
                    />
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select
                            value={verifyFilter}
                            onChange={(e) => setVerifyFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">All Verification</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Student Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStudents.map((user) => (
                        <Link to={`/admin/student/${user._id}`}
                            key={user._id}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all flex flex-col items-center text-center"
                        >
                            <img
                                src={
                                    user.profilePicture ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        user.name
                                    )}`
                                }
                                alt={user.name}
                                className="h-20 w-20 rounded-full object-cover border-4 border-indigo-100 shadow-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">
                                {user.name}
                            </h3>
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
                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                {!user.isVerified && (
                                    <button
                                        onClick={() => handleApprove(user._id)}
                                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                                    >
                                        <CheckCircleIcon className="h-5 w-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setDeleteId(user._id);
                                        setConfirmOpen(true);
                                    }}
                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </Link>
                    ))}
                    {filteredStudents.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            🚫 No students found.
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
                onClose={() => setIsEditModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full relative">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        <Dialog.Title className="text-lg font-bold text-indigo-600 mb-4">
                            Edit Student
                        </Dialog.Title>
                        {selectedUser && (
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    defaultValue={selectedUser.name}
                                    className="w-full border rounded p-2"
                                    disabled
                                />
                                <input
                                    type="email"
                                    defaultValue={selectedUser.email}
                                    className="w-full border rounded p-2"
                                    disabled
                                />
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
                        <Dialog.Title className="text-lg font-bold mb-2 text-red-600">
                            Confirm Delete
                        </Dialog.Title>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this student? This action cannot
                            be undone.
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
