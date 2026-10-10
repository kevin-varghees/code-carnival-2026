import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import APIClient from './api/client';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EventDetails from './pages/EventDetails';
import OrganizerDashboard from './pages/OrganizerDashboard';
import MyTickets from './pages/MyTickets';
import Profile from './pages/Profilepage';
import CreateEvent from './pages/createevents'; 
import Friends from './pages/Friends'; 
import PeerProfile from './pages/Peerprofilee';
import { Sparkles } from 'lucide-react';

// =========================================================================
// SNEAKY GLOBAL INTERACTIVE HYPE WIDGET
// =========================================================================
function HypeManWidget() {
  const location = useLocation();
  const [hypeQuote, setHypeQuote] = useState('');
  const [doodleSeed, setDoodleSeed] = useState('Felix');
  const [showHypeBubble, setShowHypeBubble] = useState(false);
  const [isHiding, setIsHiding] = useState(true);

  const doodleSeeds = ["Felix", "Aneka", "Jocelyn", "Adrian", "Lilith", "Brian", "Sam", "Jack", "Leo", "Tigger", "Oliver"];

  // Completely unhinged & funny Gen-Z quotes mapped to specific pages
  const pageQuotes = {
    '/': [
      "Bruh, these events are literally built different. 💀",
      "Stop scrolling and touch some digital grass. 🌱",
      "No cap, this landing page is serving. 💅",
      "Are we cooking or what? 🔥"
    ],
    '/tickets': [
      "Gatekeeping these tickets? Nah, we flexing. 🎟️",
      "If I catch you screenshotting this QR code... 🤺",
      "VIP energy only. Peasants to the left. 💅",
      "Checking your digital passport? Valid. ✅"
    ],
    '/profile': [
      "Okay face card! No declines here. 💳",
      "The aesthetic is giving 'hired on the spot'. 📈",
      "Main character syndrome activated. ✨",
      "Looking absolute fire today, bestie."
    ],
    '/create-event': [
      "Let him cook! We are hosting a banger today. 🍳",
      "Spilling the tea: your event is gonna be packed. ☕",
      "Event planner era? I'm here for it. 💅",
      "Building a whole crowd is W behavior."
    ],
    '/friends': [
      "POV: you actually have friends. Couldn't be me. 💀",
      "Squad looking too clean. W rizz. 🤝",
      "Assembling the Avengers rn? 🦸‍♂️"
    ],
    '/organizer': [
      "Command center looking healthy. Big boss moves. 📈",
      "Micromanaging era? Valid. ✅",
      "Stonks. 📉 Wait, no, STONKS 📈"
    ]
  };

  // 1. SILENT SNEAK ON ROUTE CHANGE
  useEffect(() => {
    // Hide quietly without showing a message
    setIsHiding(true);
    setShowHypeBubble(false);
  }, [location.pathname]);

  // 2. AUTO POP-OUT AFTER 45 SECONDS
  useEffect(() => {
    let timer;
    if (isHiding) {
      // If he is hiding, start a 45 second countdown to pop out
      timer = setTimeout(() => {
        triggerPopOut();
      }, 45000); 
    }
    return () => clearTimeout(timer); // Reset timer if clicked early or route changes
  }, [isHiding, location.pathname]);

  // 3. POP-OUT LOGIC
  const triggerPopOut = () => {
    setIsHiding(false);
    const quotes = pageQuotes[location.pathname] || pageQuotes['/'];
    setHypeQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setDoodleSeed(doodleSeeds[Math.floor(Math.random() * doodleSeeds.length)]);
    setShowHypeBubble(true);
  };

  // Skip rendering on auth pages safely
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div 
      className={`fixed top-[20%] transform -translate-y-1/2 z-50 hidden lg:flex flex-col items-start transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isHiding 
          ? '-left-12 opacity-60 hover:-left-6 hover:opacity-100 cursor-pointer' 
          : 'left-6 md:left-12' 
      }`}
      onClick={isHiding ? triggerPopOut : undefined}
    >
      {/* Speech Bubble (Only renders when NOT sneaking!) */}
      {showHypeBubble && !isHiding && (
        <div className="relative mb-3 max-w-[190px] animate-in slide-in-from-left-4 fade-in duration-500">
          <div className="px-4 py-3 bg-[#0a0f0d]/95 backdrop-blur-2xl border border-emerald-500/45 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] text-left relative z-10">
            <Sparkles className="absolute top-1.5 right-1.5 w-3 h-3 text-emerald-400 opacity-60 pointer-events-none" />
            <p className="text-emerald-300 text-xs font-bold leading-relaxed pr-2 tracking-wide select-none">
              "{hypeQuote}"
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowHypeBubble(false);
                setIsHiding(true); // Click X to send him back to the shadows
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-[10px] text-zinc-400 hover:text-white hover:bg-red-500/20 transition-colors"
              aria-label="Send guide to hiding"
            >
              ×
            </button>
          </div>
          <div className="absolute -bottom-1.5 left-7 w-3 h-3 bg-[#0a0f0d]/95 border-b border-r border-emerald-500/30 rotate-45 z-0" />
        </div>
      )}
      
      {/* Character Doodle */}
      <div 
        className="relative flex flex-col items-center ml-2"
        onClick={!isHiding ? triggerPopOut : undefined} // Tapping while popped out generates a new joke
      >
        <div 
          className={`w-18 h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-zinc-950 via-emerald-950/25 to-[#050505] border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden select-none bg-[#010101] ${
            isHiding 
              ? 'scale-75 rotate-[12deg] grayscale-[40%] hover:scale-85 hover:grayscale-0' 
              : 'hover:scale-110 active:scale-95 animate-hype pulse-border' 
          }`}
          title={isHiding ? "Psst... I am still here! (Click me)" : "Wanna vibe check? ✨"}
        >
          <img 
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${doodleSeed}&backgroundColor=transparent`} 
            alt="Companion Doodle" 
            className="w-full h-full object-contain scale-[1.25] translate-y-1.5 pointer-events-none transition-transform duration-200"
          />
        </div>
        
        {/* Glow indicator only visible when actively popped out */}
        {!isHiding && (
          <>
            <span className="absolute top-0 right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] text-emerald-400/70 font-bold uppercase tracking-wider mt-1.5 animate-pulse bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/10 backdrop-blur-sm shadow-inner cursor-default">
              Vibe Guide
            </span>
          </>
        )}
      </div>
    </div>
  );
}
// =========================================================================

// =========================================================================
// PREMIUM PAGE TRANSITION WRAPPER
// =========================================================================
function AnimatedRoutes({ user, setUser, handleLogout }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="premium-page-transition w-full h-full">
      <Routes location={location}>
        <Route path="/" element={<Explore user={user} />} />
        
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup setUser={setUser} />} />
        <Route path="/events/:id" element={<EventDetails user={user} />} />
        <Route path="/tickets" element={user ? <MyTickets /> : <Navigate to="/login" state={{ from: '/tickets' }} />} />
        <Route path="/create-event" element={user ? <CreateEvent user={user} /> : <Navigate to="/login" state={{ from: '/create-event' }} />} />
        <Route path="/friends" element={user ? <Friends user={user} /> : <Navigate to="/login" state={{ from: '/friends' }} />} />
        <Route path="/profile/:id" element={user ? <PeerProfile /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} onLogout={handleLogout} /> : <Navigate to="/login" state={{ from: '/profile' }} />} />
        <Route path="/organizer" element={user ? <OrganizerDashboard /> : <Navigate to="/login" state={{ from: '/organizer' }} />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
// =========================================================================

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      APIClient.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div className="min-h-screen bg-[#010101] flex items-center justify-center text-zinc-500 font-medium">Loading EventEase...</div>;

  return (
    <BrowserRouter>
      <style>
        {`
          @keyframes dramaticEnter {
            0% { 
              opacity: 0; 
              transform: translateY(40px) scale(0.96); 
              filter: blur(10px);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
              filter: blur(0);
            }
          }
          .premium-page-transition {
            animation: dramaticEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            will-change: opacity, transform, filter;
          }

          @keyframes energeticBob {
            0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
            25% { transform: translateY(-8px) scale(1.04) rotate(1deg); }
            50% { transform: translateY(0) scale(1.02) rotate(-1deg); }
            75% { transform: translateY(-4px) scale(1.05) rotate(1.5deg); }
          }
          .animate-hype {
            animation: energeticBob 4.2s ease-in-out infinite;
          }
          @keyframes pulseGuide {
            0%, 100% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.25), inset 0 0 10px rgba(16, 185, 129, 0.05); }
            50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.65), inset 0 0 20px rgba(16, 185, 129, 0.25); }
          }
          .pulse-border {
            animation: pulseGuide 2.5s infinite alternate;
          }
        `}
      </style>

      <div className="min-h-screen bg-[#010101] text-zinc-100 selection:bg-[#39ff14]/30 selection:text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-emerald-950/40 via-emerald-900/10 to-transparent rounded-b-[100%] blur-3xl pointer-events-none" />

        <Navbar user={user} onLogout={handleLogout} />
        
        <HypeManWidget />

        <AnimatedRoutes user={user} setUser={setUser} handleLogout={handleLogout} />
      </div>
    </BrowserRouter>
  );
}