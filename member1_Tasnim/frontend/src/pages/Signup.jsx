import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Rocket, Mail, Lock, User } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { AMBER, ORANGE, NAVY } from "../theme";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");

    fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status !== 201) {
          setError(data.message || "Signup failed. Please try again.");
          return;
        }
        navigate("/login");
      })
      .catch(() => {
        setError("Could not reach the server. Is the backend running?");
      });
  }

  function handleGoogleSuccess(credentialResponse) {
    setError("");
    fetch("http://localhost:5000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status !== 200 && status !== 201) {
          setError(data.message || "Google sign-in failed.");
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      })
      .catch(() => setError("Could not reach the server."));
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${AMBER}, ${ORANGE})` }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-12 h-12 rounded-xl text-white flex items-center justify-center mb-3"
            style={{ background: NAVY }}
          >
            <Rocket size={22} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: NAVY }}>
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mt-1">Start managing your startup team</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="mb-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-in failed. Please try again.")}
          />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Full Name</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-orange-400">
              <User size={16} className="text-slate-400 mr-2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Email</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-orange-400">
              <Mail size={16} className="text-slate-400 mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@startup.com"
                className="w-full text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Password</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-orange-400">
              <Lock size={16} className="text-slate-400 mr-2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Confirm Password</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-orange-400">
              <Lock size={16} className="text-slate-400 mr-2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white text-sm font-medium py-2.5 rounded-lg transition hover:opacity-90"
            style={{ background: ORANGE }}
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-medium" style={{ color: ORANGE }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
