import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import Layout from "@/components/Layouts/Layout";
import api from "@/utils/axios";
import { useAuth } from "@/hooks/useAuth";
import { useReactQuery } from "@/utils/useReactQuery";
import { getContentList } from "@/api/auth";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import Modal from "@/components/Modal";
import Loading from "@/components/Loading";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    UsersIcon as Users,
    StarIcon as Star,
    StarIcon as StarHalf,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Link, useSearchParams } from "react-router";
import Pagination from "@/components/Pagination";

// random color util
const colors = [
    "#6366f1", // indigo
    "#10b981", // emerald
    "#ec4899", // pink
    "#f59e0b", // amber
    "#ef4444", // red
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#14b8a6", // teal
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    subject: Yup.string().required("Subject is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
    media: Yup.mixed<FileList>()
        .test("fileSize", "File is too large", (value) => {
            if (!value || value.length === 0) return true; // not required
            return value[0].size <= 10 * 1024 * 1024; // 10MB limit
        })
        .nullable(),
});

type createdByUser = {
    _id: string;
    name: string;
};

type FormValues = {
    title: string;
    subject: string;
    description: string;
    media: FileList;
    price: string;
};

export type Content = {
    _id: string;
    title: string;
    subject: string;
    description: string;
    media?: string;
    createdBy: createdByUser | string;
    createdAt: string;
    price: string;
    isApproved: boolean;
    purchasedBy: string[];
};

const CoursesPage: React.FC = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // UI states
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<Content | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const limit = 3;

    // Filters
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [subject, setSubject] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const { data, refetch, isLoading } = useReactQuery(
        ["content", page, limit],
        () =>
            getContentList({
                queryKey: ["content", page, limit],
            })
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    const handleEdit = (item: Content) => {
        setEditContent(item);
        setIsEditMode(true);
        setIsOpen(true);
        reset({
            title: item.title,
            subject: item.subject,
            description: item.description,
            media: undefined,
            price: item.price,
        });
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/content/${id}`);
            await refetch();
            toast.success("Course deleted successfully");
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("subject", data.subject);
        formData.append("description", data.description);
        formData.append("price", data.price);
        if (data.media?.[0]) {
            formData.append("media", data.media[0]);
        }
        formData.append("createdBy", user?._id ?? "");

        try {
            if (isEditMode && editContent) {
                await api.put(`/content/${editContent._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Course updated successfully");
            } else {
                await api.post("/content/create-content", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Course created successfully");
            }
            await refetch();
            reset();
            setEditContent(null);
            setIsEditMode(false);
            setIsOpen(false);
        } catch (err: any) {
            console.error("Upload Error:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const approveCourse = async (id: string) => {
        try {
            await api.post(`/content/approve/${id}`);
            toast.success("Course approved successfully");
            refetch();
        } catch (err) {
            toast.error("Failed to approve course");
        }
    };

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
    };

    const subjects = Array.from(
        new Set(data?.contents?.map((c: Content) => c.subject) || [])
    );

    if (isLoading)
        return (
            <Layout>
                <Loading />
            </Layout>
        );

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
                {/* Header */}
                <div className=" sm:flex-row items-center justify-between mb-6 gap-4">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                        Courses Management
                    </h1>
                </div>

                {/* Filters */}
                <div className="bg-white/90 shadow-md rounded-xl p-4 mb-8 flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                    </select>

                    {/* Subject Filter */}
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.map((subj, inx) => (
                            <option key={inx} value={String(subj)}>
                                {String(subj)}
                            </option>
                        ))}
                    </select>

                    {/* Price Filters */}
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-28 focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-28 focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                {/* Cards Grid */}
                {data?.contents?.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {data.contents.map((item: Content) => (
                                <div
                                    key={item._id}
                                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 border border-gray-100 flex flex-col"
                                >
                                    {/* Banner */}
                                    <Link
                                        to={`/admin/course/${item._id}`}
                                        style={{ backgroundColor: getRandomColor() }}
                                        className="relative w-full h-40 flex items-center justify-center p-4 text-center"
                                    >
                                        <h4 className="text-white text-lg font-bold drop-shadow-lg line-clamp-2">
                                            {item.title}
                                        </h4>
                                        {!item.isApproved && (
                                            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-md">
                                                Pending
                                            </span>
                                        )}
                                    </Link>

                                    {/* Card body */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                {item.subject}
                                            </span>
                                            <div className="flex items-center text-yellow-400 text-sm">
                                                {Array(Math.floor(4.6))
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 fill-current" />
                                                    ))}
                                                {4.6 % 1 > 0 && <StarHalf className="w-4 h-4 fill-current" />}
                                                <span className="ml-1 text-gray-500 text-xs">(4.6)</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-3">
                                            by{" "}
                                            {typeof item.createdBy === "string"
                                                ? item.createdBy
                                                : item.createdBy.name}
                                        </p>

                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                            <span className="text-xl font-bold text-green-600">
                                                ₹{item.price}
                                            </span>
                                            <div className="flex items-center text-gray-500 text-xs">
                                                <Users className="w-4 h-4 mr-1" />
                                                {item?.purchasedBy?.length} enrolled
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {!item.isApproved && (
                                                <button
                                                    onClick={() => approveCourse(item._id)}
                                                    className="flex items-center gap-1 text-green-600 border border-green-600 px-3 py-1 rounded-lg hover:bg-green-50 transition text-xs"
                                                >
                                                    <CheckCircleIcon className="h-4 w-4" /> Approve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="flex items-center gap-1 text-blue-600 border border-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-xs"
                                            >
                                                <PencilSquareIcon className="h-4 w-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setConfirmOpen(true);
                                                    setDeleteId(item._id);
                                                }}
                                                className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition text-xs"
                                            >
                                                <TrashIcon className="h-4 w-4" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            total={data?.pagination?.total}
                            pageSize={limit}
                            currentPage={page}
                            onPageChange={onPageChange}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <img
                            src="https://illustrations.popsy.co/gray/course-empty.svg"
                            alt="No courses"
                            className="w-40 mb-4"
                        />
                        <p>No courses found. Start by adding one!</p>
                    </div>
                )}

                {/* Modal */}
                <Modal isOpen={isOpen} setIsOpen={setIsOpen} isEditMode={isEditMode}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputBox title="title" register={register} errors={errors} />
                        <InputBox title="subject" register={register} errors={errors} />
                        <InputBox
                            title="description"
                            register={register}
                            errors={errors}
                            inputType="textarea"
                        />
                        <InputBox title="price" register={register} errors={errors} />
                        <InputBox title="media" register={register} errors={errors} type="file" />
                        <div className="pt-2">
                            <Button
                                name={isEditMode ? "Update Course" : "Create Course"}
                                loading={loading}
                            />
                        </div>
                    </form>
                </Modal>

                {/* Delete Confirmation */}
                <Dialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    className="relative z-50"
                >
                    <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
                            <Dialog.Title className="text-lg font-bold mb-2">
                                Confirm Delete
                            </Dialog.Title>
                            <p className="mb-6 text-gray-600">
                                Are you sure you want to delete this course? This action cannot
                                be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setConfirmOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
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
            </div>
        </Layout>
    );
};

export default CoursesPage;
