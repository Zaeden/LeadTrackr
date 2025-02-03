import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import * as apiClient from "../../../api-client";
import Toast from "../Toast";

export type FollowUpFormType = {
  followUpDate: string;
  notes: string;
};

const AddFollowUpModal = ({
  leadId,
  onClose,
  onAdd,
}: {
  leadId: string | undefined;
  onClose: () => void;
  onAdd: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FollowUpFormType>();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    setLoading(true);
    try {
      if (leadId) {
        const response = await apiClient.createLeadFollowUp(
          parseInt(leadId, 10),
          data
        );
        if (response.success) {
          onAdd();
        }
        Toast(response.message, "success");
        reset();
      }
    } catch (error) {
      if (error instanceof Error) {
        Toast(error.message, "error");
      }
    } finally {
      setLoading(false);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="border w-full max-w-md p-8 space-y-6 text-gray-700 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl text-center font-bold text-gray-700">
          Add Follow-Up
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Follow-Up Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Follow-Up Date
            </label>
            <input
              type="date"
              id="date"
              {...register("followUpDate", { required: "Date is required" })}
              className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-purple-600"
            />
            {errors.followUpDate && (
              <p className="text-sm text-pink-500">
                {errors.followUpDate.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              {...register("notes", { required: "Notes are required" })}
              className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-purple-600"
              rows={4}
              placeholder="Follow-up details..."
            />
            {errors.notes && (
              <p className="text-sm text-pink-500">{errors.notes.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-1/2 px-3 py-1.5 mt-4 bg-pink-500 text-white rounded-md font-semibold text-sm/6 shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              Cancel
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-9 w-1/2 rounded-md mt-4 px-3 py-1.5 bg-purple-500 text-white font-semibold text-sm/6 shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFollowUpModal;
