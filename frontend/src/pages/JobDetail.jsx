import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [match, setMatch] = useState(null);
  const [cover, setCover] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/jobs/${id}/`).then(setJob).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (user?.role === "candidate") {
      api.get(`/api/resumes/match/${id}/`).then(setMatch).catch(() => {});
    }
  }, [id, user]);

  async function apply() {
    setError("");
    setMsg("");
    if (!user) return navigate("/login");
    try {
      await api.post(`/api/applications/jobs/${id}/apply/`, { cover_letter: cover });
      setJob((j) => ({ ...j, has_applied: true }));
      setMsg("Application sent.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function save() {
    if (!user) return navigate("/login");
    const data = await api.post(`/api/jobs/${id}/save/`, {});
    setMsg(data.saved ? "Saved to bookmarks." : "Removed from saved jobs.");
  }

  if (!job) return <div className="wrap">{error || "Loading…"}</div>;

  return (
    <div className="wrap">
      <div className="muted">{job.company?.name}</div>
      <h1>{job.title}</h1>
      <p className="muted">
        {job.location} · {job.job_type.replace("_", " ")}
        {job.salary_min ? ` · $${job.salary_min.toLocaleString()}–$${job.salary_max?.toLocaleString()}` : ""}
      </p>
      <div className="chips">
        {(job.required_skills || []).map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
      </div>
      {match && user?.role === "candidate" && (
        <div className="card" style={{ margin: "16px 0" }}>
          <div className="kicker">Your match</div>
          <div className="score" style={{ fontSize: 42 }}>
            {match.score}%
          </div>
          <div className="chips">
            {match.matched.map((s) => (
              <span className="chip ok" key={s}>
                {s}
              </span>
            ))}
            {match.missing.map((s) => (
              <span className="chip miss" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="card">
        <h3>Role</h3>
        <p>{job.description}</p>
        <h3>Requirements</h3>
        <p>{job.requirements}</p>
      </div>
      {user?.role !== "recruiter" && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Apply</h3>
          <textarea rows={5} placeholder="Short note to the hiring team" value={cover} onChange={(e) => setCover(e.target.value)} />
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn copper" onClick={apply} disabled={job.has_applied}>
              {job.has_applied ? "Applied" : "Submit application"}
            </button>
            <button className="btn ghost" onClick={save}>
              Save job
            </button>
          </div>
          {msg && <p className="success">{msg}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}
