import AuthLayout from "@/components/Layouts/AuthLayout";
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import api from "@/utils/axios";

type Inputs = {
    email: string
}

export default function ForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        api.post('/auth/forgot-password', { email: data.email })
            .then(response => {
                console.log("Password reset link sent to email:", response.data);
            })
            .catch(error => {
                console.error("Error sending password reset link:", error);
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
                            type="submit"
                            className="w-full bg-red-500 text-white py-3 rounded-full font-semibold tracking-widest hover:bg-red-600 transition"
                        >
                            Send Link
                        </button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}       