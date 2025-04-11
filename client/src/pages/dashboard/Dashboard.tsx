import { useEffect, useState } from "react";
import * as apiClient from "../../api-client";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { leadStatus } from "../../data/dropDownData";
import { format } from "date-fns";
import { HiUserAdd } from "react-icons/hi";
import {
  FaPhoneAlt,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCertificate,
} from "react-icons/fa";

Chart.register(...registerables);

const Dashboard = () => {
  const [leadStatusCounts, setLeadStatusCounts] = useState<
    { status: string; count: number }[]
  >([]);
  const [leadsByMonth, setLeadsByMonth] = useState<
    { month: number; year: number; count: number }[]
  >([]);
  const [userConversions, setUserConversions] = useState<
    { assignedTo: number; _count: { id: number } }[]
  >([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await apiClient.getDashboardStats();
        if (response.success) {
          setLeadStatusCounts(response.leadStatusCounts);
          setLeadsByMonth(response.leadsByMonth);
          setUserConversions(response.userConversions);
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  const statusIcons: Record<string, JSX.Element> = {
    NEW: <HiUserAdd className="text-purple-500 text-3xl" />,
    CONTACTED: <FaPhoneAlt className="text-purple-500 text-2xl" />,
    IN_PROGRESS: (
      <FaSpinner className="text-purple-500 text-2xl animate-spin" />
    ),
    QUALIFIED: <FaCertificate className="text-purple-500 text-2xl" />,
    COMPLETED: <FaCheckCircle className="text-purple-500 text-2xl" />,
    LOST: <FaTimesCircle className="text-purple-500 text-2xl" />,
    FOLLOW_UP: <FaClock className="text-yellow-500 text-2xl" />,
  };

  return (
    <div className="p-6">
      {/* Lead Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {leadStatus.map(({ value, label }) => {
          const statusObj = leadStatusCounts.find((s) => s.status === value);

          return (
            <div
              key={value}
              className="p-6 bg-white rounded-lg shadow-md hover:bg-purple-900 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-500 group-hover:text-purple-300 transition-colors duration-300">
                  {label}
                </h3>
                {statusIcons[value]}
              </div>
              <p className="text-4xl text-purple-500 font-bold group-hover:text-purple-200 transition-colors duration-300">
                {statusObj ? statusObj.count : 0}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads added per month */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-500 mb-4">
            Leads Added Per Month
          </h2>

          {/* 🔥 Set a fixed height for the chart */}
          <div className="relative" style={{ height: "300px" }}>
            <Bar
              data={{
                labels: leadsByMonth.map((d) => {
                  const monthIndex = Number(d.month) - 1; // Ensure correct 0-based index
                  const year = Number(d.year);

                  if (
                    isNaN(monthIndex) ||
                    isNaN(year) ||
                    monthIndex < 0 ||
                    monthIndex > 11
                  ) {
                    return "Invalid";
                  }

                  return format(new Date(year, monthIndex, 1), "MMM yyyy"); // Shows "Feb 2024"
                }),
                datasets: [
                  {
                    label: "Leads",
                    data: leadsByMonth.map((d) => Number(d.count) || 0),
                    backgroundColor: "rgba(128, 0, 128, 0.6)", // Purple tone
                    borderColor: "rgba(128, 0, 128, 1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(147, 51, 234, 0.8)", // Lighter purple on hover
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false, // 🔥 Prevents auto-scaling
                scales: {
                  x: { ticks: { color: "#A78BFA" } }, // Purple labels on X-axis
                  y: {
                    ticks: { color: "#A78BFA" },
                    beginAtZero: true,
                    suggestedMax:
                      Math.max(
                        ...leadsByMonth.map((d) => Number(d.count) || 0)
                      ) + 5,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* User-wise converted leads */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">User-wise Converted Leads</h2>
          <Pie
            data={{
              labels: userConversions.map((d) => `User ${d.assignedTo}`),
              datasets: [
                {
                  label: "Converted Leads",
                  data: userConversions.map((d) => d._count.id),
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
