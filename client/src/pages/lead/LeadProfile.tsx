import { useParams } from "react-router-dom";
import LeadDetails from "../../components/ui/lead/LeadDetails";
import LeadInteractions from "../../components/ui/lead/LeadInteractions";
import * as apiClient from "../../api-client";
import { useEffect, useState } from "react";
import { LeadType } from "../../types/LeadType";
import LeadFollowUps from "../../components/ui/lead/LeadFollowUps";

const LeadProfile = () => {
  const { leadId } = useParams<{ leadId: string | undefined }>();
  const [leadData, setLeadData] = useState<LeadType>({
    id: 0,
    firstName: "",
    lastName: "",
    profilePic: "",
    email: "",
    phone: "",
    gender: "MALE",
    dob: "",
    courseId: null,
    assignedTo: 0,
    createdBy: 0,
    status: "NEW",
    isActive: true,
    source: "OTHER",
    fatherName: "",
    fatherPhone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    priority: "MEDIUM",
    level: "BACHELORS",
    createdAt: "",
    updatedAt: "",
  });

  const fetchLeadData = async () => {
    if (leadId) {
      try {
        const response = await apiClient.getLead(parseInt(leadId, 10));
        setLeadData(response.lead);
      } catch (error) {
        console.error("Error fetching lead data:", error);
      }
    } else {
      console.error("Lead ID is undefined");
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [leadId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* First Column: Lead Details */}
      <div className="w-full">
        <LeadDetails lead={leadData} fetchLeadData={fetchLeadData} />
      </div>

      {/* Second Column: Lead Interactions */}
      <div className="w-full max-h-[600px] overflow-y-auto rounded-lg">
        <LeadInteractions leadId={leadId} />
      </div>

      {/* Third Column: Follow-Ups */}
      <div className="w-full max-h-[600px] overflow-y-auto rounded-lg">
        <LeadFollowUps leadId={leadId} />
      </div>
    </div>
  );
};

export default LeadProfile;
