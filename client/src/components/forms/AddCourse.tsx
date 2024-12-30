import { useForm } from "react-hook-form";
import * as apiClient from "../../api-client";
import { useState } from "react";
import Toast from "../ui/Toast";
import { FaSpinner } from "react-icons/fa";

export type AddCourseFormType = {
  name: string;
  level: "DIPLOMA" | "BACHELORS" | "MASTERS" | "DOCTORATE";
};

const AddCourse = ({
  onClose,
  onAddUser,
}: {
  onClose: () => void;
  onAddUser: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AddCourseFormType>();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await apiClient.createCourse(data);
      if (response.success) {
        onAddUser();
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
            Add Course
          </h1>
        </div>
        <form onSubmit={onSubmit} className="w-full space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="firstName"
              {...register("name", {
                required: "Course Name is required",
              })}
              className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            />
            <div className="h-3">
              {errors.name && (
                <span className="text-sm text-pink-500">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>

          {/* Level */}
          <div>
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              {...register("level", { required: "Level is required" })}
              className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              <option value="">Select a level</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="BACHELORS">Bachelors</option>
              <option value="MASTERS">Masters</option>
              <option value="DOCTORATE">Doctorate</option>
            </select>
            <div className="h-3">
              {errors.level && (
                <span className="text-sm text-pink-500">
                  {errors.level.message}
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
                "Add Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
