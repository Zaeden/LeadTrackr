import { useEffect, useState } from "react";
import CourseList from "./CourseList";
import { IoMdAddCircleOutline } from "react-icons/io";
import * as apiClient from "../../api-client";
import { CourseType } from "../../types/CourseType";
import AddCourse from "../../components/forms/AddCourse";
import EditCourse from "../../components/forms/Edit Course";
import DeleteCourseDailog from "../../components/ui/DeleteCourseDailog";

const CourseManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [data, setData] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddCourse = () => {
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllCourses();
      if (response.success) {
        setData(response.courses);
      } else {
        console.error("Failed to fetch users:", response.message);
      }
      console.log(response.courses);
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
    <div className="p-6 h-full">
      {/* Header with Add New User Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-600">Course Management</h1>
        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          <IoMdAddCircleOutline className="text-2xl text-white" />
          Add New
        </button>
      </div>

      {/* User List */}
      <CourseList
        loading={loading}
        data={data}
        openEdit={(courseId) => {
          setSelectedCourseId(courseId);
          setIsEditModalOpen(true);
        }}
        openDelete={(courseId) => {
          setSelectedCourseId(courseId);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* Add Course Form Modal */}
      {isModalOpen && (
        <AddCourse
          onClose={() => setIsModalOpen(false)}
          onAddUser={() => {
            fetchData();
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Edit Course Form Modal */}
      {isEditModalOpen && (
        <EditCourse
          courseId={selectedCourseId}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateCourse={() => {
            fetchData();
            setIsEditModalOpen(false);
          }}
        />
      )}
      {/* Delete Course Form Modal */}
      {isDeleteModalOpen && (
        <DeleteCourseDailog
          courseId={selectedCourseId}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleteCourse={() => {
            fetchData();
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default CourseManagement;
