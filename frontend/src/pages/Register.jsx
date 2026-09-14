import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "candidate",
  });
  const [error, setError] = useState("");

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      navigate(user.role === "recruiter" ? "/recruiter" : "/profile");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="wrap" style={{ maxWidth: 560 }}>
      <div className="kicker">Join NINA</div>
      <h1>Create your workspace</h1>
      <form className="form card" onSubmit={onSubmit}>
        <div className="row">
          <label style={{ flex: 1 }}>
            First name
            <input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} required />
          </label>
          <label style={{ flex: 1 }}>
            Last name
            <input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
          </label>
        </div>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </label>
        <label>
          I am a
          <select value={form.role} onChange={(e) => set("role", e.target.value)}>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </label>
        <label>
          Password
          <input type="password" minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn copper" type="submit">
          Get started
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
