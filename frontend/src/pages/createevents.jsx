import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Calendar, MapPin, Users, Type, AlignLeft, LayoutGrid, Loader2, Rocket } from 'lucide-react';
import APIClient from '../api/client';

export default function CreateEvent({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    domain: 'Technical',
    event_code: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call for creation
      // const res = await APIClient.post('/events', form);
      
      // Navigate back to the dashboard after successful creation
      setTimeout(() => {
        navigate('/organizer');
      }, 1000);
    } catch (err) {
      setError('Failed to create the event. Please check your network and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-6 overflow-hidden">
      {/* Deep Green Radial Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#010604]" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#063322] via-[#01140e] to-transparent opacity-80" />

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link 
            to="/organizer" 
            className="inline-flex items-center gap-2 text-emerald-500/80 hover:text-emerald-400 font-semibold text-sm mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-950/50 border border-emerald-800/50 backdrop-blur-xl text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Host a New Event</h1>
          </div>
          <p className="text-emerald-500/70 text-sm ml-16">Launch your campus gathering and start accepting instant QR registrations.</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#062c1e]/40 border border-[#0d4a35]/50 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Code Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider pl-1">Event Title</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/60 pointer-events-none" />
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner"
                    placeholder="e.g., Annual Tech Hackathon 2026"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider pl-1">Short Code</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/60 pointer-events-none" />
                  <input
                    type="text"
                    name="event_code"
                    required
                    className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner uppercase"
                    placeholder="HACK26"
                    maxLength={10}
                    value={form.event_code}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider pl-1">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-emerald-600/60 pointer-events-none" />
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner resize-none"
                  placeholder="Tell attendees what to expect, speakers, schedule, and prerequisites..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 3-Column Grid for Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider pl-1">Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/60 pointer-events-none" />
                  <input
                    type="datetime-local"
                    name="date"
                    required
                    className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner [color-scheme:dark]"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider pl-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/60 pointer-events-none" />
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner"
                    placeholder="Seminar Hall 1"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider pl-1">Capacity</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/60 pointer-events-none" />
                  <input
                    type="number"
                    name="capacity"
                    required
                    min={1}
                    className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner"
                    placeholder="e.g., 150"
                    value={form.capacity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2 pb-4">
              <label className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider pl-1">Event Category</label>
              <div className="relative">
                <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/60 pointer-events-none" />
                <select
                  name="domain"
                  required
                  className="w-full bg-[#02120c]/60 border border-[#0d4a35]/60 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/60 focus:bg-[#02120c]/80 transition-all shadow-inner appearance-none cursor-pointer"
                  value={form.domain}
                  onChange={handleChange}
                >
                  <option value="Technical">Tech & AI</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="Pitch">Startup Pitch</option>
                  <option value="Cultural">Cultural & DJ</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
              {loading ? 'Initializing Event...' : 'Launch Event to Campus'}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}