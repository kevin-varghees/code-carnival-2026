import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import APIClient from '../api/client';
import EventCard from '../components/EventCard';
import { Sparkles, PlusCircle, Compass, Search, Code2, Cpu, Palette, Rocket, Music, Terminal, ArrowRight, Zap, Users, QrCode, ShieldCheck, Flame, Layers, Github, Linkedin, Mail } from 'lucide-react';

// =========================================================================
// CUSTOM SCROLL REVEAL COMPONENT 
// =========================================================================
const ScrollReveal = ({ children, direction = 'up', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-100px)';
      case 'right': return 'translateX(100px)';
      case 'up': return 'translateY(80px)';     
      case 'down': return 'translateY(-80px)';  
      default: return 'translateY(80px)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : getTransform(),
        transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`
      }}
      className="will-change-transform"
    >
      {children}
    </div>
  );
};
// =========================================================================

export default function Explore({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    APIClient.get('/events')
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events", err);
        setLoading(false);
      });

    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateEventClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/create-event' } });
    } else {
      navigate('/create-event');
    }
  };

  const domainCards = [
    { name: 'All', label: 'All Events', icon: Compass, color: 'from-emerald-600 to-teal-600' },
    { name: 'Hackathon', label: 'Hackathons', icon: Code2, color: 'from-emerald-700 to-emerald-900' },
    { name: 'Workshop', label: 'Workshops', icon: Terminal, color: 'from-teal-600 to-cyan-700' },
    { name: 'Technical', label: 'Tech & AI', icon: Cpu, color: 'from-emerald-600 to-green-700' },
    { name: 'Design', label: 'UI/UX Design', icon: Palette, color: 'from-teal-700 to-emerald-800' },
    { name: 'Pitch', label: 'Startup Pitch', icon: Rocket, color: 'from-green-600 to-teal-800' },
    { name: 'Cultural', label: 'Cultural & DJ', icon: Music, color: 'from-emerald-800 to-slate-900' },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.event_code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    
    return matchesSearch && (
      event.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      event.description.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  });

  const isFiltering = searchQuery.trim() !== '' || selectedCategory !== 'All';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchFocused(false);
  };

  return (
    <div className="relative min-h-screen text-zinc-100 bg-[#010101] overflow-hidden">
      
      {/* Visual Animation Styling */}
      <style>
        {`
          @keyframes shooting {
            0% { transform: rotate(45deg) translateX(0); opacity: 1; }
            20% { transform: rotate(45deg) translateX(1200px); opacity: 0; }
            100% { transform: rotate(45deg) translateX(1200px); opacity: 0; }
          }
          .meteor {
            position: absolute;
            height: 2px;
            background: linear-gradient(to right, transparent, rgba(16, 185, 129, 0.8) 60%, #fff 100%);
            border-radius: 999px;
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 1));
            animation: shooting 6s infinite linear;
            z-index: 0;
          }
          .meteor::after {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 15px 4px rgba(16, 185, 129, 0.9);
          }
          
          /* Smooth Gemini-style Flowing Gradient */
          @keyframes geminiGlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .text-gemini-glow {
            background: linear-gradient(
              to right,
              #10b981, /* Emerald */
              #06b6d4, /* Cyan */
              #3b82f6, /* Gemini Blue */
              #39ff14, /* Neon Green */
              #10b981  /* Back to Emerald for smooth loop */
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: geminiGlow 4s linear infinite;
            filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.3));
          }
        `}
      </style>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#010101]" /> 
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="star-pattern" width="150" height="150" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="30" r="1" fill="#ffffff" opacity="0.6"/>
              <circle cx="90" cy="50" r="1.5" fill="#10b981" opacity="0.4"/>
              <circle cx="50" cy="110" r="1" fill="#ffffff" opacity="0.3"/>
              <circle cx="120" cy="120" r="0.8" fill="#ffffff" opacity="0.8"/>
              <circle cx="130" cy="20" r="2" fill="#06b6d4" opacity="0.15"/>
              <circle cx="70" cy="140" r="1.2" fill="#ffffff" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#star-pattern)" />
        </svg>

        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-800/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-teal-900/20 rounded-full blur-[150px]" />

        <div className="meteor w-32 top-[10%] left-[20%]" style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="meteor w-48 top-[5%] left-[50%]" style={{ animationDelay: '1.2s', animationDuration: '4.5s' }} />
        <div className="meteor w-24 top-[30%] left-[10%]" style={{ animationDelay: '2.8s', animationDuration: '7s' }} />
      </div>

      {/* Hero Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 text-center animate-in fade-in zoom-in-95 duration-1000">
        
        {/* NEW: Increased the size of the Welcome Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-emerald-400 text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>{user ? `Welcome back, ${user.name}` : 'Welcome to EventEase'}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-md">
          Find a campus event. Register. <br />
          {/* Gemini Style Glowing Gradient Text */}
          <span className="inline-block mt-2 text-gemini-glow pb-2">
            Walk in with a scan.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-base text-zinc-400 mb-8 leading-relaxed">
          EventEase gives every registration a QR ticket and lets organizers check people in at the door in seconds.
        </p>

        <div className="flex justify-center items-center gap-4 mb-10 flex-wrap">
          <a href="#events-feed" className="px-6 py-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/80 backdrop-blur-lg border border-zinc-800 text-white font-medium text-sm shadow-lg flex items-center gap-2 transition-all">
            <Compass className="w-4 h-4 text-emerald-400" /> Explore Events (Public)
          </a>
          <button onClick={handleCreateEventClick} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 backdrop-blur-md text-white font-medium text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all hover:scale-105">
            <PlusCircle className="w-4 h-4" /> Create Event
          </button>
        </div>

        {/* Stats Bar */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 bg-zinc-950/40 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="flex flex-col items-center justify-center border-r border-zinc-800 relative z-10">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <Zap className="w-5 h-5" />
                <span>{events.length}+</span>
              </div>
              <span className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Active Events</span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-zinc-800 relative z-10">
              <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                <Users className="w-5 h-5" />
                <span>500+</span>
              </div>
              <span className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Registrations</span>
            </div>
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <QrCode className="w-5 h-5" />
                <span>100%</span>
              </div>
              <span className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Instant Check-in</span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Search Bar Container */}
      <div className="relative z-[100] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <ScrollReveal direction="down">
          <div ref={searchContainerRef} className="relative max-w-4xl mx-auto w-full">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-5 w-5 h-5 text-emerald-500 pointer-events-none z-20" />
              <input
                type="text"
                placeholder="What awesome adventure are we looking for today? ✨"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-2xl py-4 pl-14 pr-32 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900/80 backdrop-blur-xl transition-all shadow-2xl relative z-10"
              />
              <button type="submit" className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 z-20">
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-zinc-950/90 border border-zinc-800 p-5 rounded-2xl shadow-2xl backdrop-blur-3xl z-50 text-left">
                <p className="text-xs font-semibold text-zinc-500 mb-3 tracking-wider uppercase">Suggested Domains</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {domainCards.map((domain) => {
                    const IconComponent = domain.icon;
                    const isSelected = selectedCategory === domain.name;
                    return (
                      <button
                        key={domain.name}
                        type="button"
                        onClick={() => { setSelectedCategory(domain.name); setIsSearchFocused(false); }}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 text-left hover:scale-[1.03] ${
                          isSelected
                            ? 'bg-gradient-to-br ' + domain.color + ' border-transparent shadow-[0_0_15px_rgba(16,185,129,0.2)] text-white scale-[1.03]'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                        <span className="text-xs font-medium truncate">{domain.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Events Feed Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col gap-12">
        <div className="w-full flex flex-col gap-6">
          <ScrollReveal direction="right">
            <div id="events-feed" className="text-left pt-2">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                {!isFiltering ? 'Explore Upcoming Events' : `Results (${filteredEvents.length})`}
              </h2>
              <p className="text-sm text-zinc-400">
                {!isFiltering ? 'Glide through active campus events and check their details.' : 'Filtered campus events matching your criteria.'}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="mb-8">
              {loading ? (
                <div className="py-20 text-center text-zinc-500">Loading events...</div>
              ) : filteredEvents.length === 0 ? (
                <div className="bg-zinc-950/40 border border-zinc-800/50 backdrop-blur-xl rounded-3xl p-12 text-zinc-500 text-center shadow-lg">
                  No events found matching your search. Try adjusting your keyword or domain filter!
                </div>
              ) : !isFiltering ? (
                <div className="relative w-full overflow-hidden py-4 -mx-6 px-6">
                  <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#010101] to-transparent z-20 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#010101] to-transparent z-20 pointer-events-none" />

                  <div className="flex w-max animate-marquee gap-6 items-center" style={{ animationPlayState: isPaused ? 'paused' : 'running' }}>
                    {[...events, ...events].map((event, idx) => (
                      <div 
                        key={`${event.id}-${idx}`} 
                        className="w-[380px] shrink-0 text-left transition-transform duration-300 hover:scale-105 hover:z-30"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                      >
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="transition-transform duration-300 hover:scale-105">
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="pt-16 border-t border-zinc-800/80 text-left">
          
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <Flame className="w-3.5 h-3.5" /> Built for Modern Campuses
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-md">
                Everything you need to host & attend
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Designed from the ground up to eliminate long lines, lost paper tickets, and messy spreadsheets.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="left" delay={0.1}>
              <div className="bg-zinc-950/60 border border-zinc-800/80 hover:border-emerald-500/40 rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-2 group h-full">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Instant QR Passports</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Every registration instantly generates a unique scannable ticket stored securely in your digital wallet. Walk right through the gateway.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="bg-zinc-950/60 border border-zinc-800/80 hover:border-teal-500/40 rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] hover:-translate-y-2 group h-full">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">Smart Domain Filtering</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Filter instantly across Hackathons, UI/UX workshops, AI technical talks, and cultural night performances with one click.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.5}>
              <div className="bg-zinc-950/60 border border-zinc-800/80 hover:border-cyan-500/40 rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:-translate-y-2 group h-full">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Organizer Command Center</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Host events in seconds, track real-time attendance numbers, and verify ticket validity at the door using our built-in simulator.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Footer */}
      <ScrollReveal direction="up" delay={0.2}>
        <footer className="relative z-10 border-t border-zinc-800/80 bg-zinc-950/30 pt-16 pb-8 mt-24 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                  <span className="text-xl font-bold text-white tracking-tight">EventEase</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                  The ultimate campus event management platform. Seamlessly discover, register, and check-in to college fests, hackathons, and workshops with secure digital QR passes.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li><a href="#events-feed" className="hover:text-emerald-400 transition-colors">Explore Events</a></li>
                  <li><button onClick={handleCreateEventClick} className="hover:text-emerald-400 transition-colors">Host an Event</button></li>
                  <li><button onClick={() => navigate('/tickets')} className="hover:text-emerald-400 transition-colors">My Tickets</button></li>
                  <li><button onClick={() => navigate('/profile')} className="hover:text-emerald-400 transition-colors">Account Settings</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
                <div className="flex gap-4 mb-4">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all shadow-sm">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all shadow-sm">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                <a href="mailto:support@eventease.com" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> support@eventease.com
                </a>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
              <p>© 2026 EventEase. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </ScrollReveal>

    </div>
  );
}