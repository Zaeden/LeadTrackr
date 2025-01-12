import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Layout from "./components/layouts/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import useAuth from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";
import UserManagement from "./pages/user/UserManagement";
import CourseManagement from "./pages/course/CourseManagement";
import LeadManagement from "./pages/lead/LeadManagement";
import LeadProfile from "./pages/lead/LeadProfile";

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<Login />} />

        {isAuthenticated && (
          <>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />

            <Route
              path="/users"
              element={
                <Layout>
                  <UserManagement />
                </Layout>
              }
            />
            <Route
              path="/leads"
              element={
                <Layout>
                  <LeadManagement />
                </Layout>
              }
            />
            <Route
              path="/leads/:leadId"
              element={
                <Layout>
                  <LeadProfile />
                </Layout>
              }
            />
            <Route
              path="/courses"
              element={
                <Layout>
                  <CourseManagement />
                </Layout>
              }
            />
            <Route
              path="/follow-ups"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
          </>
        )}
      </Routes>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default App;
