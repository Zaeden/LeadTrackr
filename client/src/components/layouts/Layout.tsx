import { ReactNode } from "react";
import Sidebar from "../ui/Sidebar";
import Navbar from "../ui/Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100">
        {/* Top Navbar */}
        <Navbar />

        {/* Right Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
