import { formatDate } from "../../utils/ConvertDate";
import Badge from "../../components/ui/Badge";
import { UserType } from "../../types/UserType";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

const UserList = ({
  data,
  openEdit,
  openDelete,
}: {
  data: UserType[];
  openEdit: (userId: number) => void;
  openDelete: (userId: number) => void;
}) => {
  return (
    <div className="rounded-md shadow-md">
      <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="text-sm font-medium bg-purple-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Created On</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {data.map((user, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition duration-300"
            >
              <td className="px-4 py-2 font-medium border-b border-gray-300">
                {user.firstName + (user.lastName ? ` ${user.lastName}` : "")}
              </td>
              <td className="px-4 py-2 border-b border-gray-300">
                {user.email}
              </td>
              <td className="px-4 py-2 border-b border-gray-300">
                {user.phone}
              </td>
              <td className="px-4 py-2 border-b border-gray-300 capitalize">
                {user.role[0] + user.role.substring(1).toLowerCase()}
              </td>
              <td className="border-b border-gray-300">
                {user.isActive ? (
                  <Badge text="Active" status="success" />
                ) : (
                  <Badge text="Inactive" status="error" />
                )}
              </td>
              <td className="px-4 py-2 border-b border-gray-300">
                {formatDate(user.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-4 py-2 border-b border-gray-300">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      openEdit(user.id);
                    }}
                    className="px-3 text-lg text-pink-600 hover:text-pink-700"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className={`px-3 text-2xl text-pink-600 hover:text-pink-700`}
                    onClick={() => openDelete(user.id)}
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
