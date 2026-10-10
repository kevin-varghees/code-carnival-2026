import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Calendar, Users, QrCode, PlusCircle } from "lucide-react";
import CheckInScanner from "../components/CheckInScanner";

export default function OrganizerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-80px)] p-6 md:p-10 overflow-hidden bg-[#010604]">
      {/* Background Neon Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#063322] via-[#01140e] to-transparent opacity-80" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-950/50 border border-teal-800/50 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Organizer Dashboard
              </h1>
              <p className="text-teal-500/80 text-sm">
                Manage event attendance and run door check-ins.
              </p>
            </div>
          </div>
          
          {/* Merged: Kept your Create New Event button action */}
          <button
            onClick={() => navigate('/create-event')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> Create New Event
          </button>
        </div>

        {/* Quick Stats or Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#062c1e]/40 border border-[#0d4a35]/50 backdrop-blur-2xl rounded-3xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                Active Scanner
              </p>
              <h3 className="text-white font-bold text-lg">
                Ready for Check-ins
              </h3>
            </div>
          </div>

          <div className="bg-[#062c1e]/40 border border-[#0d4a35]/50 backdrop-blur-2xl rounded-3xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                Access Level
              </p>
              <h3 className="text-white font-bold text-lg">
                Event Administrator
              </h3>
            </div>
          </div>
        </div>

        {/* Embedded Check-In Scanner Terminal */}
        <div className="bg-[#062c1e]/20 border border-[#0d4a35]/40 backdrop-blur-xl rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-2 text-center">
            Door Check-In Portal
          </h2>
          <p className="text-zinc-400 text-sm text-center mb-6">
            Type or scan student ticket codes below to mark them present.
          </p>

          <CheckInScanner />
        </div>
      </div>
    </div>
  );
}