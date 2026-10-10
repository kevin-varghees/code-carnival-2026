import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function HypeManWidget() {
  const location = useLocation();
  const [hypeQuote, setHypeQuote] = useState('');
  const [doodleSeed, setDoodleSeed] = useState('Felix');
  const [showHypeBubble, setShowHypeBubble] = useState(false);
  const [isHiding, setIsHiding] = useState(true);

  // 1. DO NOT render on Login or Signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const doodleSeeds = ["Felix", "Aneka", "Jocelyn", "Adrian", "Lilith", "Brian", "Sam", "Jack", "Leo"];

  // 2. PAGE-SPECIFIC MOTIVATIONAL QUOTES
  const pageQuotes = {
    '/': [
      "You're cooking rn, don't stop! 🔥",
      "Main character energy right here. 💅",
      "Touch grass? Nah, let's find an event. 🚀"
    ],
    '/tickets': [
      "VIP access only. We made it. 🎟️",
      "Guard that QR code with your life!",
      "Front row vibes or we don't go. 😤"
    ],
    '/profile': [
      "The glow up is real! ✨",
      "Checking the fit? Looking immaculate.",
      "W profile, W developer. 👑"
    ],
    '/create-event': [
      "Let him cook! We're hosting today. 🍳",
      "CEO mindset activated. 💼",
      "Make it lit, no boring lectures allowed."
    ],
    '/organizer': [
      "Command center looking healthy today. 📊",
      "Big boss moves. Check them in! ✅"
    ]
  };

  // 3. TRIGGER SNEAK ATTACK ON ROUTE CHANGE
  useEffect(() => {
    // Get the page name from the URL for dynamic jokes
    const pageName = location.pathname === '/' ? 'home' : location.pathname.split('/')[1];
    
    const sneakQuotes = [
      `Sneaking into ${pageName} like a ninja... 🥷`,
      `Don't mind me, just stealing some ${pageName} data... 🏃‍♂️💨`,
      `Checking the ${pageName} vibes... 👀`,
      "Target acquired. Moving in quietly. 🕵️‍♂️"
    ];

    // Force him to hide at the edge and pop a sneaky joke
    setIsHiding(true);
    setDoodleSeed(doodleSeeds[Math.floor(Math.random() * doodleSeeds.length)]);
    setHypeQuote(sneakQuotes[Math.floor(Math.random() * sneakQuotes.length)]);
    setShowHypeBubble(true);
    
    // Auto-hide the bubble after 4 seconds of sneaking
    const timer = setTimeout(() => setShowHypeBubble(false), 4000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 4. HANDLE TAP FOR MOTIVATION
  const handleTap = () => {
    if (isHiding) {
      setIsHiding(false); // Pop out from the edge!
    }
    
    // Grab quotes for the specific page, or default to home quotes
    const quotes = pageQuotes[location.pathname] || pageQuotes['/'];
    setHypeQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setDoodleSeed(doodleSeeds[Math.floor(Math.random() * doodleSeeds.length)]);
    setShowHypeBubble(true);
  };

  return (
    <div 
      className={`fixed top-[25%] transform -translate-y-1/2 z-50 hidden lg:flex flex-col items-start transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isHiding 
          ? '-left-12 md:-left-12 opacity-60 hover:-left-6 hover:opacity-100' // Peeking from the edge
          : 'left-6 md:left-12' // Full view
      }`}
    >
      {showHypeBubble && (
        <div className="relative mb-3.5 max-w-[190px] animate-in slide-in-from-left-4 fade-in duration-500">
          <div className="px-4 py-3 bg-[#0a0f0d]/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] text-left relative z-10">
            <Sparkles className="absolute top-1.5 right-1.5 w-3 h-3 text-emerald-400 opacity-60" />
            <p className="text-emerald-300 text-xs font-bold leading-relaxed pl-1 tracking-wide">
              "{hypeQuote}"
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowHypeBubble(false);
                setIsHiding(true); // Retreat back to the edge
              }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-[10px] text-zinc-400 hover:text-white hover:bg-red-500/20 transition-colors"
            >
              ×
            </button>
          </div>
          <div className="absolute -bottom-1.5 left-8 w-3.5 h-3.5 bg-[#0a0f0d]/95 border-b border-r border-emerald-500/30 rotate-45 z-0" />
        </div>
      )}
      
      <div className="relative flex flex-col items-center ml-2">
        <div 
          className={`w-18 h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-zinc-950 via-emerald-950/20 to-[#050505] border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden select-none bg-[#010101] ${
            isHiding 
              ? 'scale-75 rotate-[15deg] grayscale-[40%] hover:scale-90 hover:rotate-12' 
              : 'hover:scale-110 active:scale-95 animate-hype pulse-border' 
          }`}
          onClick={handleTap}
          title={isHiding ? "Psst... I'm still here!" : "Click me for a vibe check! ✨"}
        >
          <img 
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${doodleSeed}&backgroundColor=transparent`} 
            alt="Live Hype Man" 
            className="w-full h-full object-contain scale-[1.2] translate-y-1 pointer-events-none transition-transform duration-200"
          />
        </div>
        
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