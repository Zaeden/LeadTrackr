import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Link to="/leads">
        <button className="rounded px-3 py-2 bg-purple-300 text-purple-900 font-semibold">
          View All Leads
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;
