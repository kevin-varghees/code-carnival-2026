import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Github, Linkedin, Calendar, Award, UserPlus, Check, MapPin, Link as LinkIcon, MessageSquare } from 'lucide-react';

export default function Peerprofilee() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for the peer
  const [peer, setPeer] = useState({
    name: 'Priya Sharma',
    domain: 'AI & Python Developer',
    bio: 'Passionate about machine learning and building scalable AI solutions. Always looking for the next hackathon challenge to push boundaries and build cool tech!',
    location: 'Bengaluru, Karnataka',
    github: 'priya-codes',
    linkedin: 'priya-sharma-ai',
    website: 'priyasharma.dev',
    eventsAttended: 12,
    certificates: 4,
    status: 'none'
  });

  // Mock activity feed matching your prototype
  const posts = [
    { id: 1, type: 'event', text: 'Just registered for the Global AI Hackathon! Looking for UI/UX designers to join my team. Let me know if you are interested!', time: '2 hours ago' },
    { id: 2, type: 'cert', text: 'Thrilled to share that I have earned the Advanced Machine Learning Specialization certificate after 3 months of hard work.', time: '3 days ago' },
  ];

  const handleConnect = () => {
    setPeer({ ...peer, status: peer.status === 'none' ? 'sent' : 'none' });
  };

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* ================= DYNAMIC ANIMATED BACKGROUND ================= */}
      {/* Moving/Pulsing Glow Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-emerald-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />
      <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-teal-600/10 rounded-full blur-[140px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[40vw] bg-emerald-900/20 rounded-full blur-[150px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDuration: '8s', animationDelay: '1s' }} />
      
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] pointer-events-none" />
      {/* =============================================================== */}

      {/* Expanded Container Width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Premium Floating Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-emerald-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-wide">Back to Connections</span>
          </button>
        </div>

        {/* Main Glassmorphic Container */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl ring-1 ring-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          
          {/* Cover Image Banner */}
          <div className="w-full h-48 sm:h-64 bg-gradient-to-r from-zinc-900 via-emerald-950/40 to-zinc-900 relative overflow-hidden border-b border-white/5">
             <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent" />
          </div>

          {/* Profile Content Layout */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* LEFT COLUMN: Profile Info & Actions */}
              <div className="lg:w-[35%] flex flex-col items-center lg:items-start text-center lg:text-left relative -mt-24 sm:-mt-32">
                
                {/* Glowing Avatar */}
                <div className="w-36 h-36 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-700 p-1 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] mb-5 relative z-10">
                  <div className="w-full h-full bg-zinc-950 rounded-[1.8rem] flex items-center justify-center font-extrabold text-5xl text-emerald-400">
                    {peer.name.charAt(0)}
                  </div>
                </div>

                {/* Name & Title */}
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">{peer.name}</h1>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-bold text-sm mt-1 uppercase tracking-wider">
                  {peer.domain}
                </p>
                
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-4 font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {peer.location}
                </div>

                {/* Action Buttons */}
                <div className="flex w-full gap-3 mt-8 border-b border-white/5 pb-8">
                  <button
                    onClick={handleConnect}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      peer.status === 'sent' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5'
                    }`}
                  >
                    {peer.status === 'sent' ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {peer.status === 'sent' ? 'Request Sent' : 'Connect'}
                  </button>
                  <button className="p-3 rounded-2xl bg-zinc-800/50 hover:bg-zinc-700/80 text-zinc-200 border border-white/10 transition-all hover:-translate-y-0.5 shadow-lg">
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </div>

                {/* About & Social Links */}
                <div className="w-full mt-8 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">About</h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">{peer.bio}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <a href={`https://github.com/${peer.github}`} className="group flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5">
                      <div className="p-2 rounded-xl bg-zinc-800/80 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors"><Github className="h-4 w-4" /></div>
                      <span className="font-medium">github.com/{peer.github}</span>
                    </a>
                    <a href={`https://linkedin.com/in/${peer.linkedin}`} className="group flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5">
                      <div className="p-2 rounded-xl bg-zinc-800/80 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors"><Linkedin className="h-4 w-4" /></div>
                      <span className="font-medium">in/{peer.linkedin}</span>
                    </a>
                    <a href={`https://${peer.website}`} className="group flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5">
                      <div className="p-2 rounded-xl bg-zinc-800/80 group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors"><LinkIcon className="h-4 w-4" /></div>
                      <span className="font-medium">{peer.website}</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Activity Feed & Stats */}
              <div className="lg:w-[65%] space-y-8 mt-6 lg:mt-0">
                
                {/* Premium Stat Cards */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 lg:p-8 flex items-center gap-6 hover:border-emerald-500/30 transition-all hover:-translate-y-1 shadow-lg group">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-3xl lg:text-4xl font-extrabold text-white">{peer.eventsAttended}</p>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Events Attended</p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 lg:p-8 flex items-center gap-6 hover:border-teal-500/30 transition-all hover:-translate-y-1 shadow-lg group">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Award className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-3xl lg:text-4xl font-extrabold text-white">{peer.certificates}</p>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Certificates Earned</p>
                    </div>
                  </div>
                </div>

                {/* REDESIGNED RECENT ACTIVITY FEED (Prototype Match) */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-8 shadow-lg">
                  <div className="mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-xl font-extrabold text-white">Recent Activity</h3>
                  </div>
                  
                  {/* Clean Vertical Thread */}
                  <div className="relative space-y-10 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:-translate-x-1/2 before:h-full before:w-[2px] before:bg-zinc-800/80">
                    {posts.map((post) => (
                      <div key={post.id} className="relative flex items-start gap-6 group">
                        
                        {/* Avatar Node on Line */}
                        <div className="relative z-10 w-12 h-12 rounded-full bg-zinc-900 border-[4px] border-[#0c0c0e] text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors duration-300">
                          {peer.name.charAt(0)}
                        </div>
                        
                        {/* Post Content */}
                        <div className="flex-1 pt-1.5 pb-2 group-hover:bg-white/[0.02] p-4 -m-4 rounded-2xl transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-bold text-white text-sm">{peer.name}</span>
                              <span className="text-zinc-500 text-xs ml-2">posted this</span>
                            </div>
                            <span className="text-zinc-500 text-xs">{post.time}</span>
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                            {post.text}
                          </p>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}