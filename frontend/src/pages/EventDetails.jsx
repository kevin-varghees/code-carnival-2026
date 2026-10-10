import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import APIClient from '../api/client';
import { Calendar, MapPin, Users, ArrowLeft, Ticket, Sparkles, QrCode, CheckCircle2 } from 'lucide-react';

export default function EventDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fixed: Updated to match the correct backend endpoint /api/events/{id}
    APIClient.get(`/api/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch event details", err);
        setLoading(false);
      });
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    setRegistering(true);
    setError('');

    try {
      // Fixed: Updated registration endpoint to match backend /api/registrations/events/{id}
      const response = await APIClient.post(`/api/registrations/events/${id}`);
      setTicket(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register for this event. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#010101] flex items-center justify-center text-zinc-500 font-medium">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#010101] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">Could not load event details. It may have been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-sm font-semibold transition-all"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#010101] text-zinc-100 p-6 md:p-10 relative overflow-hidden pt-12">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800 px-4 py-2.5 rounded-xl transition-all mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Explore
        </button>

        {ticket ? (
          /* SUCCESS TICKET PASS VIEW */
          <div className="bg-[#0a0f0d] border border-emerald-500/30 rounded-[2.5pax] p-8 md:p-12 shadow-2xl backdrop-blur-2xl text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 inline-block">
              Registration Confirmed
            </span>
            <h1 className="text-3xl font-extrabold text-white mb-2">{event.title}</h1>
            <p className="text-zinc-400 text-sm mb-8">You're all set! Present your digital pass or QR code at the door.</p>

            <div className="max-w-sm mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl mb-8 text-left space-y-4">
              <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-900 pb-3">
                <span>Registration ID</span>
                <span className="font-mono text-emerald-400">{ticket.registration_code}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Event Venue</p>
                <p className="text-sm font-medium text-white">{event.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Date & Time</p>
                <p className="text-sm font-medium text-white">{new Date(event.date_time).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/tickets')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg transition-all hover:scale-105"
              >
                View in My Tickets
              </button>
            </div>
          </div>
        ) : (
          /* EVENT DETAILS VIEW */
          <div className="bg-[#0a0f0d]/80 border border-emerald-900/30 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-800/80 pb-8">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 inline-block">
                  Event Code: {event.event_code}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                  {event.title}
                </h1>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
                  {event.description}
                </p>
              </div>

              <button
                onClick={handleRegister}
                disabled={registering}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-2"
              >
                {registering ? (
                  <span className="animate-pulse">Registering...</span>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" /> Register For Event
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-950/50 border border-zinc-800/80">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Date & Time</p>
                  <p className="text-sm font-semibold text-white">{new Date(event.date_time).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-950/50 border border-zinc-800/80">
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-semibold text-white">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-950/50 border border-zinc-800/80">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Capacity</p>
                  <p className="text-sm font-semibold text-white">{event.capacity} Attendees Max</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}