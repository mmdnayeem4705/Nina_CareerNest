import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Notifications() {
  const [data, setData] = useState({ unread: 0, results: [] });
  const load = () => api.get("/api/notifications/").then(setData);
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <div className="row">
        <h1>Notifications</h1>
        <button className="btn ghost" onClick={() => api.post("/api/notifications/read-all/", {}).then(load)}>
          Mark all read
        </button>
      </div>
      <p className="muted">{data.unread} unread</p>
      <div className="grid">
        {data.results.map((n) => (
          <article className="notice" key={n.id} style={{ opacity: n.is_read ? 0.65 : 1 }}>
            <strong>{n.title}</strong>
            <p>{n.body}</p>
            {n.link && <Link to={n.link}>Open</Link>}
          </article>
        ))}
      </div>
    </div>
  );
}
