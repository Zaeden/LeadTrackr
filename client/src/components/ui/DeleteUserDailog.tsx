import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Toast from "./Toast";
import * as apiClient from "../../api-client";

const DeleteUserDailog = ({
  userId,
  onClose,
  onDeleteUser,
}: {
  userId: number | null;
  onClose: () => void;
  onDeleteUser: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.deleteUser(userId);
      if (response.success) {
        onDeleteUser();
      }
      Toast(response.message, "success");
    } catch (error) {
      if (error instanceof Error) {
        Toast(error.message, "error");
        throw error;
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="border w-full max-w-md p-8 space-y-6 text-gray-700 bg-white rounded-lg shadow-md">
        <div className="mb-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-xl text-gray-700 font-bold text-center mb-2">
            Are you sure?
          </h2>
          <p className="text-center text-sm font-semibold text-gray-500">
            You are about to deactivate this user.
          </p>
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

          {/* Delete Button */}
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="h-9 w-1/2 rounded-md mt-4 px-3 py-1.5  bg-purple-500 text-white font-semibold text-sm/6 shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Deactivate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserDailog;
