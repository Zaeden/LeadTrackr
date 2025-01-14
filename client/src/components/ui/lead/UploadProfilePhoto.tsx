import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import * as apiClient from "../../../api-client";
import Toast from "../Toast";

interface UploadProfilePhotoProps {
  leadId: number;
  profilePic?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadProfilePhoto: React.FC<UploadProfilePhotoProps> = ({
  leadId,
  profilePic,
  onClose,
  onSuccess,
}) => {
  const [preview, setPreview] = useState<string>(profilePic || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Toast("Kindly select an image", "error");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await apiClient.profileImageUpload(leadId, formData);

      if (response.success) {
        Toast(response.message, "success");
        onSuccess();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      Toast(errorMessage, "error");
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="border bg-white p-6 rounded-md shadow-lg w-11/12 max-w-lg">
        <h3 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Upload Profile Photo
        </h3>

        <div className="flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center rounded-full border-4 border-dashed border-gray-300 font-semibold text-gray-400 mb-4">
              No Image
            </div>
          )}

          <label htmlFor="profilePicInput" className="cursor-pointer mb-6">
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="px-4 py-2 bg-gray-100 text-gray-600 font-semibold text-sm rounded-lg border border-gray-300 hover:bg-gray-200">
              Choose Image
            </div>
          </label>

          <div className="flex gap-4 w-full">
            <button
              className="w-1/2 py-2 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600 transition"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="w-1/2 py-2 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition flex justify-center items-center"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePhoto;
