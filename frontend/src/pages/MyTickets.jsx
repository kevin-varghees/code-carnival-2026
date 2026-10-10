import React, { useState, useEffect } from "react";
import { Ticket, Calendar, MapPin, Loader2, AlertCircle } from "lucide-react";
import api, { errMsg } from "../api/client";
import TicketQRCode from "../components/TicketQRCode";

export default function MyTickets() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyRegistrations() {
      try {
        // Adjust endpoint if your backend route differs (e.g., /api/registrations/me)
        const { data } = await api.get("/api/registrations/me");
        setRegistrations(data);
      } catch (err) {
        setError(errMsg(err, "Failed to load your event passes."));
      } finally {
        setLoading(false);
      }
    }
    fetchMyRegistrations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#010604]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] p-6 md:p-10 overflow-hidden bg-[#010604]">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#063322] via-[#01140e] to-transparent opacity-80" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-teal-950/50 border border-teal-800/50 text-teal-400">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Event Passes
            </h1>
            <p className="text-teal-500/80 text-sm">
              View your registered events and present your QR code at check-in.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="text-center py-16 bg-[#062c1e]/30 border border-[#0d4a35]/40 backdrop-blur-xl rounded-3xl p-8">
            <p className="text-zinc-400 mb-4">
              You haven't registered for any campus events yet.
            </p>
            <a
              href="/explore"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 transition-all"
            >
              Explore Events
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-[#062c1e]/40 border border-[#0d4a35]/50 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white tracking-wide">
                      {reg.event?.title || "Campus Event"}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Confirmed
                    </span>
                  </div>

                  <div className="space-y-2 mb-6 text-sm text-zinc-400">
                    {reg.event?.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>
                          {new Date(reg.event.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {reg.event?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>{reg.event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scannable QR Code Component */}
                <div className="mt-auto pt-4 border-t border-teal-900/40">
                  <TicketQRCode
                    registrationCode={reg.registration_code}
                    eventName={reg.event?.title || "Event Pass"}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
