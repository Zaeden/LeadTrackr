import { useEffect, useState } from "react";
import UserList from "./UserList";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddUser from "../../components/forms/AddUser";
import { UserType } from "../../types/UserType";
import * as apiClient from "../../api-client";
import EditUser from "../../components/forms/EditUser";
import DeleteUserDailog from "../../components/ui/DeleteUserDailog";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllUsers();
      if (response.success) {
        setData(response.users);
      } else {
        console.error("Failed to fetch users:", response.message);
      }
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
        <h1 className="text-2xl font-bold text-gray-600">User Management</h1>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          <IoMdAddCircleOutline className="text-2xl text-white" />
          Add New
        </button>
      </div>

      {/* User List */}
      <UserList
        loading={loading}
        data={data}
        openEdit={(userId) => {
          setSelectedUserId(userId);
          setIsEditModalOpen(true);
        }}
        openDelete={(userId) => {
          setSelectedUserId(userId);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* Add User Form Modal */}
      {isModalOpen && (
        <AddUser
          onClose={() => setIsModalOpen(false)}
          onAddUser={() => {
            fetchData();
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Edit User Form Modal */}
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
      {/* Delete User Form Modal */}
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
