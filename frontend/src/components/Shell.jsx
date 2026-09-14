import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        <span className="mark">N</span>
        NINA
      </NavLink>
      <nav className="nav">
        <NavLink to="/jobs">Jobs</NavLink>
        {user?.role === "candidate" && <NavLink to="/applications">Applications</NavLink>}
        {user?.role === "recruiter" && <NavLink to="/recruiter">Recruiter</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        {!user && (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <button className="btn copper" onClick={() => navigate("/register")}>
              Join
            </button>
          </>
        )}
        {user && (
          <>
            <span className="muted">{user.first_name || user.email}</span>
            <button
              className="btn ghost"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Sign out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export function AppShell() {
  const { user } = useAuth();
  const links =
    user?.role === "recruiter"
      ? [
          ["/recruiter", "Dashboard"],
          ["/recruiter/company", "Company"],
          ["/recruiter/jobs/new", "Post a job"],
          ["/notifications", "Notifications"],
        ]
      : user?.role === "admin"
        ? [
            ["/admin", "Overview"],
            ["/admin/users", "Users"],
            ["/admin/jobs", "Jobs"],
            ["/notifications", "Notifications"],
          ]
        : [
            ["/profile", "Profile"],
            ["/applications", "Applications"],
            ["/saved", "Saved jobs"],
            ["/notifications", "Notifications"],
          ];

  if (!user) return <Outlet />;

  return (
    <div className="layout">
      <aside className="side">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/recruiter" || to === "/admin"}>
            {label}
          </NavLink>
        ))}
      </aside>
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
