import { useParams } from "react-router-dom";
import LeadDetails from "../../components/ui/lead/LeadDetails";
import LeadInteractions from "../../components/ui/lead/LeadInteractions";
import * as apiClient from "../../api-client";
import { useEffect, useState } from "react";
import { LeadType } from "../../types/LeadType";

const LeadProfile = () => {
  const { leadId } = useParams<{ leadId: string }>();
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

  useEffect(() => {
    const fetchLeadData = async () => {
      if (leadId) {
        try {
          const response = await apiClient.getLead(parseInt(leadId, 10));
          setLeadData(response.lead);
          console.log(response);
        } catch (error) {
          console.error("Error fetching lead data:", error);
        }
      } else {
        console.error("Lead ID is undefined");
      }
    };
    fetchLeadData();
  }, [leadId]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* First Column: Lead Details */}
      <div className="w-full lg:w-1/3">
        <LeadDetails lead={leadData} />
      </div>

      {/* Second Column: Lead Interactions */}
      <div className="w-full lg:w-2/3">
        <LeadInteractions />
      </div>
    </div>
  );
};

export default LeadProfile;
