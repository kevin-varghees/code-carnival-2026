import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIClient from '../api/client';
import { Calendar, MapPin, Users, Search, Filter, Loader2, Sparkles, ArrowRight } from 'lucide-react';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const domains = [
    'All', 
    'Web Development', 
    'AI & Machine Learning', 
    'UI/UX Design', 
    'Cloud & DevOps', 
    'Cybersecurity', 
    'Blockchain & Web3'
  ];

  useEffect(() => {
    APIClient.get('/api/events')
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events catalog", err);
        setLoading(false);
      });
  }, []);

  // Filter events based on search query and selected domain
  useEffect(() => {
    let result = events;

    if (selectedDomain !== 'All') {
      result = result.filter(event => 
        event.category?.toLowerCase() === selectedDomain.toLowerCase() ||
        event.title?.toLowerCase().includes(selectedDomain.toLowerCase()) ||
        event.description?.toLowerCase().includes(selectedDomain.toLowerCase())
      );
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title?.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q) ||
        event.location?.toLowerCase().includes(q)
      );
    }

    setFilteredEvents(result);
  }, [searchQuery, selectedDomain, events]);

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-emerald-950/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Campus Catalog
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Explore All Events
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Browse through active hackathons, workshops, and tech talks. Filter by domain to find what sparks your interest.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, keyword, or venue..."
              className="w-full bg-[#0a0f0d]/80 border border-emerald-900/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 shadow-inner backdrop-blur-xl"
            />
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5" /> Domains:
          </span>
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                selectedDomain === domain
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#0a0f0d]/60 text-zinc-400 border-emerald-900/30 hover:border-emerald-500/40 hover:text-white'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-[#0a0f0d]/80 border border-emerald-900/30 rounded-3xl p-16 text-center backdrop-blur-2xl">
            <p className="text-zinc-400 text-base mb-2">No events found matching your criteria.</p>
            <p className="text-xs text-zinc-600">Try selecting a different domain or clearing your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="bg-[#0a0f0d]/80 border border-emerald-900/30 hover:border-emerald-500/50 rounded-3xl p-6 backdrop-blur-2xl shadow-xl cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      {event.event_code}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {new Date(event.date_time).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-3 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" /> {event.location}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Users className="w-3.5 h-3.5 text-cyan-400" /> Max {event.capacity}
                    </span>
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                    View Details & Register <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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