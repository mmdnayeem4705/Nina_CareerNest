import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("candidate@nina.org");
  const [password, setPassword] = useState("Candidate1234!");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "recruiter") navigate("/recruiter");
      else navigate("/jobs");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="wrap" style={{ maxWidth: 480 }}>
      <div className="kicker">Welcome back</div>
      <h1>Sign in</h1>
      <p className="muted">Demo: candidate@nina.org / Candidate1234! · recruiter@nina.org / Recruiter1234! · admin@nina.org / Admin1234!</p>
      <form className="form card" onSubmit={onSubmit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">
          Continue
        </button>
      </form>
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
