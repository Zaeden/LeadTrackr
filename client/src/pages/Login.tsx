import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useState } from "react";

export type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await apiClient.login(data);
      setSuccess(response.message);
      console.log(success);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        console.log(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  });

  return (
    <div className="min-h-full h-screen flex flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-4xl text-center font-bold pt-4 pb-8">
          Lead Trackr
        </h1>
        <h2 className="text-2xl text-center font-semibold pb-16">
          Sign in to your account
        </h2>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm w-full">
        <form onSubmit={onSubmit} className="w-full">
          <label
            htmlFor="email"
            className="block mb-2 font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "This field is required" })}
            className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          />

          <div className="h-7">
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <label
            htmlFor="password"
            className="block mb-2 font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          />

          <div className="h-7">
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="block rounded-md w-full mt-4 px-3 py-1.5 bg-indigo-600 text-white font-semibold text-sm/6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
