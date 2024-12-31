import { useForm } from "react-hook-form";
import * as apiClient from "../../api-client";
import { useEffect, useState } from "react";
import Toast from "../ui/Toast";
import { FaSpinner } from "react-icons/fa";
import { LeadType } from "../../types/LeadType";
import {
  courseLevelOptions,
  genderOptions,
  indianStates,
  priorityOptions,
  sourceOptions,
} from "../../data/dropDownData";

const AddLead = ({
  onClose,
  onAddLead,
}: {
  onClose: () => void;
  onAddLead: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);

  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm<LeadType>();

  const watchLevel = watch("level");

  useEffect(() => {
    const fetchCourses = async (level: string) => {
      try {
        const response = await apiClient.getAllCoursesByLevel(level);
        setCourses(response.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };
    if (watchLevel) {
      fetchCourses(watchLevel);
    } else {
      setCourses([]);
    }
  }, [watchLevel]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await apiClient.createLead(data);
      if (response.success) {
        onAddLead();
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
    <div className="fixed px-4 inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50 overflow-y-auto">
      <div className="border w-xl md:w-10/12 max-h-[90vh] overflow-y-auto p-8 space-y-6 text-gray-700 bg-white rounded-lg shadow-md over">
        <div className="mb-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="text-3xl text-center font-bold text-gray-700">
            Add Lead
          </h1>
        </div>
        <form onSubmit={onSubmit} className="w-full space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name <span className="text-pink-500">*</span>
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
                Last Name <span className="text-pink-500">*</span>
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

          {/* Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-pink-500">*</span>
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
                Phone <span className="text-pink-500">*</span>
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
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender <span className="text-pink-500">*</span>
              </label>
              <select
                id="gender"
                {...register("gender", { required: "Gender is required" })}
                className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                <option value="">Select your gender</option>
                {genderOptions.map((gender) => {
                  return <option value={gender.value}>{gender.label}</option>;
                })}
              </select>
              <div className="h-3">
                {errors.gender && (
                  <span className="text-sm text-pink-500">
                    {errors.gender.message}
                  </span>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                {...register("dob")}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              {errors.dob && (
                <span className="text-sm text-pink-500">
                  {errors.dob.message}
                </span>
              )}
            </div>
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Father Name */}
            <div>
              <label
                htmlFor="fatherName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Father Name
              </label>
              <input
                type="text"
                id="fatherName"
                {...register("fatherName", { required: false })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              <div className="h-3">
                {errors.fatherName && (
                  <span className="text-sm text-pink-500">
                    {errors.fatherName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Father Phone */}
            <div>
              <label
                htmlFor="fatherPhone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Father Phone
              </label>
              <input
                type="text"
                id="fatherPhone"
                {...register("fatherPhone", {
                  required: false,
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone must be a valid 10-digit number",
                  },
                })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              <div className="h-3">
                {errors.fatherPhone && (
                  <span className="text-sm text-pink-500">
                    {errors.fatherPhone.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* -----------Address Fields--------------- */}
          {/* Fifth Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Street Address */}
            <div>
              <label
                htmlFor="streetAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="streetAddress"
                {...register("streetAddress", {
                  required: false,
                })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              <div className="h-3">
                {errors.streetAddress && (
                  <span className="text-sm text-pink-500">
                    {errors.streetAddress.message}
                  </span>
                )}
              </div>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                {...register("city", {
                  required: false,
                })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              <div className="h-3">
                {errors.city && (
                  <span className="text-sm text-pink-500">
                    {errors.city.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sixth Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Postal Code */}
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                {...register("postalCode", {
                  required: false,
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Postal code must be a 6-digit number",
                  },
                })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              <div className="h-3">
                {errors.postalCode && (
                  <span className="text-sm text-pink-500">
                    {errors.postalCode.message}
                  </span>
                )}
              </div>
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State
              </label>
              <select
                id="state"
                {...register("state", { required: false })}
                className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                <option value="">Select State</option>
                {indianStates.map((state) => {
                  return <option value={state.value}>{state.label}</option>;
                })}
              </select>
              <div className="h-3">
                {errors.state && (
                  <span className="text-sm text-pink-500">
                    {errors.state.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Seventh Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                {...register("country", {
                  required: false,
                })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              />
              <div className="h-3">
                {errors.country && (
                  <span className="text-sm text-pink-500">
                    {errors.country.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ---------------------------------------- */}

          {/* Eighth Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Course Level */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Level <span className="text-pink-500">*</span>
              </label>
              <select
                id="level"
                {...register("level", {
                  required: "Course Level is required",
                })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                <option value="">Select a level</option>
                {courseLevelOptions.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.level && (
                <span className="text-sm text-pink-500">
                  {errors.level.message}
                </span>
              )}
            </div>

            {/* Course Name */}
            <div>
              <label
                htmlFor="courseId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Name <span className="text-pink-500">*</span>
              </label>
              <select
                id="courseId"
                {...register("courseId", { required: "Course is required" })}
                className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                disabled={!watchLevel}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <span className="text-sm text-pink-500">
                  {errors.courseId.message}
                </span>
              )}
            </div>
          </div>

          {/* Ninth Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Source */}
            <div>
              <label
                htmlFor="source"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Source <span className="text-pink-500">*</span>
              </label>
              <select
                id="source"
                {...register("source", { required: "Source is required" })}
                className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                <option value="">Select a source</option>
                {sourceOptions.map((source) => {
                  return <option value={source.value}>{source.label}</option>;
                })}
              </select>
              <div className="h-3">
                {errors.source && (
                  <span className="text-sm text-pink-500">
                    {errors.source.message}
                  </span>
                )}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority <span className="text-pink-500">*</span>
              </label>
              <select
                id="priority"
                {...register("priority", { required: "Priority is required" })}
                className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                <option value="">Select the priority</option>
                {priorityOptions.map((priority) => {
                  return (
                    <option value={priority.value}>{priority.label}</option>
                  );
                })}
              </select>
              <div className="h-3">
                {errors.priority && (
                  <span className="text-sm text-pink-500">
                    {errors.priority.message}
                  </span>
                )}
              </div>
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
                "Add Lead"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
