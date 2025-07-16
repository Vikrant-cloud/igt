import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from 'react-router'
import AuthLayout from "../components/Layouts/AuthLayout";
import { createUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

type Inputs = {
  name: string
  email: string,
  role: string
  password: string
  confirmPassword: string
}

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await createUser({ ...data });
      toast.success(response?.data?.message || "User created successfully!");
      await login(data.email, data.password, data.role); // Log in after signup
      navigate("/");
    } catch (error: any) {
      console.error("User creation failed:", error);
      const message =
        error?.response?.data?.message || "Something went wrong during user creation.";
      return toast.error(message);
    }

  }

  return (
    <AuthLayout type="signup">
      <div className="min-h-screen flex items-center justify-center px-4 py-10">

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-8">
          {/* Illustration Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/src/assets/images/img.png"
              alt="Login Illustration"
              className="w-4/5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
            />
          </div>
          <div className="w-full lg:w-1/2">

            <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-6 text-center lg:text-left">Create your account</h2>


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full" >
              {/* Name */}
              <div>
                <input
                  {...register("name", { required: true })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  placeholder="Enter your name"
                />
                {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              {/* Email */}
              <div>
                <input
                  {...register("email", { required: true })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  placeholder="Enter your email"
                />
                {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  placeholder="Enter a Password"
                />
                {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
              </div>

              {/* Confirm Password */}
              <div>
                <input
                  type="password"
                  {...register("confirmPassword", { required: true })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && <span className="text-red-500 text-sm">Please confirm your password</span>}
              </div>

              {/* Role */}
              <div>
                <select
                  {...register("role", { required: "Role is required" })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 rounded-full font-semibold tracking-widest hover:bg-red-600 transition"
              >
                Sign up
              </button>
            </form>

            {/* Footer Link */}
            <p className=" mt-4 text-center text-sm text-gray-500">
              Already a member?{" "}
              <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
export default Signup;