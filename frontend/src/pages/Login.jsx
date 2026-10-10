import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import APIClient from '../api/client';
import { Mail, Lock, LogIn, ArrowRight, Sparkles, QrCode, Award, Ticket, Shirt, PartyPopper, Music, Zap } from 'lucide-react';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [doodleSeed, setDoodleSeed] = useState('Felix');
  const [burstItems, setBurstItems] = useState([]);

  // Array of random funny greetings
  const funnyGreetings = [
    "Oh good, the VIP is here. Let's go.",
    "Ready to skip class for a hackathon?",
    "Look who decided to show up! 🍕",
    "Back for more free campus pizza, I see.",
    "We were just talking about you...",
    "Your digital wallet missed you.",
    "Let's get you in before the tickets sell out.",
    "Sleep is temporary. Hackathons are forever."
  ];

  // Seeds for the DiceBear 9.x API to generate different human expressions
  const doodleSeeds = ["Felix", "Aneka", "Jocelyn", "Adrian", "Lilith", "Brian", "Sam", "Jack"];
  const icons = [QrCode, Award, Ticket, Shirt, PartyPopper, Music, Zap];

  useEffect(() => {
    // Pick a random greeting and expression on load
    setGreeting(funnyGreetings[Math.floor(Math.random() * funnyGreetings.length)]);
    setDoodleSeed(doodleSeeds[Math.floor(Math.random() * doodleSeeds.length)]);

    // Generate 40 random items for the "Mind Burst" continuous animation
    const items = Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2; // Random direction in a full circle
      const distance = 40 + Math.random() * 60; // Travel distance between 40vw and 100vw
      const tx = `${Math.cos(angle) * distance}vw`;
      const ty = `${Math.sin(angle) * distance}vh`;
      const rot = `${Math.random() * 720 - 360}deg`; // Random spin
      const duration = 5 + Math.random() * 7; // Animation speed (5s to 12s)
      const delay = Math.random() * -10; // Negative delay so they are already flying on page load
      const size = 20 + Math.random() * 30; // Random icon size
      const Icon = icons[Math.floor(Math.random() * icons.length)];
      
      return { id: i, tx, ty, rot, duration, delay, size, Icon };
    });
    setBurstItems(items);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await APIClient.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('API Endpoint Not Found (404). Check your Flask/FastAPI routes.');
      } else {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-500/30 pt-20">
      
      {/* Custom CSS for the Radial "Mind Burst" Animation */}
      <style>
        {`
          @keyframes floatBot {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: floatBot 3.5s ease-in-out infinite;
          }
          
          @keyframes burstOut {
            0% {
              transform: translate(-50%, -50%) scale(0.1);
              opacity: 0;
            }
            10% {
              opacity: 0.3; /* Appears smoothly out of the head */
            }
            80% {
              opacity: 0.15;
            }
            100% {
              transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.5) rotate(var(--rot));
              opacity: 0; /* Fades out at the edges of the screen */
            }
          }
          .burst-item {
            position: absolute;
            top: 25%; /* Anchored near the character's head */
            left: 50%;
            color: rgba(16, 185, 129, 0.5); /* Emerald color */
            animation: burstOut linear infinite;
            pointer-events: none;
            z-index: 0;
          }
        `}
      </style>

      {/* ========================================= */}
      {/* CONTINUOUS RADIAL "MIND BURST" BACKGROUND */}
      {/* ========================================= */}
      {burstItems.map((item) => {
        const IconComponent = item.Icon;
        return (
          <div
            key={item.id}
            className="burst-item"
            style={{
              '--tx': item.tx,
              '--ty': item.ty,
              '--rot': item.rot,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <IconComponent style={{ width: item.size, height: item.size }} />
          </div>
        );
      })}

      {/* Ambient Dark Green Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-950/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.02] pointer-events-none z-0" />

      {/* ========================================= */}
      {/* HUMAN DOODLE & FUNNY GREETING SECTION     */}
      {/* ========================================= */}
      <div className="text-center mb-8 relative z-10 flex flex-col items-center">
        
        {/* Floating Human Character */}
        <div 
          className="relative animate-float mb-4 group cursor-pointer" 
          onClick={() => setDoodleSeed(doodleSeeds[Math.floor(Math.random() * doodleSeeds.length)])}
          title="Click to change my face!"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-900/40 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all overflow-hidden bg-zinc-950">
            {/* Using the stable DiceBear 9.x API for beautiful, expressive avatars */}
            <img 
              src={`https://api.dicebear.com/9.x/micah/svg?seed=${doodleSeed}&backgroundColor=transparent&baseColor=f9c9b6`} 
              alt="Campus Guide" 
              className="w-full h-full object-contain scale-[1.15] translate-y-2"
            />
          </div>
          {/* Animated Sparkles around the character */}
          <Sparkles className="absolute -top-1 -right-3 w-5 h-5 text-emerald-300 animate-pulse" />
          <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-teal-400 animate-pulse delay-150" />
        </div>

        {/* Speech Bubble */}
        <div className="relative animate-in zoom-in-95 duration-500 delay-200">
          <div className="px-5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl backdrop-blur-md shadow-xl text-emerald-300 text-sm font-semibold tracking-wide text-center max-w-[280px]">
            "{greeting}"
          </div>
          {/* Speech Bubble Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900/90 border-t border-l border-zinc-800 rotate-45 -z-10" />
        </div>

      </div>

      {/* Glassmorphic Login Card */}
      <div className="w-full max-w-md bg-[#0a0f0d]/80 backdrop-blur-2xl border border-emerald-900/30 rounded-[2rem] p-8 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        
        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative flex items-center focus-within:text-emerald-400 text-zinc-500 transition-colors">
              <Mail className="absolute left-4 w-4 h-4 pointer-events-none" />
              <input
                type="email"
                placeholder="name@university.edu"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#050505] border border-emerald-900/40 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Password</label>
            <div className="relative flex items-center focus-within:text-emerald-400 text-zinc-500 transition-colors">
              <Lock className="absolute left-4 w-4 h-4 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#050505] border border-emerald-900/40 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In to EventEase
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="mt-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <p className="text-sm text-zinc-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group">
            Create one <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </p>
      </div>

    </div>
  );
}