import { useEffect, useState } from "react";
import { api } from "../api";

const emptyEdu = { school: "", degree: "", field: "", start_year: "", end_year: "" };
const emptyExp = { company: "", title: "", start_date: "", end_date: "", description: "" };

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState("");
  const [msg, setMsg] = useState("");
  const [avatarError, setAvatarError] = useState("");
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

  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError("");
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const updatedUser = await api.upload("/api/auth/me/avatar/", fd);
      setProfile((current) => ({ ...current, user: updatedUser }));
      setMsg("Profile photo updated.");
    } catch (err) {
      setAvatarError(err.message);
    } finally {
      e.target.value = "";
    }
  }

  if (!profile) return <p>Loading…</p>;

  const user = profile.user || {};
  const displayName = `${user.first_name || "Candidate"} ${user.last_name || ""}`.trim();
  const avatar = user.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`;
  const completenessItems = [
    ["Headline", Boolean(profile.headline)],
    ["About", Boolean(profile.bio)],
    ["Location", Boolean(profile.location)],
    ["Skills", (profile.skills || []).length > 0],
    ["Education", (profile.education || []).length > 0],
    ["Experience", (profile.experience || []).length > 0],
    ["Resume", resumes.length > 0],
  ];
  const completeness = Math.round((completenessItems.filter(([, complete]) => complete).length / completenessItems.length) * 100);

  return (
    <div className="profile-page">
      <div className="profile-heading">
        <div><div className="kicker">Candidate profile</div><h1>Make your next opportunity easier to find.</h1></div>
        <span className="profile-state"><span className="live-dot" /> Open to opportunities</span>
      </div>
      <section className="profile-hero-card">
        <div className="profile-avatar-wrap">
          <img className="profile-avatar" src={avatar} alt={`${displayName} profile`} />
          <label className="avatar-upload" title="Upload profile photo">
            <span aria-hidden="true">+</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadAvatar} />
          </label>
        </div>
        <div className="profile-identity">
          <h2>{displayName}</h2>
          <p className="profile-headline">{profile.headline || "Add a professional headline"}</p>
          <div className="profile-meta">
            {profile.location && <span>⌖ {profile.location}</span>}
            <span>✉ {user.email}</span>
            {user.phone && <span>☎ {user.phone}</span>}
          </div>
          <div className="chips">{(profile.skills || []).slice(0, 6).map((skill) => <span className="chip" key={skill}>{skill}</span>)}</div>
        </div>
        <div className="profile-score"><strong>{completeness}%</strong><span>profile complete</span></div>
      </section>
      {avatarError && <p className="error profile-avatar-error">{avatarError}</p>}
      <div className="profile-grid">
        <main>
          <form className="form profile-form" onSubmit={save}>
            <section className="profile-section card">
              <div className="section-title"><div><div className="kicker">About you</div><h2>Professional details</h2></div><span className="section-number">01</span></div>
              <label>Headline<input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} placeholder="e.g. Python developer who ships reliable APIs" /></label>
              <label>Location<input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="City, country" /></label>
              <label>About you<textarea rows={5} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell hiring teams what you do well." /></label>
              <div className="row profile-fields"><label>Skills<input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Python, Django, SQL" /></label><label>Years of experience<input type="number" min="0" value={profile.years_experience ?? 0} onChange={(e) => setProfile({ ...profile, years_experience: Number(e.target.value) })} /></label></div>
            </section>
            <section className="profile-section card">
              <div className="section-title"><div><div className="kicker">Education</div><h2>Academic background</h2></div><span className="section-number">02</span></div>
              {(profile.education || []).map((ed, i) => <div className="profile-entry" key={i}><input placeholder="School or university" value={ed.school} onChange={(e) => { const education = [...profile.education]; education[i] = { ...ed, school: e.target.value }; setProfile({ ...profile, education }); }} /><input placeholder="Degree" value={ed.degree} onChange={(e) => { const education = [...profile.education]; education[i] = { ...ed, degree: e.target.value }; setProfile({ ...profile, education }); }} /></div>)}
              <button type="button" className="btn ghost" onClick={() => setProfile({ ...profile, education: [...(profile.education || []), emptyEdu] })}>+ Add education</button>
            </section>
            <section className="profile-section card">
              <div className="section-title"><div><div className="kicker">Experience</div><h2>Where you have made an impact</h2></div><span className="section-number">03</span></div>
              {(profile.experience || []).map((ex, i) => <div className="profile-experience" key={i}><div className="row"><input placeholder="Company" value={ex.company} onChange={(e) => { const experience = [...profile.experience]; experience[i] = { ...ex, company: e.target.value }; setProfile({ ...profile, experience }); }} /><input placeholder="Role title" value={ex.title} onChange={(e) => { const experience = [...profile.experience]; experience[i] = { ...ex, title: e.target.value }; setProfile({ ...profile, experience }); }} /></div><textarea placeholder="What did you work on?" value={ex.description} onChange={(e) => { const experience = [...profile.experience]; experience[i] = { ...ex, description: e.target.value }; setProfile({ ...profile, experience }); }} /></div>)}
              <button type="button" className="btn ghost" onClick={() => setProfile({ ...profile, experience: [...(profile.experience || []), emptyExp] })}>+ Add experience</button>
            </section>
            <div className="profile-save-row"><button className="btn copper" type="submit">Save profile</button>{msg && <p className="success">{msg}</p>}</div>
          </form>
        </main>
        <aside className="profile-aside">
          <section className="card completeness-card"><div className="kicker">Profile strength</div><h2>{completeness}% complete</h2><div className="progress"><span style={{ width: `${completeness}%` }} /></div><p className="muted">Complete your profile to help the right team understand your experience.</p><ul>{completenessItems.map(([label, complete]) => <li key={label} className={complete ? "complete" : "missing"}><span>{complete ? "✓" : "+"}</span>{label}</li>)}</ul></section>
          <section className="card resume-card"><div className="kicker">Your resume</div><h2>Show your work</h2><p className="muted">PDF, DOCX, or TXT. We extract skills to improve job matching.</p><label className="upload-control"><span>Upload resume</span><input type="file" accept=".pdf,.doc,.docx,.txt" onChange={upload} /></label>{resumes.map((resume) => <div className="resume-item" key={resume.id}><strong>{resume.original_name}</strong><span>{(resume.extracted_skills || []).join(", ") || "Parsed successfully"}</span></div>)}</section>
        </aside>
      </div>
    </div>
  );
}
