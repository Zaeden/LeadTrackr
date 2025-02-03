import React, { useEffect, useState } from "react";
import { LeadType } from "../../../types/LeadType";
import LeadStatusBadge from "../LeadStatusBadge";
import { indianStates, sourceOptions } from "../../../data/dropDownData";
import * as apiClient from "../../../api-client";
import {
  MdOutlinePerson,
  MdOutlineMail,
  MdOutlinePhone,
  MdMale,
  MdDateRange,
  MdOutlineLibraryBooks,
  MdOutlineOutlinedFlag,
  MdOutlineLocationOn,
  MdLocationCity,
} from "react-icons/md";
import { TbMapPinCode } from "react-icons/tb";
import { FiUpload } from "react-icons/fi";
import UploadProfilePhoto from "./UploadProfilePhoto";

type LeadProps = {
  lead: LeadType;
  fetchLeadData: () => void;
};

const LeadDetails: React.FC<LeadProps> = ({ lead, fetchLeadData }) => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const [course, setCourse] = useState<{ name: string; level: string }>({
    name: "",
    level: "",
  });

  const [leadCreatorName, setLeadCreatorName] = useState<string>("");
  const [leadAssignedToName, setLeadAssignedToName] = useState<string>("");

  // For fetching course name using courseId.
  useEffect(() => {
    const fetchCourse = async () => {
      const { courseId } = lead;
      if (courseId) {
        try {
          const response = await apiClient.getCourse(courseId);
          setCourse(response.course);
        } catch (error) {
          console.error("Error fetching lead data:", error);
        }
      }
    };
    fetchCourse();
  }, [lead]);

  // For fetching lead creater details using creatorId.
  useEffect(() => {
    const fetchLeadCreator = async () => {
      const { createdBy } = lead;
      if (createdBy) {
        try {
          const response = await apiClient.getUser(createdBy);
          setLeadCreatorName(response.user.firstName + response.user.lastName);
        } catch (error) {
          console.error("Error fetching lead data:", error);
        }
      }
    };
    fetchLeadCreator();
  }, [lead]);

  // For fetching lead assigned to details using assignerId.
  useEffect(() => {
    const fetchLeadAssignedTo = async () => {
      const { assignedTo } = lead;
      if (assignedTo) {
        try {
          const response = await apiClient.getUser(assignedTo);
          setLeadAssignedToName(
            response.user.firstName + response.user.lastName
          );
        } catch (error) {
          console.error("Error fetching lead data:", error);
        }
      }
    };
    fetchLeadAssignedTo();
  }, [lead]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        {/* Profile Image or Initial */}
        {lead?.profilePic ? (
          <img
            src={lead.profilePic}
            alt={lead.firstName}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-purple-300 text-purple-500 font-semibold text-5xl mb-4">
            {lead?.firstName[0]}
          </div>
        )}

        <button
          className="flex items-center gap-1 mt-2 mb-4 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white rounded-md"
          onClick={() => setShowUploadModal(true)}
        >
          <FiUpload className="text-lg" />
          Upload Photo
        </button>

        {/* Lead Status */}
        <LeadStatusBadge text={lead.status} status={lead.status} />
      </div>

      {/* Modal for Uploading Photo */}
      {showUploadModal && (
        <UploadProfilePhoto
          leadId={lead.id}
          profilePic={lead.profilePic}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            fetchLeadData();
          }}
        />
      )}

      {/* Lead Details */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-700">Lead Details</h2>
        <ul className="mt-4 text-gray-700 space-y-2 text-sm font-semibold">
          <li className="flex items-center gap-2">
            <MdOutlinePerson className="text-xl text-gray-500" />
            <span className="text-gray-500">Name:</span>
            <span>
              {lead.firstName + (lead.lastName ? ` ${lead.lastName}` : "")}
            </span>
          </li>

          <li className="flex items-center gap-2">
            <MdOutlineMail className="text-xl text-gray-500" />
            <span className="text-gray-500">Email:</span>
            <span>{lead.email ?? "N/A"}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlinePhone className="text-xl text-gray-500" />
            <span className="text-gray-500">Phone:</span>
            <span>{lead.phone}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdMale className="text-xl text-gray-500" />
            <span className="text-gray-500">Gender:</span>
            <span>{lead.gender}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdDateRange className="text-xl text-gray-500" />
            <span className="text-gray-500">Date of Birth:</span>
            <span>{lead.dob}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlineLibraryBooks className="text-xl text-gray-500" />
            <span className="text-gray-500">Course:</span>
            <span>{course.name ?? "N/A"}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlinePerson className="text-xl text-gray-500" />
            <span className="text-gray-500">Assigned To:</span>
            <span>{leadAssignedToName}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlinePerson className="text-xl text-gray-500" />
            <span className="text-gray-500">Created By:</span>
            <span>{leadCreatorName}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlineOutlinedFlag className="text-xl text-gray-500" />
            <span className="text-gray-500">Source:</span>
            <span>
              {
                sourceOptions.find((option) => option.value === lead.source)
                  ?.label
              }
            </span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlinePerson className="text-xl text-gray-500" />
            <span className="text-gray-500">Father's Name:</span>
            <span>{lead.fatherName}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlinePhone className="text-xl text-gray-500" />
            <span className="text-gray-500">Father's Phone:</span>
            <span>{lead.fatherPhone}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlineLocationOn className="text-xl text-gray-500" />
            <span className="text-gray-500">Street Address:</span>
            <span>{lead.streetAddress}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdLocationCity className="text-xl text-gray-500" />
            <span className="text-gray-500">City:</span>
            <span>{lead.city}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdLocationCity className="text-xl text-gray-500" />
            <span className="text-gray-500">State:</span>
            <span>
              {
                indianStates.find((option) => option.value === lead.state)
                  ?.label
              }
            </span>
          </li>
          <li className="flex items-center gap-2">
            <TbMapPinCode className="text-xl text-gray-500" />
            <span className="text-gray-500">Postal Code:</span>
            <span>{lead.postalCode}</span>
          </li>
          <li className="flex items-center gap-2">
            <MdLocationCity className="text-xl text-gray-500" />
            <span className="text-gray-500">Country:</span>
            <span>{lead.country}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeadDetails;
