import { useEffect, useState } from "react";
import { api } from "../api";

export function AdminHome() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get("/api/admin/stats/").then(setStats);
  }, []);
  if (!stats) return <p>Loading…</p>;
  const cards = [
    ["Users", stats.users],
    ["Candidates", stats.candidates],
    ["Recruiters", stats.recruiters],
    ["Companies", stats.companies],
    ["Jobs", stats.jobs],
    ["Applications", stats.applications],
  ];
  return (
    <div>
      <div className="kicker">Admin</div>
      <h1>Hiring pulse</h1>
      <div className="cards">
        {cards.map(([label, value]) => (
          <article className="card" key={label}>
            <div className="muted">{label}</div>
            <div className="stat">{value}</div>
          </article>
        ))}
      </div>
      <h3 style={{ marginTop: 28 }}>Application status</h3>
      <ul>
        {stats.status_breakdown.map((row) => (
          <li key={row.status}>
            {row.status}: {row.count}
          </li>
        ))}
      </ul>
      <h3>Top required skills</h3>
      <div className="chips">
        {stats.top_skills.map((s) => (
          <span className="chip" key={s.skill}>
            {s.skill} · {s.count}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const load = () => api.get(`/api/admin/users/?q=${encodeURIComponent(q)}`).then(setUsers);
  useEffect(() => {
    load();
  }, []);
  async function block(id) {
    await api.post(`/api/admin/users/${id}/block/`, {});
    load();
  }
  return (
    <div>
      <h1>Users</h1>
      <form className="row" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
        <button className="btn" type="submit">
          Search
        </button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.is_blocked ? "blocked" : "active"}</td>
              <td>
                {u.role !== "admin" && (
                  <button className="btn ghost" onClick={() => block(u.id)}>
                    {u.is_blocked ? "Unblock" : "Block"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    api.get("/api/admin/jobs/").then(setJobs);
    api.get("/api/admin/companies/").then(setCompanies);
  }, []);
  async function toggle(id) {
    const updated = await api.post(`/api/admin/jobs/${id}/toggle/`, {});
    setJobs((list) => list.map((j) => (j.id === id ? updated : j)));
  }
  return (
    <div>
      <h1>Jobs & companies</h1>
      <h3>Companies</h3>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            {c.name} · {c.location}
          </li>
        ))}
      </ul>
      <table className="table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Company</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>{j.title}</td>
              <td>{j.company?.name}</td>
              <td>{j.is_active ? "yes" : "no"}</td>
              <td>
                <button className="btn ghost" onClick={() => toggle(j.id)}>
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setApplications(await api.get("/api/admin/applications/"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    try {
      const updated = await api.patch(`/api/applications/${id}/status/`, { status });
      setApplications((items) => items.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="kicker">Hiring desk</div>
      <h1>Review applications</h1>
      <p className="muted">Accept, reject, or move each job seeker through your hiring process.</p>
      {error && <p className="error">{error}</p>}
      {applications.length === 0 && <p className="muted">No applications yet.</p>}
      <div className="cards">
        {applications.map((application) => (
          <article className="card" key={application.id}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <div className="muted">{application.job.company?.name}</div>
                <h3>{application.job.title}</h3>
              </div>
              <span className="badge">{application.status}</span>
            </div>
            <p>
              <strong>{application.candidate.first_name} {application.candidate.last_name}</strong>
              <br />
              <span className="muted">{application.candidate.email}</span>
            </p>
            <p className="muted">{application.candidate_years || 0} years experience · {application.match_score}% match</p>
            <p>{application.cover_letter || "No cover letter provided."}</p>
            <div className="row">
              <button className="btn forest" onClick={() => setStatus(application.id, "shortlisted")}>Accept</button>
              <button className="btn ghost" onClick={() => setStatus(application.id, "rejected")}>Reject</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
