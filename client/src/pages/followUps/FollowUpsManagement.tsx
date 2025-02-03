import { useEffect, useState } from "react";
import * as apiClient from "../../api-client";
import FollowUpsList, { FollowUpType } from "./FollowUpsList";

const FollowUpsManagement = () => {
  const [data, setData] = useState<FollowUpType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllFollowUps();
      if (response.success) {
        setData(response.followUps);
      } else {
        console.error("Failed to fetch follow ups:", response.message);
      }
    } catch (error) {
      console.error("Error fetching follow ups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header with Add New User Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-600">
          Follow Ups Management
        </h1>
      </div>

      {/* Follow Ups List */}
      <FollowUpsList loading={loading} data={data} />
    </div>
  );
};

export default FollowUpsManagement;
