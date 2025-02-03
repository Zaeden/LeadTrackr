import { useEffect, useState } from "react";
import * as apiClient from "../../../api-client";
import AddFollowUpModal from "./AddFollowUpModal";
import { RiChatFollowUpLine } from "react-icons/ri";

const FollowUps = ({ leadId }: { leadId: string | undefined }) => {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchFollowUps = async () => {
      if (leadId) {
        try {
          const response = await apiClient.getLeadFollowUps(
            parseInt(leadId, 10)
          );
          setFollowUps(response.followUps);
        } catch (error) {
          console.error("Error fetching follow-ups:", error);
        }
      }
    };

    fetchFollowUps();
  }, [leadId]);

  const handleAddFollowUp = () => {
    setIsModalOpen(false);
    // Re-fetch follow-ups after adding a new one
    if (leadId) {
      apiClient.getLeadFollowUps(parseInt(leadId, 10)).then((response) => {
        setFollowUps(response.followUps);
      });
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Follow-Ups</h2>

        {/* Add Follow-Up Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md font-semibold text-sm shadow-sm hover:bg-purple-600"
        >
          <RiChatFollowUpLine className="text-xl text-white" />
          Add Follow-Up
        </button>

        {/* Follow-Up Modal */}
        {isModalOpen && (
          <AddFollowUpModal
            leadId={leadId}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddFollowUp}
          />
        )}
      </div>

      {/* Follow-Ups List */}
      {followUps.length > 0 ? (
        <ul className="space-y-2">
          {followUps.map((followUp) => (
            <li key={followUp.id} className="p-2 border rounded-md bg-gray-50">
              <div className="flex justify-between mb-1">
                <p className="text-xs text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(followUp.followUpDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-600">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      followUp.isCompleted
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {followUp.isCompleted ? "Completed" : "Pending"}
                  </span>
                </p>
              </div>
              <p className="text-xs text-gray-600">
                <strong>Notes:</strong> {followUp.notes}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No follow-ups yet.</p>
      )}
    </div>
  );
};

export default FollowUps;
