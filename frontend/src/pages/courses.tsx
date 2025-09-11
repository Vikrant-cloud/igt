import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
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
import Course from '@/components/Course/Course';
import Pagination from '@/components/Pagination';
import { useSearchParams } from 'react-router';

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
    description: Yup.string().required("Description is required"),
    media: Yup
        .mixed<FileList>()
        .test("required", "You must upload at least 1 file", (value) => value && value.length > 0)
        .test("fileType", "Only images, PDFs, or videos are allowed", (value) => value && Array.from(value).every((file) => allowedTypes.includes(file.type)))
        .test("fileSize", "Each file must be less than 5MB", (value) => value && Array.from(value).every((file) => file.size <= 5 * 1024 * 1024)),
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
    media?: string[];
    createdBy: createdByUser
    createdAt: string
    price: string
    isApproved: boolean
    purchasedBy: string[]
};

const ContentPage: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<Content | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const limit = 3;

    const { data, refetch, isLoading } = useReactQuery(
        ['content', page, limit],
        () => getContentList({ queryKey: ['content', page, limit] }),
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema)
    });

    const handleOpen = () => {
        reset();
        setSelectedFiles([]);
        setIsOpen(true);
        setIsEditMode(false);
    };

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
    //     setSelectedFiles([]);
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

    const FileListWrapper = (files: File[]): FileList => {
        const dataTransfer = new DataTransfer();
        files.forEach((file) => dataTransfer.items.add(file));
        return dataTransfer.files;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            setSelectedFiles((prev) => [...prev, ...newFiles]);

            setValue("media", FileListWrapper([...selectedFiles, ...newFiles]));
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        const dt = new DataTransfer();
        selectedFiles.forEach((file, i) => {
            if (i !== index) dt.items.add(file);
        });
        setValue("media", dt.files);
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('subject', data.subject);
        formData.append('description', data.description);
        formData.append('price', data.price);

        selectedFiles.forEach(file => {
            formData.append('media', file);
        });

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
            setSelectedFiles([]);
            setEditContent(null);
            setIsEditMode(false);
            setIsOpen(false);
        } catch (err: any) {
            console.error('Upload Error:', err);
            toast.error(err.response?.data?.message || "Upload failed")
        } finally {
            setLoading(false);
        }
    };

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
    }

    if (isLoading) return (
        <Layout>
            <Loading />
        </Layout>
    );

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
                        {data?.contents.map((item: Content) => (
                            // <div
                            //     key={item._id}
                            //     className="flex flex-col border border-gray-200 bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full group"
                            // >
                            //     <Course item={item} />
                            //     <div className="flex gap-2 mt-4">
                            //         <button
                            //             onClick={() => handleEdit(item)}
                            //             className="flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-full font-semibold shadow transition-colors cursor-pointer"
                            //         >
                            //             <PencilSquareIcon className="w-5 h-5" />
                            //             Edit
                            //         </button>
                            //         <button
                            //             onClick={() => {
                            //                 setDeleteId(item._id);
                            //                 setConfirmOpen(true);
                            //             }}
                            //             className="flex items-center gap-2 bg-gray-300 text-gray-900 hover:bg-gray-400 px-4 py-2 rounded-full font-semibold shadow transition-colors cursor-pointer"
                            //         >
                            //             <TrashIcon className="w-5 h-5" />
                            //             Delete
                            //         </button>
                            //         {
                            //             !item.isApproved && <p>Approval pending</p>
                            //         }
                            //     </div>
                            // </div>
                            <Course item={item} user={user} />
                        ))}
                    </div>
                )}
                <Pagination
                    total={data?.pagination?.total || 0}
                    pageSize={limit}
                    currentPage={page}
                    onPageChange={onPageChange}
                />

                {/* Content Modal */}
                <Modal isOpen={isOpen} setIsOpen={setIsOpen} isEditMode={isEditMode}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputBox title="title" register={register} errors={errors} />
                        <InputBox title="subject" register={register} errors={errors} />
                        <InputBox title="description" register={register} errors={errors} inputType="textarea" />
                        <InputBox title="price" register={register} errors={errors} type="number" />
                        <div>
                            <label className="block text-sm font-medium mb-1">Media Files</label>
                            <input
                                type="file"
                                multiple
                                accept={allowedTypes.join(',')}
                                onChange={handleFileChange}
                                className="block w-full border border-gray-300 rounded p-2"
                            />
                            {errors.media && <p className="text-red-500 text-sm">{errors.media.message}</p>}
                            {/* Attractive file preview */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {selectedFiles.map((file, idx) => (
                                        <div key={idx} className="relative bg-gray-50 border rounded-lg p-2 flex flex-col items-center shadow">
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                                                title="Remove"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="h-20 w-20 object-cover rounded mb-2"
                                                />
                                            ) : file.type.startsWith('video/') ? (
                                                <video
                                                    src={URL.createObjectURL(file)}
                                                    controls
                                                    className="h-20 w-20 object-cover rounded mb-2"
                                                />
                                            ) : file.type === "application/pdf" ? (
                                                <div className="flex flex-col items-center justify-center h-20 w-20 bg-gray-200 rounded mb-2">
                                                    <span className="text-xs text-gray-700">PDF</span>
                                                    <a
                                                        href={URL.createObjectURL(file)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline text-xs mt-1"
                                                    >
                                                        Preview
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-20 w-20 bg-gray-200 rounded mb-2">
                                                    <span className="text-xs text-gray-700">File</span>
                                                </div>
                                            )}
                                            <span className="text-xs text-gray-600 truncate w-full text-center">{file.name}</span>
                                            <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
