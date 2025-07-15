import { useEffect, useState } from "react";
import UserList from "./UserList";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddUser from "../../components/forms/AddUser";
import EditUser from "../../components/forms/EditUser";
import DeleteUserDailog from "../../components/ui/DeleteUserDailog";
import * as apiClient from "../../api-client";
import { UserType } from "../../types/UserType";
import { roleOptions, statusOptions } from "../../data/dropDownData";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });

  const handleAddUser = () => setIsModalOpen(true);

  const fetchData = async (
    search = "",
    filtersOverride = filters,
    page = 1
  ) => {
    setLoading(true);
    try {
      const response = await apiClient.getAllUsers({
        search,
        page,
        limit: 10,
        ...filtersOverride,
      });

      if (response.success) {
        setData(response.users);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
    const rangeWithDots = [];
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
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-600">User Management</h1>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          <IoMdAddCircleOutline className="text-2xl text-white" />
          Add New
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name or email"
          className="px-4 py-2 border rounded-md w-1/3 focus:outline-none text-gray-500 font-semibold"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          className="border px-4 py-2 rounded focus:outline-none"
          value={filters.role}
          onChange={(e) => {
            setFilters({ ...filters, role: e.target.value });
            setCurrentPage(1);
          }}
        >
          <option value="">All Roles</option>
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded focus:outline-none"
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
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

      {/* User List */}
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
          No users found matching your filters.
        </div>
      ) : (
        <UserList
          data={data}
          openEdit={(id) => {
            setSelectedUserId(id);
            setIsEditModalOpen(true);
          }}
          openDelete={(id) => {
            setSelectedUserId(id);
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
              key={page}
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
        <AddUser
          onClose={() => setIsModalOpen(false)}
          onAddUser={() => {
            fetchData();
            setIsModalOpen(false);
          }}
        />
      )}

      {isEditModalOpen && (
        <EditUser
          userId={selectedUserId}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateUser={() => {
            fetchData();
            setIsEditModalOpen(false);
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteUserDailog
          userId={selectedUserId}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleteUser={() => {
            fetchData();
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
