import { formatDate } from "../../utils/ConvertDate";
import Badge from "../../components/ui/Badge";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { CourseType } from "../../types/CourseType";

const CourseList = ({
  data,
  loading,
  openEdit,
  openDelete,
}: {
  data: CourseType[];
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
              <th className="px-4 py-2 text-left">Level</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created On</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {data.map((course, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition duration-300"
              >
                <td className="px-4 py-2 font-medium border-b border-gray-300">
                  {course.name}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {course.level[0] + course.level.substring(1).toLowerCase()}
                </td>
                <td className="border-b border-gray-300">
                  {course.isActive ? (
                    <Badge text="Active" status="success" />
                  ) : (
                    <Badge text="Inactive" status="error" />
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {formatDate(course.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        openEdit(course.id);
                      }}
                      className="px-3 text-lg text-pink-600 hover:text-pink-700"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className={`px-3 text-2xl text-pink-600 hover:text-pink-700`}
                      onClick={() => openDelete(course.id)}
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

export default CourseList;