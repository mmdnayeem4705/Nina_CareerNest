import { useEffect, useState } from "react";
import { api } from "../api";

const emptyEdu = { school: "", degree: "", field: "", start_year: "", end_year: "" };
const emptyExp = { company: "", title: "", start_date: "", end_date: "", description: "" };

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState("");
  const [msg, setMsg] = useState("");
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    api.get("/api/auth/profile/").then((p) => {
      setProfile(p);
      setSkills((p.skills || []).join(", "));
    });
    api.get("/api/resumes/").then(setResumes).catch(() => {});
  }, []);

  async function save(e) {
    e.preventDefault();
    const payload = {
      ...profile,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const saved = await api.patch("/api/auth/profile/", payload);
    setProfile(saved);
    setMsg("Profile saved.");
  }

  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const resume = await api.upload("/api/resumes/", fd);
    setResumes((r) => [resume, ...r]);
    const p = await api.get("/api/auth/profile/");
    setProfile(p);
    setSkills((p.skills || []).join(", "));
    setMsg("Resume parsed. Skills were merged into your profile.");
  }

  if (!profile) return <p>Loading…</p>;

  return (
    <div>
      <div className="kicker">Candidate</div>
      <h1>Your profile</h1>
      <form className="form" onSubmit={save}>
        <label>
          Headline
          <input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} />
        </label>
        <label>
          Location
          <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
        </label>
        <label>
          Bio
          <textarea rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
        </label>
        <label>
          Skills (comma separated)
          <input value={skills} onChange={(e) => setSkills(e.target.value)} />
        </label>
        <label>
          Years of experience
          <input
            type="number"
            min="0"
            value={profile.years_experience ?? 0}
            onChange={(e) => setProfile({ ...profile, years_experience: Number(e.target.value) })}
          />
        </label>
        <h3>Education</h3>
        {(profile.education || []).map((ed, i) => (
          <div className="row" key={i}>
            <input placeholder="School" value={ed.school} onChange={(e) => {
              const education = [...profile.education];
              education[i] = { ...ed, school: e.target.value };
              setProfile({ ...profile, education });
            }} />
            <input placeholder="Degree" value={ed.degree} onChange={(e) => {
              const education = [...profile.education];
              education[i] = { ...ed, degree: e.target.value };
              setProfile({ ...profile, education });
            }} />
          </div>
        ))}
        <button type="button" className="btn ghost" onClick={() => setProfile({ ...profile, education: [...(profile.education || []), emptyEdu] })}>
          Add education
        </button>
        <h3>Experience</h3>
        {(profile.experience || []).map((ex, i) => (
          <div className="grid" key={i}>
            <div className="row">
              <input placeholder="Company" value={ex.company} onChange={(e) => {
                const experience = [...profile.experience];
                experience[i] = { ...ex, company: e.target.value };
                setProfile({ ...profile, experience });
              }} />
              <input placeholder="Title" value={ex.title} onChange={(e) => {
                const experience = [...profile.experience];
                experience[i] = { ...ex, title: e.target.value };
                setProfile({ ...profile, experience });
              }} />
            </div>
            <textarea placeholder="Description" value={ex.description} onChange={(e) => {
              const experience = [...profile.experience];
              experience[i] = { ...ex, description: e.target.value };
              setProfile({ ...profile, experience });
            }} />
          </div>
        ))}
        <button type="button" className="btn ghost" onClick={() => setProfile({ ...profile, experience: [...(profile.experience || []), emptyExp] })}>
          Add experience
        </button>
        <button className="btn" type="submit">
          Save profile
        </button>
        {msg && <p className="success">{msg}</p>}
      </form>
      <div className="card" style={{ marginTop: 24 }}>
        <h3>Resume</h3>
        <p className="muted">PDF, DOCX, or TXT. Skills are extracted and scored against jobs.</p>
        <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={upload} />
        <ul>
          {resumes.map((r) => (
            <li key={r.id}>
              {r.original_name} · {(r.extracted_skills || []).join(", ") || "no skills found"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
