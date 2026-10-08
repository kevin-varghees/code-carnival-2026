import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, Linkedin, Github, Image as ImageIcon, Save, 
  CheckCircle2, LogOut, ShieldCheck, Mic, Ticket, Users, MonitorPlay 
} from 'lucide-react';
import api, { errMsg } from '../api/client';

export default function Profile({ user, setUser, onLogout }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    avatar_url: user?.avatar_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Mock stats (You can replace these with real API data later)
  const [stats, setStats] = useState({ hosted: 12, attended: 45 });
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to calculate attended events from local storage if available
    const localTickets = JSON.parse(localStorage.getItem('user_tickets') || '[]');
    if (localTickets.length > 0) {
      setStats(prev => ({ ...prev, attended: localTickets.length }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      const { data } = await api.put('/auth/me', form);
      setUser(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(errMsg(err, 'Could not update profile.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 md:px-6 overflow-hidden bg-[#050505]">
      
      {/* ========================================================= */}
      {/* 1. DYNAMIC BOKEH / NETWORK BACKGROUND                       */}
      {/* ========================================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle Grid Base */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', 
            backgroundSize: '32px 32px' 
          }} 
        />
        
        {/* Glowing Ambient Orbs */}
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-teal-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[130px]" />
        
        {/* Simulated "Bokeh" particles */}
        <div className="absolute top-[25%] left-[25%] w-4 h-4 bg-teal-400/40 rounded-full blur-[2px]" />
        <div className="absolute top-[65%] left-[15%] w-6 h-6 bg-indigo-400/30 rounded-full blur-[3px]" />
        <div className="absolute top-[35%] right-[25%] w-3 h-3 bg-emerald-400/50 rounded-full blur-[1px]" />
        <div className="absolute bottom-[25%] right-[35%] w-8 h-8 bg-purple-400/20 rounded-full blur-[4px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        
        {/* ========================================================= */}
        {/* 2. MAIN PROFILE GLASS CARD                                  */}
        {/* ========================================================= */}
        <div className="bg-zinc-900/40 border border-zinc-700/50 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Internal Card Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header: Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 relative z-10 text-center sm:text-left">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 p-1 shadow-lg shadow-teal-900/50">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden border-2 border-zinc-900">
                  {form.avatar_url ? (
                    <img src={form.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-white">{form.name?.[0]?.toUpperCase() || 'U'}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">{form.name || 'User'}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Member
                </span>
              </div>
              <p className="text-sm text-zinc-400">{user?.email || 'user@university.edu'}</p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. STATS GRID                                             */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 relative z-10">
            {/* Hosted Events Stat */}
            <div className="bg-gradient-to-br from-teal-900/40 to-emerald-950/40 border border-teal-500/20 rounded-2xl p-5 hover:border-teal-500/40 transition-colors group cursor-default shadow-inner">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500/70">
                  <MonitorPlay className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white group-hover:text-teal-400 transition-colors">{stats.hosted}</span>
                <span className="text-sm font-semibold text-zinc-300">Hosted Events</span>
              </div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Managed from management dashboard</p>
            </div>

            {/* Attended Events Stat */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors group cursor-default shadow-inner">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Ticket className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500/70">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">{stats.attended}</span>
                <span className="text-sm font-semibold text-zinc-300">Attended Events</span>
              </div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Previous and future events</p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. SETTINGS FORM                                          */}
          {/* ========================================================= */}
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-teal-500/40 bg-teal-500/10 p-4 text-teal-300 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-400" />
              <p className="text-sm font-medium">Profile updated successfully!</p>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-300 text-sm animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-zinc-950/60 border border-zinc-700/60 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/50 transition-all shadow-inner placeholder:text-zinc-600"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <ImageIcon className="h-3.5 w-3.5 text-emerald-500" /> Profile Picture URL
              </label>
              <input
                type="url"
                name="avatar_url"
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-zinc-950/60 border border-zinc-700/60 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/50 transition-all shadow-inner placeholder:text-zinc-600"
                value={form.avatar_url}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  <Linkedin className="h-3.5 w-3.5 text-blue-500" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-zinc-950/60 border border-zinc-700/60 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner placeholder:text-zinc-600"
                  value={form.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  <Github className="h-3.5 w-3.5 text-purple-400" /> GitHub URL
                </label>
                <input
                  type="url"
                  name="github"
                  placeholder="https://github.com/username"
                  className="w-full bg-zinc-950/60 border border-zinc-700/60 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner placeholder:text-zinc-600"
                  value={form.github}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" 
                disabled={saving}
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {!saving && <Save className="h-4 w-4" />} 
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-3.5 rounded-xl bg-zinc-950/50 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </form>

        </div>
        
        {/* Footer text below card */}
        <div className="text-center mt-6">
          <p className="text-xs text-zinc-600">EventEase © 2026</p>
        </div>
      </div>
    </div>
  );
}