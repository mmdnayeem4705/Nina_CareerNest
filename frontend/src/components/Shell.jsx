import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountLinks =
    user?.role === "recruiter"
      ? [["/recruiter", "Recruiter dashboard"], ["/notifications", "Notifications"]]
      : user?.role === "admin"
        ? [["/admin", "Admin dashboard"], ["/admin/applications", "Applications"], ["/notifications", "Notifications"]]
        : [["/profile", "My profile"], ["/preparation", "Preparation"], ["/applications", "My applications"], ["/saved", "Saved jobs"], ["/notifications", "Notifications"]];

  function signOut() {
    logout();
    setAccountOpen(false);
    navigate("/");
  }

  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        <span className="mark">N</span>
        NINA
      </NavLink>
      <nav className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/jobs">Jobs</NavLink>
        {user?.role === "candidate" && <NavLink to="/preparation">Preparation</NavLink>}
        <NavLink to="/internships">Internships</NavLink>
        {!user && (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <button className="btn copper" onClick={() => navigate("/register")}>
              Join
            </button>
          </>
        )}
        {user && (
          <div className="account-menu">
            <button
              className="account-trigger"
              aria-label="Open account menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
            >
              <span className="account-avatar">{(user.first_name || user.email).charAt(0).toUpperCase()}</span>
              {user.role === "candidate" && <span className="account-name">{user.first_name || user.email}</span>}
              <span className="account-chevron">{accountOpen ? "↑" : "↓"}</span>
            </button>
            {accountOpen && (
              <div className="account-popover">
                <div className="account-summary">
                  <strong>{user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.email}</strong>
                  <span>{user.email}</span>
                  <small>{user.role}</small>
                </div>
                {accountLinks.map(([to, label]) => (
                  <NavLink key={to} to={to} onClick={() => setAccountOpen(false)}>
                    {label}
                  </NavLink>
                ))}
                <button className="account-signout" onClick={signOut}>Sign out</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>NINA Organization</span>
      <span>All rights reserved by NINA Organization · 2025</span>
    </footer>
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
          ["/admin/applications", "Applications"],
            ["/admin/users", "Users"],
            ["/admin/jobs", "Jobs"],
            ["/notifications", "Notifications"],
          ]
        : [
            ["/profile", "Profile"],
          ["/preparation", "Preparation"],
          ["/internships", "Internships"],
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
