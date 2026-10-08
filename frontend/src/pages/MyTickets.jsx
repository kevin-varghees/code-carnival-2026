import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIClient from '../api/client';
import { Ticket, QrCode, Calendar, MapPin, ShieldCheck, ArrowLeft, Trash2, Users, AlertCircle } from 'lucide-react';

export default function MyTickets({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null); // Used to show the detailed "inside" view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let apiTickets = [];
        try {
          const res = await APIClient.get('/my-tickets');
          apiTickets = Array.isArray(res.data) ? res.data : res.data.tickets || res.data.registrations || [];
        } catch {
          try {
            const res = await APIClient.get('/registrations');
            apiTickets = Array.isArray(res.data) ? res.data : res.data.tickets || res.data.registrations || [];
          } catch {
            apiTickets = [];
          }
        }

        // Merge with localStorage fallback tickets
        const localTickets = JSON.parse(localStorage.getItem('user_tickets') || '[]');
        
        // Combine and deduplicate
        const combinedMap = new Map();
        [...apiTickets, ...localTickets].forEach((t) => {
          const key = t.id || t.registration_id || t.title;
          combinedMap.set(key, t);
        });

        setTickets(Array.from(combinedMap.values()));
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCancelRegistration = (ticketToCancel) => {
    const isConfirmed = window.confirm("Are you sure you want to cancel your registration for this event?");
    if (!isConfirmed) return;

    // Remove from local storage (Fallback DB)
    const localTickets = JSON.parse(localStorage.getItem('user_tickets') || '[]');
    const updatedTickets = localTickets.filter(
      t => t.id !== ticketToCancel.id && t.registration_id !== ticketToCancel.registration_id && t.title !== ticketToCancel.title
    );
    localStorage.setItem('user_tickets', JSON.stringify(updatedTickets));

    // Update state to remove the ticket from UI
    setTickets(tickets.filter(t => t !== ticketToCancel));
    
    // Go back to the main list
    setSelectedTicket(null);
  };

  // =======================================================================
  // DETAILED "INSIDE" VIEW (Shows when a ticket is clicked)
  // =======================================================================
  if (selectedTicket) {
    return (
      <div className="relative overflow-hidden min-h-screen text-zinc-100 pb-20 bg-[#010101]">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-900/20 via-emerald-800/10 to-transparent rounded-b-[100%] blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10">
          
          <button 
            onClick={() => setSelectedTicket(null)}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-400 font-semibold text-sm mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to My Tickets
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Event Details */}
            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-6 inline-block shadow-sm">
                  {selectedTicket.event_code || selectedTicket.event?.event_code || 'EVENT PASS'}
                </span>

                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                  {selectedTicket.event_title || selectedTicket.title || selectedTicket.event?.title}
                </h1>
                
                <p className="text-base text-zinc-400 leading-relaxed mb-10 max-w-2xl">
                  {selectedTicket.description || selectedTicket.event?.description || 'You are registered for this event. Please present your digital QR ticket at the gateway for check-in.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-0.5">Date & Time</p>
                      <p className="text-sm font-bold text-white">{selectedTicket.date || selectedTicket.event?.date || 'To be announced'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-teal-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-0.5">Location</p>
                      <p className="text-sm font-bold text-white">{selectedTicket.location || selectedTicket.event?.location || 'Campus Venue'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-0.5">Availability</p>
                      <p className="text-sm font-bold text-emerald-400">Seat Confirmed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Digital Ticket & Cancel Action */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center hover:border-emerald-500/20 transition-colors">
                
                <h3 className="text-xl font-bold text-white mb-6">Digital Entry Pass</h3>
                
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mb-6 shadow-inner inline-block">
                  <div className="w-48 h-48 bg-black rounded-lg flex flex-col items-center justify-center text-white p-4 relative overflow-hidden border border-zinc-800">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent" />
                    <QrCode className="w-32 h-32 text-emerald-400 mb-2 relative z-10" />
                    <span className="text-[10px] font-mono text-zinc-400 relative z-10 tracking-widest">SCAN AT GATEWAY</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 space-y-2 mb-2 text-left bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
                  <p className="flex justify-between">
                    <span>Attendee:</span> 
                    <strong className="text-white">{user?.name || 'Guest'}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Ticket ID:</span> 
                    <strong className="text-zinc-200 font-mono">#{selectedTicket.registration_id || selectedTicket.id || 'EVT-99'}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Status:</span> 
                    <strong className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> Valid</strong>
                  </p>
                </div>
              </div>

              {/* Cancel Registration Button */}
              <button 
                onClick={() => handleCancelRegistration(selectedTicket)}
                className="w-full py-4 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 font-bold text-sm border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-center justify-center gap-2 shadow-sm group"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                Cancel Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =======================================================================
  // MAIN LIST VIEW (Shows when no ticket is selected)
  // =======================================================================
  return (
    <div className="relative overflow-hidden min-h-screen text-zinc-100 pb-20 bg-[#010101]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-900/20 via-emerald-800/10 to-transparent rounded-b-[100%] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 shadow-sm">
          <Ticket className="w-3.5 h-3.5" />
          <span>Your Event Wallet</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          My Registered Tickets
        </h1>
        <p className="text-zinc-400 text-sm md:text-base mb-10 max-w-xl">
          Select a ticket below to view full event details, access your QR code, or manage your registration.
        </p>

        {loading ? (
          <div className="py-20 text-center text-zinc-500">Loading your tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center backdrop-blur-md shadow-lg max-w-2xl mx-auto">
            <Ticket className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No tickets found</h3>
            <p className="text-zinc-400 text-sm mb-6">You haven't registered for any campus events yet.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket, idx) => (
              <div 
                key={ticket.id || ticket.registration_id || idx}
                onClick={() => setSelectedTicket(ticket)} // Clicking ANYWHERE on the card opens it
                className="group relative bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 backdrop-blur-md flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
                      {ticket.event_code || ticket.event?.event_code || 'PASS'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {ticket.event_title || ticket.title || ticket.event?.title || 'Campus Event'}
                  </h3>
                  
                  <div className="space-y-2 mb-6 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{ticket.date || ticket.event?.date || 'Date to be announced'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{ticket.location || ticket.event?.location || 'Campus Venue'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div className="text-xs text-zinc-400">
                    Ticket ID: <span className="text-zinc-200 font-mono">#{ticket.id || ticket.registration_id || 'EVT-99'}</span>
                  </div>
                  <div className="text-emerald-400 group-hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors">
                    View Details & QR <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}