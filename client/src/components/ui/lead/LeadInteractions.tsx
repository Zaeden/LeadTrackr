import { useState } from "react";
import AddInteractionModal from "./AddInteractionModal";
import { IoMdAddCircleOutline } from "react-icons/io";

const LeadInteractions = () => {
  const [showModal, setShowModal] = useState(false);

  const interactions = [
    { date: "2025-01-01", note: "Initial contact made via phone." },
    { date: "2025-01-02", note: "Follow-up email sent." },
    { date: "2025-01-03", note: "Discussed pricing over a call." },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Interactions</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex gap-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <IoMdAddCircleOutline className="text-2xl text-white" /> Add
          Interaction
        </button>
      </div>

      {/* Interaction Timeline */}
      <ul className="space-y-4">
        {interactions.map((interaction, index) => (
          <li key={index} className="p-4 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-500">{interaction.date}</p>
            <p className="text-gray-700">{interaction.note}</p>
          </li>
        ))}
      </ul>

      {/* Add Interaction Modal */}
      {showModal && <AddInteractionModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default LeadInteractions;
