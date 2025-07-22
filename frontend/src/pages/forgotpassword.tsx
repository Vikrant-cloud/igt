import { useState } from "react";
import AuthLayout from "@/components/Layouts/AuthLayout";
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import api from "@/utils/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";
import clsx from "clsx";

type Inputs = {
    email: string
}

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);
        api.post('/auth/forgot-password', { email: data.email })
            .then(response => {
                setLoading(false);
                console.log("Password reset link sent to email:", response.data);
                toast.success("Password reset link sent to your email.");
            })
            .catch(error => {
                setLoading(false);
                console.error("Error sending password reset link:", error);
                toast.error("Failed to send password reset link. Please try again.");
            });
    }

    return (
        <AuthLayout type="forgot-password">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                    <p className="text-gray-600 mb-6">Enter your email to reset your password.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
                        <input
                            placeholder="Email"
                            {...register("email", { required: true })}
                            className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">Email is required</span>
                        )}
                        <button
                            disabled={loading}
                            className={clsx(
                                'w-full bg-red-500 text-white py-3 rounded-full font-semibold tracking-widest transition',
                                loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-red-600'
                            )}>
                            {loading ? <LoadingSpinner /> : "Send Link"}
                        </button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}       