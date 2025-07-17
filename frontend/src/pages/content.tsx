import React, { useState } from 'react';
import { useForm, } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layouts/Layout';
import api from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { useReactQuery } from '../utils/useReactQuery';
import { getContentList } from '../api/auth';

type FormValues = {
    title: string;
    subject: string;
    description: string;
    media: FileList;
    createdBy: string
};

type Content = {
    _id: string;
    title: string;
    subject: string;
    description: string;
    media: string;
    createdBy: string;
    createdAt: string
};

const ContentPage: React.FC = () => {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { data, isLoading, isError, error } = useReactQuery(
        ['content'],
        getContentList,
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('subject', data.subject);
        formData.append('description', data.description);
        formData.append('media', data.media[0]);
        formData.append('createdBy', user?._id ?? '')

        try {
            const res = await api.post("/content/create-content", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log('Upload Success:', res);
            reset()
        } catch (err) {
            console.error('Upload Error:', err);
        }
        setIsOpen(false);
    };

    return (
        <Layout>
            <div className="p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Content List</h1>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create Content
                    </button>
                </div>

                {data?.contents?.length === 0 ? (
                    <p className="text-gray-500">No content added yet.</p>
                ) : (
                    <div className="grid gap-4">
                        {data?.contents.map((item: Content, idx: string) => (
                            <div key={idx} className="border p-4 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">{item.title}</h2>
                                <p className="text-sm text-gray-600">Subject: {item.subject}</p>
                                <p className="mt-2">{item.description}</p>
                                {item.media && (
                                    <video width="240" height="360" controls>
                                        <source src={item.media} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                    Created at: {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-xl relative">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                            <Dialog.Title className="text-lg font-bold mb-4">Create New Content</Dialog.Title>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Title</label>
                                    <input
                                        type="text"
                                        {...register('title', { required: true })}
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm">Title is required.</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Subject</label>
                                    <input
                                        type="text"
                                        {...register('subject', { required: true })}
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    />
                                    {errors.subject && <p className="text-red-500 text-sm">Subject is required.</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Description</label>
                                    <textarea
                                        {...register('description', { required: true })}
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    />
                                    {errors.description && <p className="text-red-500 text-sm">Description is required.</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Media</label>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        {...register('media')}
                                        className="mt-1 block w-full"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </div>
        </Layout>
    );
};

export default ContentPage;
