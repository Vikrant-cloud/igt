import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from 'react-router'
import AuthLayout from "@/components/Layouts/AuthLayout";
import { createUser } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useState } from "react";
import Button from "@/components/Button";
import type { Inputs } from "@/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup"

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  role: Yup.string().required("Please select role."),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),

});

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema)
  })
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)
    try {
      const response = await createUser({ ...data });
      toast.success(response?.data?.message || "User created successfully!");
      await login(data.email, data.password, data.role);
      navigate("/");
    } catch (error: any) {
      console.error("User creation failed:", error);
      const message =
        error?.response?.data?.message || "Something went wrong during user creation.";
      return toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout type="Create a new account">
      <div className="flex items-center justify-center px-4 py-10">

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-8">
          {/* Illustration Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/images/img.png"
              alt="Login Illustration"
              className="w-4/5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
            />
          </div>
          <div className="w-full lg:w-1/2">

            <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-6 text-center lg:text-left">Create your account</h2>


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full" >
              <div>
                <input
                  {...register("name", { required: "Name required" })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  placeholder="Enter your name"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div>
                <input
                  {...register("email", { required: true })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  placeholder="Enter your email"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  placeholder="Enter a Password"
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>

              {/* Confirm Password */}
              <div>
                <input
                  type="password"
                  {...register("confirmPassword", { required: true })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
              </div>

              {/* Role */}
              <div>
                <select
                  {...register("role", { required: "Role is required" })}
                  className="w-full px-5 py-3 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%2218px%22%20height%3D%2218px%22%20viewBox%3D%220%200%200.54%200.54%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Ctitle%3Edown_line%3C%2Ftitle%3E%3Cg%20id%3D%22%E9%A1%B5%E9%9D%A2-1%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20id%3D%22Arrow%22%20transform%3D%22translate(-288)%22%3E%3Cg%20id%3D%22down_line%22%20transform%3D%22translate(288)%22%3E%3Cpath%20d%3D%22M0.54%200v0.54H0V0zM0.283%200.523l0%200%20-0.002%200.001%200%200%200%200%20-0.002%20-0.001q0%200%20-0.001%200l0%200%200%200.01%200%200%200%200%200.002%200.002%200%200%200%200%200.002%20-0.002%200%200%200%200%200%20-0.01q0%200%200%200m0.006%20-0.003%200%200%20-0.004%200.002%200%200%200%200%200%200.01%200%200%200%200%200.005%200.002q0%200%200.001%200l0%200%20-0.001%20-0.014q0%200%200%200m-0.016%200a0%200%200%200%200%20-0.001%200l0%200%20-0.001%200.014q0%200%200%200.001l0%200%200.005%20-0.002%200%200%200%200%200%20-0.01%200%200%200%200z%22%20id%3D%22MingCute%22%20fill-rule%3D%22nonzero%22%2F%3E%3Cpath%20d%3D%22M0.286%200.353a0.022%200.022%200%200%201%20-0.032%200L0.127%200.226A0.022%200.022%200%201%201%200.159%200.194l0.111%200.111%200.111%20-0.111a0.022%200.022%200%200%201%200.032%200.032z%22%20id%3D%22%E8%B7%AF%E5%BE%84%22%20fill%3D%22%2309244B%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1.25rem center',
                    backgroundSize: '1.25rem 1.25rem',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                  }}
                >
                  <option value="">Select Role</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
                {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
              </div>

              {/* Submit Button */}
              <Button name={"Sign Up"} loading={loading} />
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