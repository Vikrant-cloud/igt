import AuthLayout from "@/components/Layouts/AuthLayout";
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import api from "@/utils/axios";
import { useParams, useNavigate, Link } from 'react-router';
import Button from "@/components/Button";
import { useState } from "react";
import { toast } from "react-toastify";

type Inputs = {
    password: string
}

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);
        api.post('/auth/reset-password', { token: token, newPassword: data.password })
            .then(() => {
                toast.success("Password has been reset successfully. You can now log in with your new password.");
                navigate("/login");
            })
            .catch(error => {
                console.error("Error sending password reset link:", error);
            }).finally(() => {
                setLoading(false);
            });
    }

    return (
        <AuthLayout type="Add new password">
            <div className="flex items-center justify-center px-4 py-10">
                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-8">
                    {/* Form Section */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-6 text-center lg:text-left">Reset your Password</h2>
                        <p className="text-gray-600 mb-6 text-center lg:text-left">Enter new password.</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
                            <input
                                placeholder="Password"
                                type="password"
                                {...register("password", { required: true })}
                                className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">Password is required</span>
                            )}
                            <Button name="Reset password" loading={loading} />
                            <Link to="/login" className="hover:text-red-500">
                                Back to Login
                            </Link>
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