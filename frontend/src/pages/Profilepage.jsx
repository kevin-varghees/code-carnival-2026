import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Edit, Save, X, MapPin, Mail, Github, Linkedin, 
  Link as LinkIcon, LogOut, Calendar, Award, Briefcase, User, ArrowLeft
} from 'lucide-react';

export default function Profilepage({ user, setUser, onLogout }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for form editing. Safe fallbacks added to prevent crashes.
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Test User',
    email: user?.email || 'test@gmail.com',
    domain: 'Full-Stack Developer',
    location: 'Bengaluru, Karnataka',
    bio: 'Passionate software engineer building scalable web applications. Always eager to participate in hackathons, collaborate on open-source projects, and explore new technologies in the AI and Web3 space.',
    github: 'github.com/username',
    linkedin: 'linkedin.com/in/username',
    website: 'portfolio.dev'
  });

  const [stats] = useState({
    eventsAttended: 12,
    eventsHosted: 2,
    connections: 45
  });

  const handleSave = (e) => {
    e.preventDefault();
    // API call to update the user's profile would go here
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  // Ultra-safe avatar character generator so it never crashes
  const avatarLetter = profileData?.name ? String(profileData.name).charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 relative overflow-hidden selection:bg-emerald-500/30 pb-20">
      
      {/* ================= DYNAMIC ANIMATED BACKGROUND ================= */}
      <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-emerald-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />
      <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-teal-600/10 rounded-full blur-[140px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] pointer-events-none" />
      {/* =============================================================== */}

      {/* Expanded Width Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-6">
        
        {/* Premium Floating Back Button */}
        <div className="mb-2">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-emerald-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-wide">Back</span>
          </button>
        </div>

        {/* Main Profile Header Card */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl ring-1 ring-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden transition-all">
          
          {/* Cover Image Banner */}
          <div className="w-full h-48 sm:h-64 bg-gradient-to-r from-zinc-900 via-emerald-950/60 to-teal-950/40 relative overflow-hidden border-b border-white/5 group cursor-pointer">
             <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
             {isEditing && (
               <div className="absolute top-6 right-6 p-2.5 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-white/10 text-white flex items-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg">
                 <Camera className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Change Cover</span>
               </div>
             )}
          </div>

          <div className="px-6 sm:px-10 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              
              {/* Profile Avatar */}
              <div className="relative -mt-20 sm:-mt-24 z-10 group">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 p-1.5 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
                  <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center font-extrabold text-6xl text-emerald-400 relative overflow-hidden">
                    {avatarLetter}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 mb-1 text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Update</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit / Save Action Buttons */}
              <div className="mt-4 sm:mt-6 w-full sm:w-auto flex justify-end">
                {isEditing ? (
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-all border border-zinc-700/50 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-sm transition-all border border-emerald-500/30 flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5"
                  >
                    <Edit className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Intro Details Form/Display */}
            <div className="mt-4 sm:mt-2">
              {isEditing ? (
                <div className="space-y-5 max-w-3xl animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={e => setProfileData({...profileData, name: e.target.value})}
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm shadow-inner"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Headline / Domain</label>
                      <input 
                        type="text" 
                        value={profileData.domain} 
                        onChange={e => setProfileData({...profileData, domain: e.target.value})}
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Location</label>
                    <input 
                      type="text" 
                      value={profileData.location} 
                      onChange={e => setProfileData({...profileData, location: e.target.value})}
                      className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm shadow-inner"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{profileData.name}</h1>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-bold text-lg mt-1 tracking-wide">
                      {profileData.domain}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-zinc-400">
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><MapPin className="w-4 h-4 text-emerald-500" /> {profileData.location}</span>
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><Mail className="w-4 h-4 text-emerald-500" /> {profileData.email}</span>
                  </div>
                  <div className="pt-2 text-sm">
                    <span className="text-emerald-400 font-bold cursor-pointer hover:underline flex items-center gap-1.5">
                      <User className="w-4 h-4" /> {stats.connections} Connections
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two-Column Grid for Bottom Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: About & Stats */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* About Section */}
            <div className="bg-zinc-900/40 backdrop-blur-2xl ring-1 ring-white/10 rounded-[2rem] p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" /> About
              </h2>
              {isEditing ? (
                <textarea 
                  rows="5"
                  value={profileData.bio}
                  onChange={e => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 text-sm resize-none leading-relaxed shadow-inner"
                />
              ) : (
                <p className="text-base text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {profileData.bio || "Write something about yourself..."}
                </p>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-zinc-900/40 backdrop-blur-2xl ring-1 ring-white/10 rounded-[2rem] p-6 sm:p-8 shadow-xl flex items-center gap-6 hover:bg-zinc-900/60 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Calendar className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-white">{stats.eventsAttended}</p>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Events Attended</p>
                </div>
              </div>
              <div className="bg-zinc-900/40 backdrop-blur-2xl ring-1 ring-white/10 rounded-[2rem] p-6 sm:p-8 shadow-xl flex items-center gap-6 hover:bg-zinc-900/60 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-white">{stats.eventsHosted}</p>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Events Hosted</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Links & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Social Links Section */}
            <div className="bg-zinc-900/40 backdrop-blur-2xl ring-1 ring-white/10 rounded-[2rem] p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-emerald-400" /> Links & Socials
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-zinc-800/80 text-zinc-300 shadow-inner"><Github className="w-5 h-5" /></div>
                  {isEditing ? (
                    <input type="text" value={profileData.github} onChange={e => setProfileData({...profileData, github: e.target.value})} className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm shadow-inner" placeholder="github.com/username" />
                  ) : (
                    <a href={`https://${profileData.github}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors truncate">{profileData.github}</a>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-zinc-800/80 text-zinc-300 shadow-inner"><Linkedin className="w-5 h-5" /></div>
                  {isEditing ? (
                    <input type="text" value={profileData.linkedin} onChange={e => setProfileData({...profileData, linkedin: e.target.value})} className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm shadow-inner" placeholder="linkedin.com/in/username" />
                  ) : (
                    <a href={`https://${profileData.linkedin}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors truncate">{profileData.linkedin}</a>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-zinc-800/80 text-zinc-300 shadow-inner"><Briefcase className="w-5 h-5" /></div>
                  {isEditing ? (
                    <input type="text" value={profileData.website} onChange={e => setProfileData({...profileData, website: e.target.value})} className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 text-sm shadow-inner" placeholder="yourportfolio.com" />
                  ) : (
                    <a href={`https://${profileData.website}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors truncate">{profileData.website}</a>
                  )}
                </div>
              </div>
            </div>

            {/* Account Actions (Logout) */}
            <div className="bg-zinc-900/40 backdrop-blur-2xl ring-1 ring-red-500/10 rounded-[2rem] p-6 sm:p-8 shadow-xl flex flex-col justify-center">
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Account Actions</h2>
              <button 
                onClick={handleLogoutClick}
                className="w-full px-5 py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm transition-all border border-red-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-lg"
              >
                <LogOut className="w-5 h-5" /> Sign Out of EventEase
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}