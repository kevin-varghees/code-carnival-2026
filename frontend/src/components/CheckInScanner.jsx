import React, { useState } from "react";
import { ScanLine, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import api, { errMsg } from "../api/client";

export default function CheckInScanner() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Fixed parameter name to match backend: registration_code instead of qr_token
      const { data } = await api.post(
        `/api/attendance/scan?registration_code=${encodeURIComponent(token.trim())}`,
      );
      setResult(data);
    } catch (err) {
      setResult({
        status: "error",
        message: errMsg(
          err,
          "Failed to connect to backend or invalid QR code.",
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#062c1e]/40 border border-[#0d4a35]/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] mt-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-950/50 border border-teal-800/50 text-teal-400 mb-3 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
          <ScanLine className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          Event Check-In Terminal
        </h2>
        <p className="text-teal-500/80 text-sm mt-1">
          Scan or input attendee pass code
        </p>
      </div>

      <form onSubmit={handleCheckIn} className="space-y-4">
        <input
          type="text"
          placeholder="Paste or Scan Registration Code here..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 shadow-inner text-center font-mono text-sm tracking-wider"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ScanLine className="w-5 h-5" />
          )}
          {loading ? "Verifying..." : "Mark Present (Check-In)"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-6 p-4 rounded-2xl border text-sm ${
            result.status === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : result.status === "already_checked_in"
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {result.status === "success" ||
            result.status === "already_checked_in" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{result.message}</span>
          </div>
          <p className="text-xs opacity-80 mt-1 uppercase tracking-wider font-mono">
            Status: {result.status}
          </p>
          {result.checked_in_at && (
            <p className="text-xs mt-1 opacity-80">
              Time: {new Date(result.checked_in_at).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
