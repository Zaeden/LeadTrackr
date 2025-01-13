import { useEffect, useState } from "react";
import AddInteractionModal from "./AddInteractionModal";
import { IoMdAddCircleOutline } from "react-icons/io";
import { InteractionTypes } from "../../../types/InteractionTypes";
import * as apiClient from "../../../api-client";

const LeadInteractions = ({ leadId }: { leadId: string | undefined }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [interactions, setInteractions] = useState<InteractionTypes[]>([]);

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      if (leadId) {
        const response = await apiClient.getInteractions(parseInt(leadId, 10));
        console.log(response);
        setInteractions(response.interactions);
      }
    } catch (error) {
      console.error("Failed to fetch interactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [leadId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md overflow-y-auto">
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
      {loading ? (
        <p className="text-gray-500">Loading interactions...</p>
      ) : interactions.length === 0 ? (
        <p className="text-gray-500">No interactions found.</p>
      ) : (
        <div className="space-y-4">
          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className="p-4 border rounded-md shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-purple-600">
                  {interaction.interactionType}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(interaction.interactionTime).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{interaction.notes}</p>
              <p className="text-xs text-gray-500 mt-2">
                Logged by:{" "}
                {interaction.interactionBy.firstName +
                  interaction.interactionBy.lastName}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Interaction Modal */}
      {showModal && (
        <AddInteractionModal
          leadId={leadId}
          onClose={() => setShowModal(false)}
          onAdd={() => {
            fetchInteractions();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default LeadInteractions;
