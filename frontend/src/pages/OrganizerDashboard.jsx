import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import APIClient from "../api/client";
import { ShieldCheck, Calendar, Users, QrCode, PlusCircle, ArrowLeft, MapPin, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import CheckInScanner from "../components/CheckInScanner";

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Function to fetch organizer's events
  const fetchMyEvents = () => {
    setLoading(true);
    APIClient.get("/api/events/mine")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch organizer events", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setLoadingDetails(true);
    try {
      const [regRes, statsRes] = await Promise.all([
        APIClient.get(`/api/events/${event.id}/registrations`),
        APIClient.get(`/api/events/${event.id}/stats`)
      ]);
      setAttendees(regRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch event details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] p-6 md:p-10 overflow-hidden bg-[#010604]">
      {/* Background Neon Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#063322] via-[#01140e] to-transparent opacity-80" />

      <div className="relative z-10 max-w-5xl mx-auto">
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
                Manage event attendance, view members, and run door check-ins.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyEvents}
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
              title="Refresh Events"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => navigate('/create-event')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" /> Create New Event
            </button>
          </div>
        </div>

        {/* CONDITIONAL VIEW: Event Details vs. Event List */}
        {selectedEvent ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <button
              onClick={() => setSelectedEvent(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 border border-emerald-900/50 px-4 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to My Events
            </button>

            <div className="bg-[#062c1e]/40 border border-[#0d4a35]/50 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3 inline-block">
                    Event Code: {selectedEvent.event_code}
                  </span>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                  <p className="text-sm text-zinc-400 max-w-2xl">{selectedEvent.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#0d4a35]/40 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{new Date(selectedEvent.date_time).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Capacity: {stats?.registered_count || 0} / {selectedEvent.capacity}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-[#062c1e]/20 border border-[#0d4a35]/40 backdrop-blur-xl rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 text-center">Door Check-In Terminal</h3>
                <CheckInScanner eventId={selectedEvent.id} />
              </div>

              <div className="lg:col-span-2 bg-[#062c1e]/20 border border-[#0d4a35]/40 backdrop-blur-xl rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Registered Members ({attendees.length})</h3>
                
                {loadingDetails ? (
                  <div className="py-12 text-center text-zinc-500">Loading attendees...</div>
                ) : attendees.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500">No attendees registered for this event yet.</div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {attendees.map((attendee) => (
                      <div key={attendee.registration_id} className="flex items-center justify-between p-3.5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl">
                        <div>
                          <h4 className="text-sm font-bold text-white">{attendee.name}</h4>
                          <p className="text-xs text-zinc-400">{attendee.email}</p>
                        </div>
                        <div>
                          {attendee.checked_in ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Present
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-semibold">
                              <XCircle className="w-3.5 h-3.5" /> Not Checked In
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Your Managed Events</h2>
            {loading ? (
              <div className="py-20 text-center text-zinc-500">Loading your events...</div>
            ) : events.length === 0 ? (
              <div className="bg-[#062c1e]/20 border border-[#0d4a35]/40 backdrop-blur-xl rounded-3xl p-12 text-center text-zinc-400">
                <p className="mb-4">You haven't created any events yet!</p>
                <button
                  onClick={() => navigate('/create-event')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Create Your First Event
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleSelectEvent(event)}
                    className="bg-[#062c1e]/40 border border-[#0d4a35]/50 hover:border-emerald-500/50 backdrop-blur-2xl rounded-3xl p-6 shadow-xl cursor-pointer transition-all hover:scale-[1.02] group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                        {event.event_code}
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        {new Date(event.date_time).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-4">{event.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#0d4a35]/40 text-xs text-zinc-300">
                      <span>📍 {event.location}</span>
                      <span className="text-emerald-400 font-semibold">Manage & View Members →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}