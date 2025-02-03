import { Link, useLocation } from "react-router-dom";
import {
  MdOutlineSpaceDashboard,
  MdOutlineSettings,
  MdOutlineLeaderboard,
} from "react-icons/md";
import { LuUserPen } from "react-icons/lu";
import { RiChatFollowUpLine } from "react-icons/ri";
import { MdOutlineSubject } from "react-icons/md";
import Logout from "./Logout";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { role } = useAuth();
  const location = useLocation();
  return (
    <nav className="border-r shadow-md w-64 bg-white flex flex-col">
      <h2 className="rounded text-center text-3xl text-purple-900 font-bold py-4 shadow-md">
        LeadTrackr
      </h2>
      <ul className="flex-1 mt-4 space-y-2 px-4">
        <li>
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 py-2 px-3 rounded text-purple-900 ${
              location.pathname === "/dashboard"
                ? "bg-purple-300 "
                : "hover:bg-purple-300"
            }`}
          >
            <MdOutlineSpaceDashboard className="text-2xl" />
            <span className="text-sm font-semibold">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/leads"
            className={`flex items-center gap-2 py-2 px-3 rounded text-purple-900 ${
              location.pathname === "/leads"
                ? "bg-purple-300 "
                : " hover:bg-purple-300"
            }`}
          >
            <MdOutlineLeaderboard className="text-2xl" />
            <span className="text-sm font-semibold">Lead Management</span>
          </Link>
        </li>

        {role === "ADMIN" && (
          <>
            <li>
              <Link
                to="/users"
                className={`flex items-center gap-2 py-2 px-3 rounded text-purple-900 ${
                  location.pathname === "/users"
                    ? "bg-purple-300 "
                    : " hover:bg-purple-300"
                }`}
              >
                <LuUserPen className="text-2xl" />
                <span className="text-sm font-semibold">User Management</span>
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className={`flex items-center gap-2 py-2 px-3 rounded text-purple-900 ${
                  location.pathname === "/courses"
                    ? "bg-purple-300 "
                    : "hover:bg-purple-300"
                }`}
              >
                <MdOutlineSubject className="text-2xl" />
                <span className="text-sm font-semibold">Course Management</span>
              </Link>
            </li>
          </>
        )}

        <li>
          <Link
            to="/follow-ups"
            className={`flex items-center gap-2 py-2 px-3  rounded text-purple-900 ${
              location.pathname === "/follow-ups"
                ? "bg-purple-300"
                : "hover:bg-purple-300"
            }`}
          >
            <RiChatFollowUpLine className="text-2xl" />
            <span className="text-sm font-semibold">Follow-Ups</span>
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className={`flex items-center gap-2 py-2 px-3 rounded text-purple-900 ${
              location.pathname === "/settings"
                ? "bg-purple-300"
                : "hover:bg-purple-300"
            }`}
          >
            <MdOutlineSettings className="text-2xl" />
            <span className="text-sm font-semibold">Settings</span>
          </Link>
        </li>
      </ul>
      <div className="p-4">
        <Logout />
      </div>
    </nav>
  );
};

export default Sidebar;
