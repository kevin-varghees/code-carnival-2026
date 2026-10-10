import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import APIClient from '../api/client';
import { ArrowLeft, Calendar, MapPin, Users, Ticket, CheckCircle2, ShieldCheck, Loader2, Sparkles, QrCode } from 'lucide-react';

export default function EventDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    APIClient.get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        
        const localTickets = JSON.parse(localStorage.getItem('user_tickets') || '[]');
        if (localTickets.some(t => t.id === res.data.id || t.registration_id === res.data.id)) {
          setIsRegistered(true);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch event details", err);
        setError("Could not load event details. It may have been removed.");
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
      const localTickets = JSON.parse(localStorage.getItem('user_tickets') || '[]');
      localTickets.push({ ...event, registration_id: `REG-${Math.floor(Math.random() * 10000)}` });
      localStorage.setItem('user_tickets', JSON.stringify(localTickets));
      
      setIsRegistered(true);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500 font-medium">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-teal-400" /> Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-400 p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="mb-6">{error}</p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors border border-zinc-800">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-zinc-100 pb-24 bg-[#050505] overflow-hidden pt-24 px-4 md:px-6">
      
      {/* ========================================================= */}
      {/* DYNAMIC BOKEH / NETWORK BACKGROUND                        */}
      {/* ========================================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', 
            backgroundSize: '32px 32px' 
          }} 
        />
        
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] bg-teal-600/15 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[50%] right-[15%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '11s' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Back Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-teal-400 font-semibold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          All events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Event Info Card */}
          <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-700/50 rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-teal-500/30 transition-colors duration-500">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {event.event_code || 'EVENT PASS'}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                {event.title}
              </h1>
              
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-10 max-w-3xl">
                {event.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-teal-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-0.5">Date & Time</p>
                    <p className="text-sm font-bold text-white">{event.date || 'To be announced'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-sm font-bold text-white">{event.location || 'Tech Arena'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-0.5">Capacity</p>
                    <p className="text-sm font-bold text-white">{event.capacity || 120} seats</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/40 border border-zinc-700/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-2xl sticky top-24 hover:border-teal-500/20 transition-colors duration-500">
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Reserve your seat</h2>
                <p className="text-sm text-zinc-400">
                  You'll get a secure QR ticket in your digital wallet to scan at the entrance.
                </p>
              </div>

              {isRegistered ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-col items-center justify-center text-center py-6">
                    <ShieldCheck className="w-10 h-10 text-teal-400 mb-3" />
                    <h3 className="text-lg font-bold text-teal-400 mb-1">Registration Confirmed</h3>
                    <p className="text-xs text-teal-300/80">Your ticket is ready in your wallet.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/tickets')}
                    className="w-full py-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm border border-zinc-800 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-zinc-400" /> View My Ticket
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Securing Seat...
                    </>
                  ) : (
                    <>
                      Register for this event
                    </>
                  )}
                </button>
              )}

              <div className="mt-6 pt-6 border-t border-zinc-800/80 space-y-3">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Instant digital pass delivery</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Fast-track scanning at the door</span>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}