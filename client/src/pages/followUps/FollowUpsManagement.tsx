import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import * as apiClient from "../../api-client";
import { LeadType } from "../../types/LeadType";
import AddLead from "../../components/forms/AddLead";
import EditLead from "../../components/forms/EditLead";
import DeleteLeadDailog from "../../components/ui/DeleteLeadDailog";
import FollowUpsList from "./FollowUpsList";

const FollowUpsManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [data, setData] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddLead = () => {
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllFollowUps();
      if (response.success) {
        console.log(response.followUps);
        setData(response.followUps);
      } else {
        console.error("Failed to fetch follow ups:", response.message);
      }
    } catch (error) {
      console.error("Error fetching follow ups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header with Add New User Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-600">
          Follow Ups Management
        </h1>
        <button
          onClick={handleAddLead}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          <IoMdAddCircleOutline className="text-2xl text-white" />
          Add New
        </button>
      </div>

      {/* Follow Ups List */}
      <FollowUpsList
        loading={loading}
        data={data}
        openEdit={(leadId) => {
          setSelectedLeadId(leadId);
          setIsEditModalOpen(true);
        }}
        openDelete={(leadId) => {
          setSelectedLeadId(leadId);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* Add Lead Form Modal */}
      {isModalOpen && (
        <AddLead
          onClose={() => setIsModalOpen(false)}
          onAddLead={() => {
            fetchData();
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Edit Lead Form Modal */}
      {isEditModalOpen && (
        <EditLead
          leadId={selectedLeadId}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateLead={() => {
            fetchData();
            setIsEditModalOpen(false);
          }}
        />
      )}

      {/* Delete User Form Modal */}
      {isDeleteModalOpen && (
        <DeleteLeadDailog
          leadId={selectedLeadId}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleteLead={() => {
            fetchData();
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default FollowUpsManagement;
