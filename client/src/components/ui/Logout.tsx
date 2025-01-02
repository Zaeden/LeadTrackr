import { useState } from "react";
import * as apiClient from "../../api-client";
import Toast from "./Toast";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await apiClient.logoutUser();
      setAuthenticated(false);
      Toast(response.message, "success");
      navigate("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        Toast(error.message, "error");
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="h-10 w-full py-2 px-4 text-sm font-semibold text-pink-900 bg-pink-300 rounded hover:bg-pink-400"
    >
      {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Logout"}
    </button>
  );
};

export default Logout;
