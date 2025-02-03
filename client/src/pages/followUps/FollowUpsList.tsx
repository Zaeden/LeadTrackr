import { Link } from "react-router-dom";
import { formatDate } from "../../utils/ConvertDate";

export type FollowUpType = {
  id: number;
  followUpDate: string;
  lead: {
    id: number;
    firstName: string;
    lastName?: string;
  };
  assignedTo: {
    firstName: string;
    lastName?: string;
  };
  isCompleted: boolean;
};

const FollowUpsList = ({
  data,
  loading,
  openEdit,
  openDelete,
}: {
  data: FollowUpType[];
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
              <th className="px-4 py-2 text-left">Lead Name</th>
              <th className="px-4 py-2 text-left">Assigned To</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {data.map((followUp, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 font-medium transition duration-300"
              >
                <td className="px-4 py-2 border-b border-gray-300">
                  <Link to={`/leads/${followUp.lead.id}`}>
                    {followUp.lead.firstName +
                      (followUp.lead.lastName
                        ? ` ${followUp.lead.lastName}`
                        : "")}
                  </Link>
                </td>
                <td className="px-4 py-2 border-b text-gray-500 border-gray-300">
                  {followUp.assignedTo.firstName +
                    (followUp.assignedTo.lastName
                      ? ` ${followUp.assignedTo.lastName}`
                      : "")}
                </td>

                <td className="px-4 py-2 border-b text-gray-500 border-gray-300">
                  {formatDate(followUp.followUpDate)}
                </td>

                <td className="border-b border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      followUp.isCompleted
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {followUp.isCompleted ? "Completed" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FollowUpsList;
