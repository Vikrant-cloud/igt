import { useState } from "react";
import type { Content } from "@/pages/courses";
import { Dialog } from "@headlessui/react";

const PreviewModal = ({
    isOpen,
    onClose,
    files,
}: {
    isOpen: boolean;
    onClose: () => void;
    files: string[];
}) => (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                >
                    ✕
                </button>
                <Dialog.Title className="text-lg font-bold mb-4">Course Files Preview</Dialog.Title>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {files.map((file, idx) => {
                        if (file.endsWith(".pdf") || file.includes("application/pdf")) {
                            return (
                                <div key={idx} className="flex flex-col items-center bg-gray-50 border rounded-lg p-2">
                                    <span className="text-xs text-gray-700 mb-2">PDF Document</span>
                                    <iframe
                                        src={file}
                                        title={`PDF-${idx}`}
                                        className="w-full h-40 border rounded"
                                    />
                                    <a
                                        href={file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-xs mt-1"
                                    >
                                        Open PDF
                                    </a>
                                </div>
                            );
                        }
                        if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                            return (
                                <div key={idx} className="flex flex-col items-center bg-gray-50 border rounded-lg p-2">
                                    <img src={file} alt={`img-${idx}`} className="h-32 w-full object-cover rounded mb-2" />
                                    <span className="text-xs text-gray-600">Image</span>
                                </div>
                            );
                        }
                        if (file.match(/\.(mp4|avi|mov|mkv|webm)$/i)) {
                            return (
                                <div key={idx} className="flex flex-col items-center bg-gray-50 border rounded-lg p-2">
                                    <video src={file} controls className="h-32 w-full object-cover rounded mb-2" />
                                    <span className="text-xs text-gray-600">Video</span>
                                </div>
                            );
                        }
                        return (
                            <div key={idx} className="flex flex-col items-center bg-gray-50 border rounded-lg p-2">
                                <span className="text-xs text-gray-700">File</span>
                                <a
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-xs mt-1"
                                >
                                    Open File
                                </a>
                            </div>
                        );
                    })}
                </div>
            </Dialog.Panel>
        </div>
    </Dialog>
);

const Course = ({ item }: { item: Content }) => {
    const [previewOpen, setPreviewOpen] = useState(false);

    const handlePreview = () => {
        setPreviewOpen(true);
    };

    return (
        <>
            <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-900 transition-colors truncate mb-1">{item.title}</h2>
                <p className="text-xs text-gray-400 mb-1">Subject: <span className="text-gray-600 font-medium">{item.subject}</span></p>
                <p className="text-gray-700 text-sm mb-2 line-clamp-3">{item.description}</p>
                {Array.isArray(item.media) && item.media.length > 0 ? (
                    <>
                        <button
                            onClick={handlePreview}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded mb-2 font-semibold w-fit"
                        >
                            Preview Files
                        </button>
                        {/* Show first file as thumbnail */}
                        <div className="w-full aspect-video rounded-lg overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                            {item.media[0].endsWith(".mp4") || item.media[0].endsWith(".mov") ? (
                                <video className="w-full h-full object-cover rounded-lg" controls>
                                    <source src={item.media[0]} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : item.media[0].endsWith(".pdf") ? (
                                <iframe
                                    src={item.media[0]}
                                    className="w-full h-full rounded-lg"
                                    title={`pdf-0`}
                                >
                                    This browser does not support PDFs.
                                    <a href={item.media[0]} target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>
                                </iframe>
                            ) : (
                                <img
                                    src={item.media[0]}
                                    alt={`media-0`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            )}
                        </div>
                        <PreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} files={item.media} />
                    </>
                ) : (
                    <p>No media available</p>
                )}
            </div>
            <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-1">
                <p className="text-xs text-gray-400">Created at: <span className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</span></p>
                <p className="text-xs text-gray-400">Created By: <span className="text-gray-500">{typeof item.createdBy === 'string' ? item.createdBy : item.createdBy.name}</span></p>
                <p className="text-xs text-gray-400">Price: Rs{item.price}</p>
            </div>
        </>
    )
}

export default Course