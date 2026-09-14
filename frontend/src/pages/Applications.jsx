import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Applications() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/api/applications/mine/").then(setItems);
  }, []);
  return (
    <div>
      <div className="kicker">Pipeline</div>
      <h1>Your applications</h1>
      {items.length === 0 && <p className="muted">You have not applied to any roles yet.</p>}
      <div className="cards">
        {items.map((app) => (
          <article className="card" key={app.id}>
            <Link to={`/jobs/${app.job.id}`}>
              <h3>{app.job.title}</h3>
            </Link>
            <p className="muted">{app.job.company?.name}</p>
            <span className="badge">{app.status}</span>
            <div className="stat">{app.match_score}%</div>
            {app.interviews?.length > 0 && (
              <p>Interview: {new Date(app.interviews[0].scheduled_at).toLocaleString()}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
