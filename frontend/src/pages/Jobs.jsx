import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Jobs() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  async function load(e) {
    e?.preventDefault();
    setError("");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    if (jobType) params.set("job_type", jobType);
    try {
      const data = await api.get(`/api/jobs/?${params.toString()}`);
      setJobs(data.results || data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="wrap">
      <div className="kicker">Open roles</div>
      <h1>Find work that fits the stack you already have.</h1>
      <form className="row" onSubmit={load} style={{ margin: "16px 0 24px" }}>
        <input placeholder="Search title, company, skill" value={q} onChange={(e) => setQ(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="">All types</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
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
