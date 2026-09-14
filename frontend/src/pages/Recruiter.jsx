import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export function RecruiterHome() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    api.get("/api/jobs/mine/").then(setJobs);
  }, []);
  return (
    <div>
      <div className="kicker">Recruiter desk</div>
      <div className="row">
        <h1>Your roles</h1>
        <Link className="btn copper" to="/recruiter/jobs/new">
          Post a job
        </Link>
      </div>
      {jobs.length === 0 && <p className="muted">No jobs yet. Publish a role to start ranking applicants.</p>}
      <div className="cards">
        {jobs.map((job) => (
          <Link className="card" key={job.id} to={`/recruiter/jobs/${job.id}`}>
            <h3>{job.title}</h3>
            <p className="muted">{job.applicant_count || 0} applicants</p>
            <span className="badge">{job.is_active ? "open" : "closed"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CompanyPage() {
  const [company, setCompany] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    api.get("/api/companies/me/").then(setCompany);
  }, []);
  if (!company) return <p>Loading…</p>;
  async function save(e) {
    e.preventDefault();
    const saved = await api.patch("/api/companies/me/", company);
    setCompany(saved);
    setMsg("Company profile saved.");
  }
  return (
    <form className="form" onSubmit={save}>
      <h1>Company profile</h1>
      <label>
        Name
        <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
      </label>
      <label>
        Industry
        <input value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })} />
      </label>
      <label>
        Location
        <input value={company.location} onChange={(e) => setCompany({ ...company, location: e.target.value })} />
      </label>
      <label>
        Website
        <input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
      </label>
      <label>
        About
        <textarea rows={5} value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} />
      </label>
      <button className="btn" type="submit">
        Save
      </button>
      {msg && <p className="success">{msg}</p>}
    </form>
  );
}

export function NewJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    job_type: "full_time",
    salary_min: "",
    salary_max: "",
    required_skills: "Python, Django, PostgreSQL",
    description: "",
    requirements: "",
    is_active: true,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  async function submit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      required_skills: form.required_skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const job = await api.post("/api/jobs/mine/", payload);
    navigate(`/recruiter/jobs/${job.id}`);
  }
  return (
    <form className="form" onSubmit={submit}>
      <h1>Post a job</h1>
      <label>
        Title
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required />
      </label>
      <label>
        Location
        <input value={form.location} onChange={(e) => set("location", e.target.value)} />
      </label>
      <label>
        Type
        <select value={form.job_type} onChange={(e) => set("job_type", e.target.value)}>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>
      </label>
      <label>
        Required skills
        <input value={form.required_skills} onChange={(e) => set("required_skills", e.target.value)} />
      </label>
      <label>
        Description
        <textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} required />
      </label>
      <label>
        Requirements
        <textarea rows={4} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
      </label>
      <button className="btn copper" type="submit">
        Publish
      </button>
    </form>
  );
}

export function RecruiterJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [skill, setSkill] = useState("");
  const [minScore, setMinScore] = useState("");
  const [minYears, setMinYears] = useState("");
  const [when, setWhen] = useState("");
  const [link, setLink] = useState("https://meet.google.com/nina-demo");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "", requirements: "", required_skills: "", is_active: true });
  const [msg, setMsg] = useState("");

  async function load() {
    const current = await api.get(`/api/jobs/mine/${id}/`);
    setJob(current);
    setDraft({
      title: current.title,
      description: current.description,
      requirements: current.requirements || "",
      required_skills: (current.required_skills || []).join(", "),
      is_active: current.is_active,
    });
    const params = new URLSearchParams();
    if (skill) params.set("skill", skill);
    if (minScore) params.set("min_score", minScore);
    if (minYears) params.set("min_years", minYears);
    setApps(await api.get(`/api/applications/jobs/${id}/applicants/?${params}`));
  }

  useEffect(() => {
    load();
  }, [id]);

  async function setStatus(appId, status) {
    await api.patch(`/api/applications/${appId}/status/`, { status });
    load();
  }

  async function schedule(appId) {
    if (!when) return;
    await api.post(`/api/applications/${appId}/interview/`, { scheduled_at: when, meeting_link: link });
    load();
  }

  async function download(appId) {
    const blob = await api.download(`/api/resumes/applications/${appId}/download/`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume";
    a.click();
  }

  async function saveJob(e) {
    e.preventDefault();
    const updated = await api.patch(`/api/jobs/mine/${id}/`, {
      ...draft,
      required_skills: draft.required_skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setJob(updated);
    setEditing(false);
    setMsg("Job updated.");
  }

  async function removeJob() {
    if (!window.confirm("Delete this job and its applications?")) return;
    await api.del(`/api/jobs/mine/${id}/`);
    navigate("/recruiter");
  }

  if (!job) return <p>Loading…</p>;
  return (
    <div>
      <h1>{job.title}</h1>
      <p className="muted">{job.applicant_count || apps.length} applicants, ranked by match score</p>
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn ghost" onClick={() => setEditing((v) => !v)}>
          {editing ? "Close editor" : "Edit job"}
        </button>
        <button className="btn ghost" onClick={removeJob}>
          Delete job
        </button>
      </div>
      {msg && <p className="success">{msg}</p>}
      {editing && (
        <form className="form card" onSubmit={saveJob} style={{ marginBottom: 20 }}>
          <label>
            Title
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </label>
          <label>
            Required skills
            <input value={draft.required_skills} onChange={(e) => setDraft({ ...draft, required_skills: e.target.value })} />
          </label>
          <label>
            Description
            <textarea rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </label>
          <label>
            Requirements
            <textarea rows={3} value={draft.requirements} onChange={(e) => setDraft({ ...draft, requirements: e.target.value })} />
          </label>
          <label className="row">
            <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} />
            Open for applications
          </label>
          <button className="btn" type="submit">
            Save changes
          </button>
        </form>
      )}
      <form className="row" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input placeholder="Filter skill" value={skill} onChange={(e) => setSkill(e.target.value)} />
        <input placeholder="Min match %" value={minScore} onChange={(e) => setMinScore(e.target.value)} />
        <input placeholder="Min years exp" value={minYears} onChange={(e) => setMinYears(e.target.value)} />
        <button className="btn" type="submit">
          Filter
        </button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Match</th>
            <th>Skills / exp</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id}>
              <td>
                {app.candidate.first_name} {app.candidate.last_name}
                <div className="muted">{app.candidate.email}</div>
              </td>
              <td>
                <strong>{app.match_score}%</strong>
                <div className="chips">
                  {app.matched_skills.map((s) => (
                    <span className="chip ok" key={s}>
                      {s}
                    </span>
                  ))}
                  {app.missing_skills.map((s) => (
                    <span className="chip miss" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                {(app.candidate_skills || []).join(", ")}
                <div className="muted">{app.candidate_years || 0} yrs</div>
              </td>
              <td>
                <select value={app.status} onChange={(e) => setStatus(app.id, e.target.value)}>
                  {["applied", "reviewing", "shortlisted", "interview", "rejected", "hired"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td>
                <div className="row">
                  <button className="btn ghost" onClick={() => download(app.id)}>
                    Resume
                  </button>
                </div>
                <div className="row" style={{ marginTop: 8 }}>
                  <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
                  <button className="btn forest" onClick={() => schedule(app.id)}>
                    Schedule
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
