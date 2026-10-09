import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";
import api, { errMsg } from "../api/client";

export default function Signup({ setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/signup", form);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(errMsg(err, "Failed to create account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-6 overflow-hidden">
      {/* Deep Green Radial Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#010604]" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#063322] via-[#01140e] to-transparent opacity-80" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-teal-950/50 border border-teal-800/50 backdrop-blur-xl text-teal-400 mb-6 shadow-[0_0_30px_rgba(20,184,166,0.15)]">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-teal-500/80 text-sm">
            Join the campus network to start registering for events.
          </p>
        </div>

        {/* Green Glassmorphism Card */}
        <div className="bg-[#062c1e]/40 border border-[#0d4a35]/50 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner"
                  placeholder="name@university.edu"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70 pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {loading ? "Creating Account..." : "Join EventEase"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-400 mt-8 animate-in fade-in duration-1000 delay-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            Sign in here <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}
