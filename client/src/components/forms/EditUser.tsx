import { useForm } from "react-hook-form";
import * as apiClient from "../../api-client";
import { useEffect, useState } from "react";
import Toast from "../ui/Toast";
import { FaSpinner } from "react-icons/fa";

export type AddUserFormType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "ADMIN" | "EMPLOYEE";
};

const EditUser = ({
  userId,
  onClose,
  onUpdateUser,
}: {
  userId: number | null;
  onClose: () => void;
  onUpdateUser: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    handleSubmit,
  } = useForm<AddUserFormType>();

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await apiClient.getUser(userId);
          if (response.success) {
            const { firstName, lastName, email, phone, role } = response.user;
            setValue("firstName", firstName);
            setValue("lastName", lastName);
            setValue("email", email);
            setValue("phone", phone);
            setValue("role", role);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          Toast("Failed to load user details", "error");
        }
      }
    };
    fetchData();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await apiClient.updateUser(userId, data);
      if (response.success) {
        onUpdateUser();
      }
      Toast(response.message, "success");
      reset();
    } catch (error) {
      if (error instanceof Error) {
        Toast(error.message, "error");
        throw error;
      }
    } finally {
      setLoading(false);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="border w-full max-w-md p-8 space-y-6 text-gray-700 bg-white rounded-lg shadow-md">
        <div className="mb-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="text-3xl text-center font-bold text-gray-700">
            Edit User Details
          </h1>
        </div>
        <form onSubmit={onSubmit} className="w-full space-y-4">
          <div className="flex gap-2">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                {...register("firstName", {
                  required: "First Name is required",
                })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              <div className="h-3">
                {errors.firstName && (
                  <span className="text-sm text-pink-500">
                    {errors.firstName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                {...register("lastName", {
                  required: false,
                })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              <div className="h-3">
                {errors.lastName && (
                  <span className="text-sm text-pink-500">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            />
            <div className="h-3">
              {errors.email && (
                <span className="text-sm text-pink-500">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone must be a valid 10-digit number",
                },
              })}
              className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            />
            <div className="h-3">
              {errors.phone && (
                <span className="text-sm text-pink-500">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          {/* Password */}
          {/* <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                min: {
                  value: 8,
                  message: "Password must be atleast 8 characters",
                },
              })}
              className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            />
            <div className="h-3">
              {errors.password && (
                <span className="text-sm text-pink-500">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div> */}

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
              className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              <option value="">Select a role</option>
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
            <div className="h-3">
              {errors.role && (
                <span className="text-sm text-pink-500">
                  {errors.role.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-1/2 px-3 py-1.5 mt-4 bg-pink-500 text-white rounded-md font-semibold text-sm/6 shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 "
            >
              Cancel
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-9 w-1/2 rounded-md mt-4 px-3 py-1.5  bg-purple-500 text-white font-semibold text-sm/6 shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              {loading ? (
                <FaSpinner className="animate-spin mx-auto" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
