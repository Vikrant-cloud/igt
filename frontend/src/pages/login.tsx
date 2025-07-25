import { useState } from "react";
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Link } from 'react-router';
import AuthLayout from "@/components/Layouts/AuthLayout";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import clsx from 'clsx';
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import api from "@/utils/axios";

type Inputs = {
  email: string
  password: string
  role: string
}

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth();
  const [loading, setLoading] = useState(false)
  // Initialize form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password, data.role).then((response) => {
        toast.success(response.message);
      })
      navigate("/");
    } catch (error: any) {
      setLoading(false)
    } finally {
      setLoading(false); // ✅ Loading reset in finally
    }
  };
  const handleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        const res = await api.post("/auth/google-login", {
          token: response.credential,
        });
        toast.success(res.data.message);
        window.location.reload();
      } catch (error) {
        console.error("Google login error", error);
      }
    }
  };

  const handleError = () => {
    toast.error("Google Login Failed");
  };

  return (
    <AuthLayout type="login">
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-6 text-center lg:text-left">
              User Login
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
              <input
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Email is required</span>
              )}

              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true })}
                className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">Password is required</span>
              )}

              <select
                {...register("role", { required: "Role is required" })}
                className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
              >
                <option value="" className="text-gray-400 rounded-full bg-white">Select Role</option>
                <option value="admin" className="text-black rounded-full bg-white hover:bg-gray-100">Admin</option>
                <option value="user" className="text-black rounded-full bg-white hover:bg-gray-100" >User</option>
              </select>
              {errors.role && (
                <span className="text-red-500 text-sm">{errors.role.message}</span>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-red-500" />
                  <span>Remember</span>
                </label>
                <Link to="/forgot-password" className="hover:text-red-500">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={clsx(
                  'w-full bg-red-500 text-white py-3 rounded-full font-semibold tracking-widest transition',
                  loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-red-600'
                )}
              >
                {loading ? <LoadingSpinner /> : "Sign In"}
              </button>

              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />

              <p className="text-center text-sm text-gray-500">
                Not a member?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-700 hover:text-blue-500"
                >
                  Signup
                </Link>
              </p>
            </form>
          </div>

          {/* Illustration Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/images/img.png"
              alt="Login Illustration"
              className="w-4/5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
            />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
export default Login;