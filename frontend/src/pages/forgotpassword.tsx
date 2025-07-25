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
            <div className="flex items-center justify-center px-4 py-10">
                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-8">
                    {/* Form Section */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-6 text-center lg:text-left">Forgot Password</h2>
                        <p className="text-gray-600 mb-6 text-center lg:text-left">Enter your email to reset your password.</p>
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
                                )}
                            >
                                {loading ? <LoadingSpinner /> : "Send Link"}
                            </button>
                        </form>
                    </div>
                    {/* Illustration Section */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <img
                            src="/images/img.png"
                            alt="Forgot Password Illustration"
                            className="w-4/5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                        />
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}       