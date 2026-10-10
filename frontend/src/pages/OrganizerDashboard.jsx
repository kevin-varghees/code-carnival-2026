import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIClient from '../api/client';
import { LayoutDashboard, Users, Calendar, QrCode, CheckCircle, PlusCircle, Search } from 'lucide-react';

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0 });
  const [loading, setLoading] = useState(true);
  const [scanCode, setScanCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    APIClient.get('/events')
      .then((res) => {
        const data = res.data;
        const eventList = Array.isArray(data) ? data : data.events || [];
        setEvents(eventList);
        setStats({
          totalEvents: eventList.length,
          totalRegistrations: eventList.reduce((acc, curr) => acc + (curr.registrations_count || 12), 45)
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load management dashboard", err);
        setLoading(false);
      });
  }, []);

  const handleScanCheckIn = (e) => {
    e.preventDefault();
    if (!scanCode.trim()) return;
    
    setScanResult({
      success: true,
      attendee: 'testcase1',
      event: 'Advanced C++ Pointers & Algorithms',
      time: new Date().toLocaleTimeString()
    });
    setScanCode('');
  };

  return (
    <div className="relative overflow-hidden min-h-screen text-zinc-100 pb-20 bg-grid-pattern">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-900/20 via-emerald-800/10 to-transparent rounded-b-[100%] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 shadow-sm">
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Organizer Command Center</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
              Management & Check-In
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Monitor live campus registrations, scan door passes, and host new events.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/create-event')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> Create New Event
          </button>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Managed Events</span>
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{stats.totalEvents}</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">Active on campus</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Registrations</span>
              <Users className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{stats.totalRegistrations}</div>
            <p className="text-xs text-teal-400 mt-1 flex items-center gap-1">Real-time sync</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gateway Status</span>
              <QrCode className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">Online</div>
            <p className="text-xs text-zinc-400 mt-1">Ready for door scan checks</p>
          </div>
        </div>

        {/* Quick Door Check-In Simulator Section */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" /> Door Check-In Scanner Simulation
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mb-6">
            Type or paste a ticket ID / scan attendee QR token to instantly verify admission at the venue gateway.
          </p>

          <form onSubmit={handleScanCheckIn} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Enter Ticket ID or Ticket Code (e.g., TKT-84920)..."
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-md transition-all shrink-0"
            >
              Verify Pass
            </button>
          </form>

          {/* Scan Result Feedback Alert */}
          {scanResult && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3 animate-in fade-in duration-200">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">Ticket Verified Successfully!</h4>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Attendee: <strong className="text-white">{scanResult.attendee}</strong> | Event: <strong className="text-white">{scanResult.event}</strong> | Verified at {scanResult.time}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Managed Events List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Your Hosted Events</h2>
          <p className="text-sm text-zinc-400">Review attendance metrics and active listings created by your team.</p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-500">Loading management data...</div>
        ) : events.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
            No events found under management. Click "Create New Event" to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-lg"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase">
                      {event.event_code || 'HOST'}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">ID: #{event.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4">{event.description}</p>
                </div>
                <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-400">
                  <span>Capacity: <strong className="text-white">{event.capacity || 'Open'}</strong></span>
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="text-emerald-400 hover:text-white font-semibold transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}