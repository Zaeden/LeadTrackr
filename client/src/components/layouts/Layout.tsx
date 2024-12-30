import { ReactNode } from "react";
import Sidebar from "../ui/Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
