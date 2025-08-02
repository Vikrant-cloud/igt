import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

export default function Modal({ children, isOpen, setIsOpen, isEditMode }: { children: ReactNode, isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; isEditMode?: boolean }) {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6 shadow-xl relative">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                    <DialogTitle className="text-lg font-bold mb-4">
                        {isEditMode ? 'Edit Content' : 'Create New Content'}
                    </DialogTitle>

                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}