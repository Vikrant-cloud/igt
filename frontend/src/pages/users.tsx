import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { fetchUsers } from "@/api/auth";
import Layout from "@/components/Layouts/Layout";
import { useReactQuery } from "@/utils/useReactQuery";
import { useForm, Controller } from "react-hook-form";
import React from "react";
import api from "@/utils/axios";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    profilePicture?: string;
}

export default function Users() {
    const { data, isLoading, isError, error, refetch } = useReactQuery(
        ['users', 1, 10],
        fetchUsers,
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [previewPic, setPreviewPic] = useState<string | null>(null);

    const { control, register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: selectedUser?.name || "",
            email: selectedUser?.email || "",
            role: selectedUser?.role || "",
            profilePicture: selectedUser?.profilePicture || null,
        },
    });

    // Reset form when modal opens with selected user
    React.useEffect(() => {
        if (selectedUser) {
            reset({
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role,
                profilePicture: selectedUser.profilePicture || null,
            });
            setPreviewPic(selectedUser.profilePicture || null);
        }
    }, [selectedUser, reset]);

    // Update preview when a new file is selected
    const handleProfilePicPreview = (file: File | null) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewPic(url);
        } else if (selectedUser?.profilePicture) {
            setPreviewPic(selectedUser.profilePicture);
        } else {
            setPreviewPic(null);
        }
    };

    const handleEdit = (userId: string) => {
        const user = data?.users.find((u: User) => u._id === userId);
        setSelectedUser(user || null);
        setIsModalOpen(true);
        // No need to call reset() here, useEffect will handle it
    };

    const handleDelete = async (userId: string) => {
        console.log('Delete user:', userId);
        await api.delete(`/users/${userId}`)
        toast.success("User deleted successfully");
        await refetch(); // Refetch users after deletion
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const onSubmit = async (data: any) => {
        if (!selectedUser) return;

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);

        // If a new profilePicture is selected, add it; otherwise, skip
        if (data.profilePicture instanceof File) {
            formData.append("profilePicture", data.profilePicture);
        }

        try {
            await api.put(`/users/${selectedUser._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await refetch(); // Refetch users after update
            // Optionally refetch users here
            // await refetch();
            handleModalClose();

        } catch (err) {
            console.error("User update error:", err);
        }
    };

    if (isLoading) return <Loading />;
    if (isError) return <p>Error: {error.message}</p>;

    return (
        <Layout>
            <div className="min-h-screen mx-auto w-full bg-gradient-to-br from-indigo-50 flex flex-col items-center justify-start">
                <div className="w-full">
                    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-400 px-6 py-5 shadow-lg flex items-center justify-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide text-center w-full">Users List</h2>
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
                                    <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.users.map((user: User) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <img
                                                src={user.profilePicture}
                                                alt="Profile Preview"
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
                                        <td className="px-4 sm:px-6 py-4 space-x-2 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(user?._id)}
                                                className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {data?.users.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 sm:px-6 py-4 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Edit User Modal */}
            <Dialog open={isModalOpen} onClose={handleModalClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-4 sm:p-6 shadow-xl relative">
                        <button
                            onClick={handleModalClose}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>
                        <Dialog.Title className="text-lg font-bold mb-4 text-indigo-700">
                            Edit User
                        </Dialog.Title>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    {...register("name")}
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Profile Pic</label>
                                <Controller
                                    name="profilePicture"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => {
                                                const file = e.target.files?.[0] || null;
                                                field.onChange(file);
                                                handleProfilePicPreview(file);
                                            }}
                                            className="mt-1 block w-full"
                                        />
                                    )}
                                />
                                {previewPic && (
                                    <img
                                        src={previewPic}
                                        alt="Profile Preview"
                                        className="mt-2 h-16 w-16 rounded-full object-cover border border-gray-200 mx-auto"
                                    />
                                )}
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Layout>
    );
}
