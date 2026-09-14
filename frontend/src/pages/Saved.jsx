import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Saved() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    api.get("/api/jobs/saved/").then((data) => setJobs(data.results || data));
  }, []);
  return (
    <div>
      <h1>Saved jobs</h1>
      <div className="cards">
        {jobs.map((job) => (
          <Link key={job.id} className="card" to={`/jobs/${job.id}`}>
            <h3>{job.title}</h3>
            <p className="muted">{job.company?.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
