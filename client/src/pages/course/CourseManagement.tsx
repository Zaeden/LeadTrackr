import { useEffect, useState } from "react";
import CourseList from "./CourseList";
import { IoMdAddCircleOutline } from "react-icons/io";
import * as apiClient from "../../api-client";
import { CourseType } from "../../types/CourseType";
import AddCourse from "../../components/forms/AddCourse";
import EditCourse from "../../components/forms/EditCourse";
import DeleteCourseDailog from "../../components/ui/DeleteCourseDailog";
import { courseLevelOptions, statusOptions } from "../../data/dropDownData";

const CourseManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [data, setData] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    level: "",
    status: "",
  });

  const handleAddCourse = () => {
    setIsModalOpen(true);
  };

  const fetchData = async (
    search = "",
    filtersOverride = filters,
    page = 1
  ) => {
    setLoading(true);
    try {
      const response = await apiClient.getAllCourses({
        search,
        page,
        limit: 10,
        ...filtersOverride,
      });

      if (response.success) {
        setData(response.courses);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchQuery, filters, currentPage);
  }, [searchQuery, filters, currentPage]);

  const getPagination = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i as number;
    }

    return rangeWithDots;
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
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

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by course name or level"
          className="px-4 py-2 border rounded-md w-1/3 focus:outline-none text-gray-500 font-semibold"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          className="border px-4 py-2 rounded focus:outline-none"
          value={filters.level}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, level: e.target.value }));
            setCurrentPage(1);
          }}
        >
          <option value="">All Levels</option>
          {courseLevelOptions.map((course) => (
            <option key={course.value} value={course.value}>
              {course.label}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded focus:outline-none"
          value={filters.status}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, status: e.target.value }));
            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No courses found matching your filters.
        </div>
      ) : (
        <CourseList
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
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {getPagination(currentPage, totalPages).map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => setCurrentPage(Number(page))}
              className={`px-3 py-1 border rounded ${
                page === currentPage
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddCourse
          onClose={() => setIsModalOpen(false)}
          onAddUser={() => {
            fetchData();
            setIsModalOpen(false);
          }}
        />
      )}

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
