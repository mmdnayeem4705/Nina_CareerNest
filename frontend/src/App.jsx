import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import { AppShell, Footer, Topbar } from "./components/Shell";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Profile from "./pages/Profile";
import Applications from "./pages/Applications";
import Saved from "./pages/Saved";
import Notifications from "./pages/Notifications";
import Preparation from "./pages/Preparation";
import { CompanyPage, NewJob, RecruiterHome, RecruiterJob } from "./pages/Recruiter";
import { AdminApplications, AdminHome, AdminJobs, AdminUsers } from "./pages/Admin";

function Guard({ roles, children }) {
  const { user, ready } = useAuth();
  if (!ready) return <p className="wrap">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/internships" element={<Jobs initialJobType="internship" title="Internships at NINA" description="Start your career with practical work, thoughtful mentorship, and a team that invests in your growth." />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <Guard>
              <AppShell />
            </Guard>
          }
        >
          <Route
            path="/profile"
            element={
              <Guard roles={["candidate"]}>
                <Profile />
              </Guard>
            }
          />
          <Route
            path="/applications"
            element={
              <Guard roles={["candidate"]}>
                <Applications />
              </Guard>
            }
          />
          <Route
            path="/saved"
            element={
              <Guard roles={["candidate"]}>
                <Saved />
              </Guard>
            }
          />
          <Route
            path="/preparation"
            element={
              <Guard roles={["candidate"]}>
                <Preparation />
              </Guard>
            }
          />
          <Route
            path="/j"
            element={
              <Guard roles={["candidate"]}>
                <Preparation />
              </Guard>
            }
          />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/recruiter"
            element={
              <Guard roles={["recruiter"]}>
                <RecruiterHome />
              </Guard>
            }
          />
          <Route
            path="/recruiter/company"
            element={
              <Guard roles={["recruiter"]}>
                <CompanyPage />
              </Guard>
            }
          />
          <Route
            path="/recruiter/jobs/new"
            element={
              <Guard roles={["recruiter"]}>
                <NewJob />
              </Guard>
            }
          />
          <Route
            path="/recruiter/jobs/:id"
            element={
              <Guard roles={["recruiter"]}>
                <RecruiterJob />
              </Guard>
            }
          />
          <Route
            path="/admin"
            element={
              <Guard roles={["admin"]}>
                <AdminHome />
              </Guard>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <Guard roles={["admin"]}>
                <AdminApplications />
              </Guard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <Guard roles={["admin"]}>
                <AdminUsers />
              </Guard>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <Guard roles={["admin"]}>
                <AdminJobs />
              </Guard>
            }
          />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
