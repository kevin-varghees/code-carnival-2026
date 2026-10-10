import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  MapPin,
  AlertCircle,
} from "lucide-react";
import api, { errMsg } from "../api/client";
import TicketQRCode from "../components/TicketQRCode";

export default function TicketPage() {
  const { id } = useParams(); // Gets registration ID from URL (e.g., /tickets/:id)
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTicketDetails() {
      try {
        const { data } = await api.get(`/api/registrations/${id}`);
        setTicket(data);
      } catch (err) {
        setError(errMsg(err, "Failed to load ticket details."));
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTicketDetails();
  }, [id]);

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

      <div className="relative z-10 max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-400 mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>

        {error ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : ticket ? (
          <div className="bg-[#062c1e]/40 border border-[#0d4a35]/50 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <div className="text-center mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 inline-block mb-3">
                Official Campus Pass
              </span>
              <h1 className="text-2xl font-extrabold text-white">
                {ticket.event?.title || "Event Pass"}
              </h1>
            </div>

            <div className="space-y-2 mb-6 text-sm text-zinc-400 bg-[#02120c]/60 p-4 rounded-2xl border border-[#0d4a35]/40">
              {ticket.event?.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>{new Date(ticket.event.date).toLocaleString()}</span>
                </div>
              )}
              {ticket.event?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{ticket.event.location}</span>
                </div>
              )}
            </div>

            {/* QR Code Display & Download */}
            <TicketQRCode
              registrationCode={ticket.registration_code}
              eventName={ticket.event?.title || "Event Pass"}
            />
          </div>
        ) : (
          <p className="text-center text-zinc-400">Ticket not found.</p>
        )}
      </div>
    </div>
  );
}
