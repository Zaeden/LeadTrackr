import { useForm } from "react-hook-form";
import * as apiClient from "../../api-client";
import { useState } from "react";
import Toast from "../../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

export type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await apiClient.login(data);
      Toast(response.message, "success");
      setAuthenticated(true);
      reset();
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        Toast(error.message, "error");
        throw error;
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="bg-gray-100 min-h-full h-screen flex flex-col justify-center items-center px-6 py-6 lg:px-8">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="mb-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="text-4xl text-center text-gray-800 font-bold pt-4 pb-8">
            Lead Trackr
          </h1>
          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-2">
            Welcome back
          </h2>
          <h3 className="text-sm text-center font-normal text-gray-500">
            Login with your email and password
          </h3>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm w-full">
          <form onSubmit={onSubmit} className="w-full">
            <label
              htmlFor="email"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "This field is required" })}
              className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />

            <div className="h-7">
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <label
              htmlFor="password"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />

            <div className="h-7">
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-10 block rounded-md w-full mt-4 px-3 py-1.5 bg-indigo-600 text-white font-semibold text-sm/6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? (
                <FaSpinner className="animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
