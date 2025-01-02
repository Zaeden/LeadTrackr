import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import * as apiClient from "../../api-client";
import LeadList from "./LeadList";
import { LeadType } from "../../types/LeadType";
import AddLead from "../../components/forms/AddLead";
import EditLead from "../../components/forms/EditLead";
import DeleteLeadDailog from "../../components/ui/DeleteLeadDailog";

const LeadManagement = () => {
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
      const response = await apiClient.getAllLeads();
      if (response.success) {
        setData(response.leads);
      } else {
        console.error("Failed to fetch users:", response.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
        <h1 className="text-2xl font-bold text-gray-600">Lead Management</h1>
        <button
          onClick={handleAddLead}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          <IoMdAddCircleOutline className="text-2xl text-white" />
          Add New
        </button>
      </div>

      {/* Lead List */}
      <LeadList
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

export default LeadManagement;
