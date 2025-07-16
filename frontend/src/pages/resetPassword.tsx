import AuthLayout from "../components/Layouts/AuthLayout";
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import api from "../utils/axios";
import { useParams, useNavigate } from 'react-router';

type Inputs = {
    password: string
}

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data);
        api.post('/auth/reset-password', { token: token, newPassword: data.password })
            .then(response => {
                console.log("Password reset link sent to email:", response.data);
                navigate("/login");
            })
            .catch(error => {
                console.error("Error sending password reset link:", error);
            });
    }

    return (
        <AuthLayout type="forgot-password">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                    <p className="text-gray-600 mb-6">Enter new password.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
                        <input
                            placeholder="Password"
                            {...register("password", { required: true })}
                            className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">Password is required</span>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-red-500 text-white py-3 rounded-full font-semibold tracking-widest hover:bg-red-600 transition"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}       