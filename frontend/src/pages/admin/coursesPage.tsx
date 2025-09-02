import React, { useState } from 'react';
import { useForm, } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
// import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import Layout from '@/components/Layouts/Layout';
import api from '@/utils/axios';
import { useAuth } from '@/hooks/useAuth';
import { useReactQuery } from '@/utils/useReactQuery';
import { getContentList } from '@/api/auth';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup"
// import Course from '@/components/Course/Course';

const allowedTypes = [
    // Images
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff",
    // PDF
    "application/pdf",
    // Videos
    "video/mp4", "video/avi", "video/mov", "video/mkv", "video/webm", "video/quicktime", "video/x-msvideo"
];

const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    subject: Yup.string().required("Subject is required"),
    description: Yup.string().required("Subject is required"),
    media: Yup.mixed<FileList>()
        .required("Please upload at least one file")
        .test("fileType", "Some files have unsupported formats", (value) => {
            if (!value || value.length === 0) return false;
            return Array.from(value).every((file) => allowedTypes.includes(file.type));
        })
        .test("fileSize", "Some files are too large (max 5MB)", (value) => {
            if (!value || value.length === 0) return false;
            return Array.from(value).every((file) => file.size <= 5 * 1024 * 1024);
        }),
    price: Yup.string().required("Price is required")
});

type createdByUser = {
    _id: string;
    name: string;
}

type FormValues = {
    title: string;
    subject: string;
    description: string;
    media: FileList;
    price: string
};

export type Content = {
    _id: string;
    title: string;
    subject: string;
    description: string;
    media?: string;
    createdBy: createdByUser | string
    createdAt: string
    price: string
    isApproved: boolean
};

const CoursesPage: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<Content | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const page = 1;
    const limit = 10;

    const { data, refetch, isLoading } = useReactQuery(
        ['content', page, limit],
        () => getContentList({ queryKey: ['content', page, limit] }),
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema)
    });

    // const handleOpen = () => {
    //     reset();
    //     setIsOpen(true);
    //     setIsEditMode(false);
    // };

    // const handleEdit = (item: Content) => {
    //     setEditContent(item);
    //     setIsEditMode(true);
    //     setIsOpen(true);
    //     reset({
    //         title: item.title,
    //         subject: item.subject,
    //         description: item.description,
    //         media: undefined,
    //         price: item.price
    //     });
    // };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/content/${id}`);
            await refetch();
            toast.success('Content deleted successfully');
        } catch (err) {
            console.error('Delete Error:', err);
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('subject', data.subject);
        formData.append('description', data.description);
        formData.append('price', data.price);
        if (data.media || data.media[0]) {
            if (typeof data.media === 'string') {
                formData.append('media', data.media);
            } else if (data.media instanceof FileList && data.media.length > 0) {
                formData.append('media', data.media[0]);
            }
        }
        formData.append('createdBy', user?._id ?? '');

        try {
            if (isEditMode && editContent) {
                await api.put(`/content/${editContent._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Content updated successfully');
            } else {
                await api.post("/content/create-content", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Content created successfully');
            }
            await refetch();
            reset();
            setEditContent(null);
            setIsEditMode(false);
            setIsOpen(false);
        } catch (err: any) {
            console.error('Upload Error:', err);
            toast.error(err.response.data.message)
        } finally {
            setLoading(false);
        }

    };

    const approveCourse = async (id: string) => {
        await api.post(`/content/approve/${id}`)
            .then(() => {
                toast.success('Course approved successfully');
                refetch();
            })
            .catch((err) => {
                console.error('Approval Error:', err);
                toast.error('Failed to approve course');
            });
    }

    if (isLoading) return (
        <Layout>
            <Loading />
        </Layout>
    );

    return (
        <Layout>
            <div className="p-8 w-full px-4">
                {/* <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Content List</h1>
                    <Button name={"Create Content"} onClick={handleOpen} type={true} />
                </div> */}

                <div className="min-h-screen mx-auto w-full bg-gradient-to-br from-indigo-50 flex flex-col items-center justify-start">
                    <div className="w-full">
                        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-400 px-6 py-5 shadow-lg flex items-center justify-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide text-center w-full">Courses List</h2>
                        </div>
                        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Name</th>
                                        <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Subject</th>
                                        <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Price</th>
                                        <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Teacher</th>
                                        <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Status</th>
                                        <th className="px-4 sm:px-6 py-3 text-base sm:text-lg font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.contents.map((item: Content) => (
                                        <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-4 sm:px-6 py-4">
                                                {item.title}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">{item.subject}</td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{item.price}</td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{typeof item.createdBy === 'string' ? item.createdBy : item.createdBy.name}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {item.isApproved ? 'Approved' : 'Unapproved'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 space-x-2 whitespace-nowrap">
                                                {!item.isApproved &&
                                                    <Button name="Approve" onClick={() => { approveCourse(item._id) }} type={true} />
                                                }

                                                <button
                                                    onClick={() => { }}
                                                    className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => { }}
                                                    className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {data?.contents.length === 0 && (
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

                {/* Content Modal */}

                <Modal isOpen={isOpen} setIsOpen={setIsOpen} isEditMode={isEditMode}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputBox title="title" register={register} errors={errors} />
                        <InputBox title="subject" register={register} errors={errors} />
                        <InputBox title="description" register={register} errors={errors} inputType="textarea" />
                        <InputBox title="price" register={register} errors={errors} type="number" />
                        <InputBox title="media" register={register} errors={errors} type="file" />

                        <div className="pt-2">
                            <Button name={isEditMode ? "Update Content" : "Create Content"} loading={loading} />
                        </div>
                    </form>
                </Modal >

                {/* Confirmation Modal */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-sm bg-white rounded-lg p-6 shadow-xl relative">
                            <Dialog.Title className="text-lg font-bold mb-4">Confirm Delete</Dialog.Title>
                            <p className="mb-6 text-gray-700">Are you sure you want to delete this content? This action cannot be undone.</p>
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
            </div>
        </Layout>
    );
};

export default CoursesPage;
