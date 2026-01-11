import { useState } from "react";
import api from "../api/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await api.post("/api/auth/register", { email, password });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-base-200 p-6">
        <h2 className="text-xl mb-4">Register</h2>
        <input className="input mb-2" placeholder="Email"
          onChange={e => setEmail(e.target.value)} />
        <input type="password" className="input mb-4" placeholder="Password"
          onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-secondary w-full" onClick={submit}>
          Register
        </button>
      </div>
    </div>
  );
}
