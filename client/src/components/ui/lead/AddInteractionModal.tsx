import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { interactionTypes } from "../../../data/dropDownData";
import * as apiClient from "../../../api-client";
import Toast from "../Toast";
import { InteractionTypes } from "../../../types/InteractionTypes";

const AddInteractionModal = ({
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
  } = useForm<InteractionTypes>();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      if (leadId) {
        const response = await apiClient.createInteraction(
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
            Add New Interaction
          </h1>
        </div>
        <form onSubmit={onSubmit} className="w-full space-y-4">
          {/* Interaction Type */}
          <div>
            <label
              htmlFor="interactionType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Interaction Type
            </label>
            <select
              id="interactionType"
              {...register("interactionType", {
                required: "This field is required",
              })}
              className="border-0 rounded-md w-full px-2 py-1.5 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              <option value="">Select an interaction type</option>
              {interactionTypes.map((type) => {
                return (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                );
              })}
            </select>
            <div className="h-3">
              {errors.interactionType && (
                <span className="text-sm text-pink-500">
                  {errors.interactionType.message}
                </span>
              )}
            </div>
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
              {...register("notes")}
              className="border-0 rounded-md w-full px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              rows={4}
              placeholder="Add details of the interaction..."
            ></textarea>
            <div className="h-3">
              {errors.notes && (
                <span className="text-sm text-pink-500">
                  {errors.notes.message}
                </span>
              )}
            </div>
          </div>

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

export default AddInteractionModal;
