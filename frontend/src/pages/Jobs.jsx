import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Jobs({ initialJobType = "full_time", title = "Find work that fits the stack you already have.", description = "Explore current opportunities at NINA and find a role where your work can make a visible difference." }) {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState(initialJobType);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  async function load(e) {
    e?.preventDefault();
    setError("");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    params.set("job_type", initialJobType || jobType);
    try {
      const data = await api.get(`/api/jobs/?${params.toString()}`);
      setJobs(data.results || data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    const refresh = window.setInterval(() => load(), 30000);
    return () => window.clearInterval(refresh);
  }, [initialJobType]);

  return (
    <div className="wrap careers-page">
      <div className="page-heading">
        <div>
          <div className="kicker">NINA careers</div>
          <h1>{title}</h1>
          <p className="lede">{description}</p>
        </div>
        <div className="live-status"><span className="live-dot" /> Live openings</div>
      </div>
      <form className="row" onSubmit={load} style={{ margin: "16px 0 24px" }}>
        <input placeholder="Search title, company, skill" value={q} onChange={(e) => setQ(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select value={initialJobType || jobType} onChange={(e) => setJobType(e.target.value)} disabled={Boolean(initialJobType)}>
          {initialJobType === "internship" ? (
            <option value="internship">Internship</option>
          ) : (
            <option value="full_time">Full-time</option>
          )}
        </select>
        <button className="btn" type="submit">
          Filter
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {!error && jobs.length === 0 && <p className="muted">No roles match those filters yet.</p>}
      <div className="cards">
        {jobs.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`} className="card">
            <div className="muted">{job.company?.name}</div>
            <h3>{job.title}</h3>
            <p className="muted">
              {job.location} · {job.job_type.replace("_", " ")}
            </p>
            <div className="chips">
              {(job.required_skills || []).slice(0, 5).map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
