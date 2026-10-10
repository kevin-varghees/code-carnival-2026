import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import APIClient from '../api/client';
import { Sparkles, Calendar, MapPin, Users, Clock, ShieldCheck, Layers } from 'lucide-react';

// ==========================================
// FLOATING PARTICLE BACKGROUND EFFECT
// ==========================================
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(20, 184, 166, 0.35)',
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#10b981';
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

export default function CreateEvent({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    event_code: '',
    description: '',
    location: '',
    capacity: '',
    category: 'Tech & AI',
    participation_type: 'solo',
    max_team_size: 4,
  });

  const [eventDate, setEventDate] = useState('');
  const [eventHour, setEventHour] = useState('6');
  const [eventMinute, setEventMinute] = useState('00');
  const [eventAmPm, setEventAmPm] = useState('PM');

  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineHour, setDeadlineHour] = useState('11');
  const [deadlineMinute, setDeadlineMinute] = useState('59');
  const [deadlineAmPm, setDeadlineAmPm] = useState('PM');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const applyEventPreset = (daysFromNow, hour24, minute) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour24, minute, 0, 0);

    const pad = (n) => String(n).padStart(2, '0');
    setEventDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);

    let h = hour24 % 12;
    if (h === 0) h = 12;
    setEventHour(String(h));
    setEventMinute(pad(minute));
    setEventAmPm(hour24 >= 12 ? 'PM' : 'AM');
  };

  const applyDeadlinePreset = (daysFromNow, hour24, minute) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour24, minute, 0, 0);

    const pad = (n) => String(n).padStart(2, '0');
    setDeadlineDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);

    let h = hour24 % 12;
    if (h === 0) h = 12;
    setDeadlineHour(String(h));
    setDeadlineMinute(pad(minute));
    setDeadlineAmPm(hour24 >= 12 ? 'PM' : 'AM');
  };

  const to24Hour = (hour, ampm) => {
    let h = parseInt(hour, 10);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!eventDate || !deadlineDate) {
      setError('Please provide valid dates for the event and registration deadline.');
      return;
    }

    const eventH24 = to24Hour(eventHour, eventAmPm);
    const date_time = `${eventDate}T${String(eventH24).padStart(2, '0')}:${eventMinute}:00`;

    const deadH24 = to24Hour(deadlineHour, deadlineAmPm);
    const registration_deadline = `${deadlineDate}T${String(deadH24).padStart(2, '0')}:${deadlineMinute}:00`;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        date_time,
        registration_deadline,
        capacity: parseInt(formData.capacity, 10),
        max_team_size: formData.participation_type === 'team' ? parseInt(formData.max_team_size, 10) : 1,
      };

      await APIClient.post('/api/events', payload);
      navigate('/organizer');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create event. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#010101] text-zinc-100 p-4 sm:p-6 md:p-10 relative overflow-hidden pt-10">
      <ParticleBackground />

      {/* Atmospheric Neon Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-emerald-950/40 via-teal-950/20 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3 backdrop-blur-md shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5" /> Organizer Control Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Launch New Campus Event</h1>
          <p className="text-zinc-400 text-sm mt-1">Set up schedules, team restrictions, and registration deadlines in a sleek workspace.</p>
        </div>

        {/* ULTRA-GLASSMORPHIC FLOATING CARD */}
        <div className="relative bg-[#02120c]/40 border border-emerald-500/25 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all duration-500 hover:border-emerald-500/40">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center backdrop-blur-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Annual Tech Hackathon 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-900/40 rounded-xl py-3.5 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 focus:bg-black/60 shadow-inner backdrop-blur-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Short Code</label>
                <input
                  type="text"
                  required
                  placeholder="HACK26"
                  value={formData.event_code}
                  onChange={(e) => setFormData({ ...formData, event_code: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-900/40 rounded-xl py-3.5 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 focus:bg-black/60 shadow-inner backdrop-blur-sm uppercase font-mono transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Description</label>
              <textarea
                rows={4}
                required
                placeholder="Tell attendees what to expect, speakers, schedule, and prerequisites..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-black/40 border border-emerald-900/40 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 focus:bg-black/60 shadow-inner backdrop-blur-sm resize-none transition-all"
              />
            </div>

            {/* EVENT DATE & TIME SELECTOR BOX */}
            <div className="space-y-3 bg-black/30 p-4 sm:p-5 rounded-2xl border border-emerald-900/30 backdrop-blur-md shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Event Date & Time
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => applyEventPreset(1, 10, 0)} className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-[10px] text-emerald-300 border border-emerald-800/60 transition-all shadow-sm">Tomorrow 10 AM</button>
                  <button type="button" onClick={() => applyEventPreset(3, 15, 0)} className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-[10px] text-emerald-300 border border-emerald-800/60 transition-all shadow-sm">In 3 Days</button>
                  <button type="button" onClick={() => applyEventPreset(7, 18, 0)} className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-[10px] text-emerald-300 border border-emerald-800/60 transition-all shadow-sm">Next Week</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-black/50 border border-emerald-900/40 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/60 shadow-inner backdrop-blur-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={eventHour}
                    onChange={(e) => setEventHour(e.target.value)}
                    className="w-full bg-black/50 border border-emerald-900/40 rounded-xl py-3 px-2 text-sm text-white focus:outline-none focus:border-emerald-500/60 text-center backdrop-blur-sm"
                  >
                    {['1','2','3','4','5','6','7','8','9','10','11','12'].map(h => <option key={h} value={h} className="bg-zinc-900 text-white">{h}</option>)}
                  </select>
                  <span className="text-zinc-500 font-bold">:</span>
                  <select
                    value={eventMinute}
                    onChange={(e) => setEventMinute(e.target.value)}
                    className="w-full bg-black/50 border border-emerald-900/40 rounded-xl py-3 px-2 text-sm text-white focus:outline-none focus:border-emerald-500/60 text-center backdrop-blur-sm"
                  >
                    {['00', '15', '30', '45'].map(m => <option key={m} value={m} className="bg-zinc-900 text-white">{m}</option>)}
                  </select>
                  <select
                    value={eventAmPm}
                    onChange={(e) => setEventAmPm(e.target.value)}
                    className="bg-black/50 border border-emerald-900/40 rounded-xl py-3 px-3 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500/60 text-center backdrop-blur-sm"
                  >
                    <option value="AM" className="bg-zinc-900 text-white">AM</option>
                    <option value="PM" className="bg-zinc-900 text-white">PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* REGISTRATION DEADLINE SELECTOR BOX */}
            <div className="space-y-3 bg-black/30 p-4 sm:p-5 rounded-2xl border border-emerald-900/30 backdrop-blur-md shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" /> Registration Deadline
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => applyDeadlinePreset(1, 23, 59)} className="px-2.5 py-1 rounded-lg bg-teal-950/80 hover:bg-teal-900 text-[10px] text-teal-300 border border-teal-800/60 transition-all shadow-sm">Tomorrow Night</button>
                  <button type="button" onClick={() => applyDeadlinePreset(2, 23, 59)} className="px-2.5 py-1 rounded-lg bg-teal-950/80 hover:bg-teal-900 text-[10px] text-teal-300 border border-teal-800/60 transition-all shadow-sm">In 2 Days</button>
                  <button type="button" onClick={() => applyDeadlinePreset(5, 23, 59)} className="px-2.5 py-1 rounded-lg bg-teal-950/80 hover:bg-teal-900 text-[10px] text-teal-300 border border-teal-800/60 transition-all shadow-sm">In 5 Days</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="date"
                    required
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full bg-black/50 border border-emerald-900/40 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/60 shadow-inner backdrop-blur-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={deadlineHour}
                    onChange={(e) => setDeadlineHour(e.target.value)}
                    className="w-full bg-black/50 border border-emerald-900/40 rounded-xl py-3 px-2 text-sm text-white focus:outline-none focus:border-emerald-500/60 text-center backdrop-blur-sm"
                  >
                    {['1','2','3','4','5','6','7','8','9','10','11','12'].map(h => <option key={h} value={h} className="bg-zinc-900 text-white">{h}</option>)}
                  </select>
                  <span className="text-zinc-500 font-bold">:</span>
                  <select
                    value={deadlineMinute}
                    onChange={(e) => setDeadlineMinute(e.target.value)}
                    className="w-full bg-black/50 border border-emerald-900/40 rounded-xl py-3 px-2 text-sm text-white focus:outline-none focus:border-emerald-500/60 text-center backdrop-blur-sm"
                  >
                    {['00', '15', '30', '45'].map(m => <option key={m} value={m} className="bg-zinc-900 text-white">{m}</option>)}
                  </select>
                  <select
                    value={deadlineAmPm}
                    onChange={(e) => setDeadlineAmPm(e.target.value)}
                    className="bg-black/50 border border-emerald-900/40 rounded-xl py-3 px-3 text-sm text-teal-400 font-bold focus:outline-none focus:border-emerald-500/60 text-center backdrop-blur-sm"
                  >
                    <option value="AM" className="bg-zinc-900 text-white">AM</option>
                    <option value="PM" className="bg-zinc-900 text-white">PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location / Venue
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Seminar Hall 1"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-900/40 rounded-xl py-3.5 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 shadow-inner backdrop-blur-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" /> Capacity (Max Seats)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g., 150"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-900/40 rounded-xl py-3.5 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 shadow-inner backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-emerald-900/40">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> Participation Mode
                </label>
                <select
                  value={formData.participation_type}
                  onChange={(e) => setFormData({ ...formData, participation_type: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-900/40 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/60 shadow-inner backdrop-blur-sm"
                >
                  <option value="solo" className="bg-zinc-900 text-white">Solo Event</option>
                  <option value="team" className="bg-zinc-900 text-white">Team Event</option>
                </select>
              </div>

              {formData.participation_type === 'team' && (
                <div className="space-y-1.5 animate-in fade-in duration-300">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-teal-400" /> Max Team Members
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    required
                    value={formData.max_team_size}
                    onChange={(e) => setFormData({ ...formData, max_team_size: e.target.value })}
                    className="w-full bg-black/40 border border-emerald-900/40 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/60 shadow-inner backdrop-blur-sm"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.01] disabled:opacity-70 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Launching Event...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Launch Event to Campus
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}