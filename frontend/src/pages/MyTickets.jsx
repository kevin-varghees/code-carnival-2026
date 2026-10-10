import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Ticket, Calendar, MapPin, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const { data } = await api.get('/api/registrations/my-tickets');
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch tickets, assuming empty list", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const handleDownloadPDF = async (registrationId) => {
    try {
      const response = await api.get(`/api/registrations/${registrationId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `EventEase-Ticket-${registrationId}.pdf`;
      link.click();
    } catch (err) {
      console.error("Failed to download PDF ticket", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#010604] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#010604] text-zinc-100 p-6 md:p-10 relative overflow-hidden pt-12">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Ticket className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Event Passes</h1>
          </div>
          <p className="text-zinc-400 text-sm">View your registered events and present your QR code at check-in.</p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-[#0a0f0d]/80 border border-emerald-900/30 rounded-3xl p-12 text-center backdrop-blur-2xl shadow-xl">
            <p className="text-zinc-400 mb-6">You haven't registered for any campus events yet.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg transition-all hover:scale-105"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div 
                key={ticket.registration_id}
                className="bg-[#0a0f0d]/80 border border-emerald-900/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      {ticket.event?.event_code || "PASS"}
                    </span>
                    {ticket.checked_in ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold">
                        Ready for Admission
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white">{ticket.event?.title || "Campus Event"}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>{ticket.event?.date_time ? new Date(ticket.event.date_time).toLocaleString() : 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      <span>{ticket.event?.location || 'Main Campus'}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-4">
                    <button
                      onClick={() => handleDownloadPDF(ticket.registration_id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-emerald-400 text-xs font-semibold transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF Pass
                    </button>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <QRCodeSVG value={ticket.qr_data || ticket.registration_code} size={110} />
                  <span className="text-[10px] font-mono text-slate-700 mt-2 font-semibold">
                    {ticket.registration_code ? ticket.registration_code.slice(0, 8) + '...' : 'PASS'}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}