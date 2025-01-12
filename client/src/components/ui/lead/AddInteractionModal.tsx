import { useState } from "react";

const AddInteractionModal = ({ onClose }: { onClose: () => void }) => {
  const [note, setNote] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("New Interaction:", note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Interaction
        </h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            rows={4}
            placeholder="Add details of the interaction..."
          ></textarea>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInteractionModal;
