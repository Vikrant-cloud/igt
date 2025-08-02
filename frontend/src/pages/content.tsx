import React, { useState } from 'react';
import { useForm, } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import Layout from '@/components/Layouts/Layout';
import api from '@/utils/axios';
import { useAuth } from '@/hooks/useAuth';
import { useReactQuery } from '@/utils/useReactQuery';
import { getContentList } from '@/api/auth';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import Modal from '@/components/Modal';

type createdByUser = {
    _id: string;
    name: string;
}

type FormValues = {
    title: string;
    subject: string;
    description: string;
    media: FileList | string;
    createdBy: string | createdByUser
};

export type Content = {
    _id: string;
    title: string;
    subject: string;
    description: string;
    media: string;
    createdBy: string | createdByUser
    createdAt: string
};

const ContentPage: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<Content | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const page = 1;
    const limit = 10;

    const { data, refetch } = useReactQuery(
        ['content', page, limit],
        () => getContentList({ queryKey: ['content', page, limit] }),
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>();

    const handleOpen = () => {
        reset();
        setIsOpen(true);
        setIsEditMode(false);
    };

    const handleEdit = (item: Content) => {
        setEditContent(item);
        setIsEditMode(true);
        setIsOpen(true);
        reset({
            title: item.title,
            subject: item.subject,
            description: item.description,
            media: item.media, // File input can't be pre-filled
        });
    };

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
        } catch (err) {
            console.error('Upload Error:', err);
        } finally {
            setLoading(false);
        }
        setIsOpen(false);
    };

    return (
        <Layout>
            <div className="p-8 w-full px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Content List</h1>
                    <Button name={"Create Content"} onClick={handleOpen} type={true} />
                </div>

                {data?.contents?.length === 0 ? (
                    <p className="text-gray-500">No content added yet.</p>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {data?.contents.map((item: Content, idx: string) => (
                            <div
                                key={idx}
                                className="flex flex-col border border-gray-200 bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full group"
                            >
                                <div className="flex-1 flex flex-col gap-2">
                                    <h2 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-900 transition-colors truncate mb-1">{item.title}</h2>
                                    <p className="text-xs text-gray-400 mb-1">Subject: <span className="text-gray-600 font-medium">{item.subject}</span></p>
                                    <p className="text-gray-700 text-sm mb-2 line-clamp-3">{item.description}</p>
                                    {item.media && (
                                        <div className="w-full aspect-video rounded-lg overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                                            <video className="w-full h-full object-cover rounded-lg" controls>
                                                <source key={item.media} src={item.media} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-1">
                                    <p className="text-xs text-gray-400">Created at: <span className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</span></p>
                                    <p className="text-xs text-gray-400">Created By: <span className="text-gray-500">{typeof item.createdBy === 'string' ? item.createdBy : item.createdBy.name}</span></p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-full font-semibold shadow transition-colors cursor-pointer"
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteId(item._id);
                                            setConfirmOpen(true);
                                        }}
                                        className="flex items-center gap-2 bg-gray-300 text-gray-900 hover:bg-gray-400 px-4 py-2 rounded-full font-semibold shadow transition-colors cursor-pointer"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Content Modal */}

                <Modal isOpen={isOpen} setIsOpen={setIsOpen} isEditMode={isEditMode}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputBox title="title" register={register} errors={errors} errorMsg="Title is required." />

                        <InputBox title="subject" register={register} errors={errors} errorMsg="Subject is required." />

                        <InputBox title="description" register={register} errors={errors} errorMsg="Description is required." inputType="textarea" />

                        <InputBox title="media" register={register} errors={errors} errorMsg="Media is required." type="file" />

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

export default ContentPage;
