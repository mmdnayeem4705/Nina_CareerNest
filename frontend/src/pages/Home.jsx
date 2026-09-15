import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [openRoles, setOpenRoles] = useState("...");

  useEffect(() => {
    api.get("/api/jobs/").then((data) => setOpenRoles(data.count ?? data.length)).catch(() => setOpenRoles("many"));
  }, []);

  return (
    <div className="wrap">
      <section className="hero">
        <div>
          <div className="kicker">Nina Organization · Careers</div>
          <h2>Do meaningful work with a team building what is next.</h2>
          <p className="lede">
            Explore opportunities at NINA, a private organization where curious people solve real problems, learn quickly,
            and make an impact that reaches beyond their job title.
          </p>
          <div className="row" style={{ marginTop: 22 }}>
            <Link className="btn copper" to="/register">
              Create an account
            </Link>
            <Link className="btn ghost" to="/internships">
              Explore internships
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="kicker hero-card-kicker">Inside NINA</div>
          <div className="hero-card-title">A workplace with room to grow.</div>
          
          <div className="score">{openRoles} <span>open roles</span></div>
          <p className="muted">Full-time roles, remote opportunities, and internships are refreshed as teams grow.</p>
        </div>
      </section>
      <div className="cards" style={{ marginTop: 36 }}>
        <article className="card">
          <h3>Build your path</h3>
          <p className="muted">Create a profile, discover opportunities, and follow every application from one place.</p>
        </article>
        <article className="card">
          <h3>Work with purpose</h3>
          <p className="muted">Join teams that value ownership, clear thinking, and progress over performative process.</p>
        </article>
        <article className="card">
          <h3>Start early</h3>
          <p className="muted">Our internship opportunities pair real responsibility with support from experienced teammates.</p>
        </article>
      </div>
    </div>
  );
}
