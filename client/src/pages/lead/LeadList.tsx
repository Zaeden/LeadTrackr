import { formatDate } from "../../utils/ConvertDate";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { LeadType } from "../../types/LeadType";
import LeadStatusBadge from "../../components/ui/LeadStatusBadge";
import { sourceOptions } from "../../data/dropDownData";
import { Link } from "react-router-dom";

const LeadList = ({
  data,
  loading,
  openEdit,
  openDelete,
}: {
  data: LeadType[];
  loading: boolean;
  openEdit: (userId: number) => void;
  openDelete: (userId: number) => void;
}) => {
  return (
    <div className="rounded-md shadow-md">
      {loading ? (
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="text-sm font-medium bg-purple-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Priority</th>
              <th className="px-4 py-2 text-left">Source</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {data.map((lead, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 font-medium transition duration-300"
              >
                <td className="px-4 py-2 border-b border-gray-300">
                  <Link to={`/leads/${lead.id}`}>
                    {lead.firstName +
                      (lead.lastName ? ` ${lead.lastName}` : "")}
                  </Link>
                </td>
                <td className="px-4 py-2 border-b text-gray-500 border-gray-300">
                  {lead.email}
                </td>
                <td className="px-4 py-2 border-b text-gray-500 border-gray-300">
                  {lead.phone}
                </td>
                <td className="px-4 py-2 border-b text-gray-500 border-gray-300">
                  {lead.priority[0] + lead.priority.substring(1).toLowerCase()}
                </td>
                <td className="px-4 py-2 border-b text-gray-500 border-gray-300">
                  {
                    sourceOptions.find((option) => option.value === lead.source)
                      ?.label
                  }
                </td>
                <td className="border-b border-gray-300">
                  <LeadStatusBadge text={lead.status} status={lead.status} />
                </td>
                <td className="px-4 py-2 border-b text-gray-500 border-gray-300">
                  {formatDate(lead.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        openEdit(lead.id);
                      }}
                      className="px-3 text-lg text-pink-600 hover:text-pink-700"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className={`px-3 text-2xl text-pink-600 hover:text-pink-700`}
                      onClick={() => openDelete(lead.id)}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeadList;
