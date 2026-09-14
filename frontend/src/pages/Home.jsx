import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="wrap">
      <section className="hero">
        <div>
          <div className="kicker">Nina Organization</div>
          <h1>Hiring that reads the resume, not just the form.</h1>
          <p className="lede">
            A candidate marketplace and recruiter desk in one place. Upload a resume, extract skills, and see a live match
            score against every role.
          </p>
          <div className="row" style={{ marginTop: 22 }}>
            <Link className="btn copper" to="/register">
              Create an account
            </Link>
            <Link className="btn ghost" to="/jobs">
              Browse open roles
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="kicker">Match engine</div>
          <div>Python Developer · required Python, Django, PostgreSQL, Docker</div>
          <div className="chips">
            <span className="chip ok">Python</span>
            <span className="chip ok">Django</span>
            <span className="chip miss">Docker</span>
            <span className="chip ok">PostgreSQL</span>
          </div>
          <div className="score">75%</div>
          <p className="muted">Simple skill matching first. NLP can be layered later without changing the product surface.</p>
        </div>
      </section>
      <div className="cards" style={{ marginTop: 36 }}>
        <article className="card">
          <h3>Candidates</h3>
          <p className="muted">Profiles, resume parse, saved jobs, application tracking, and notifications.</p>
        </article>
        <article className="card">
          <h3>Recruiters</h3>
          <p className="muted">Company pages, job posts, ranked applicants, status changes, resume download, interviews.</p>
        </article>
        <article className="card">
          <h3>Admins</h3>
          <p className="muted">Users, companies, jobs, block/unblock, and hiring statistics on one desk.</p>
        </article>
      </div>
    </div>
  );
}
