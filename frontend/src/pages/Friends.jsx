import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Check, X, Users, Sparkles, ShieldCheck, ChevronRight, UserX, ArrowLeft } from 'lucide-react';

export default function Friends({ user }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const [suggestions, setSuggestions] = useState([
    { id: 1, name: 'Alex Rivera', domain: 'Full-Stack & React', mutuals: 3, github: 'alex-r', linkedin: 'alex-rivera', events: 4, certificates: 'React Advanced', status: 'none', color: 'from-emerald-500 to-teal-600', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 2, name: 'Priya Sharma', domain: 'AI & Python', mutuals: 5, github: 'priya-s', linkedin: 'priya-sharma', events: 6, certificates: 'Machine Learning Spec', status: 'none', color: 'from-teal-500 to-emerald-700', badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    { id: 3, name: 'Marcus Chen', domain: 'UI/UX & Tailwind', mutuals: 2, github: 'marcus-c', linkedin: 'marcus-chen', events: 2, certificates: 'UI Design Masterclass', status: 'none', color: 'from-green-500 to-emerald-600', badgeColor: 'bg-green-500/10 text-green-400 border-green-500/20' },
  ]);

  const [myFriends, setMyFriends] = useState([
    { id: 201, name: 'Kevin Varghees', domain: 'Backend & Flask', github: 'kevin-v', linkedin: 'kevin-varghees', events: 8, certificates: 'Flask API Security', color: 'from-emerald-500 to-teal-600' },
    { id: 202, name: 'Pooja', domain: 'Frontend & Git', github: 'pooja-code', linkedin: 'pooja', events: 5, certificates: 'Git Workflow Pro', color: 'from-teal-500 to-green-600' },
  ]);

  const handleSendRequest = (id) => {
    setSuggestions(suggestions.map(peer => 
      peer.id === id ? { ...peer, status: peer.status === 'sent' ? 'none' : 'sent' } : peer
    ));
  };

  const handleRemoveFriend = (id) => {
    setMyFriends(myFriends.filter(f => f.id !== id));
  };

  const domains = ['All', 'Full-Stack & React', 'AI & Python', 'UI/UX & Tailwind', 'Backend & Flask'];

  const filteredSuggestions = suggestions.filter(peer => {
    const matchesSearch = peer.name.toLowerCase().includes(searchQuery.toLowerCase()) || peer.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || peer.domain.includes(selectedDomain);
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 p-6 md:p-10 relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* Ambient Emerald Lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-emerald-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-teal-600/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.05] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header with Back Arrow */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800/80 pb-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all shadow-md group"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Sparkles className="h-6 w-6 text-emerald-400" /> Connections Hub
              </h1>
              <p className="text-sm text-zinc-400 mt-1">Manage your crew and discover event teammates seamlessly.</p>
            </div>
          </div>
          <div className="bg-zinc-900/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-zinc-800/80 text-sm text-zinc-300 shadow-xl flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-400" />
            <span>Crew Members: <strong className="text-white font-bold">{myFriends.length}</strong></span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Profile & Friend List */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User Mini Card */}
            <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-transparent" />
              <div className="relative pt-2">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 mx-auto flex items-center justify-center font-extrabold text-white text-3xl mb-3 shadow-xl shadow-emerald-950/50 border-2 border-zinc-800">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <h2 className="font-bold text-white text-lg flex items-center justify-center gap-1.5">
                  {user?.name || 'My Profile'} <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">EventEase Team Lead</p>
              </div>
            </div>

            {/* Friend List */}
            <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" /> My Crew ({myFriends.length})
              </h3>
              
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {myFriends.map((friend) => (
                  <div key={friend.id} className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/70 rounded-2xl p-3.5 flex items-center justify-between hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all group">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${friend.id}`)}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${friend.color} text-white flex items-center justify-center font-bold text-sm shadow-md`}>
                        {friend.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-xs hover:text-emerald-400 transition-colors">{friend.name}</h4>
                        <p className="text-[10px] text-zinc-400">{friend.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => navigate(`/profile/${friend.id}`)} className="p-2 rounded-xl bg-zinc-800/80 text-zinc-300 hover:text-white transition-all">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleRemoveFriend(friend.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                        <UserX className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Search & Vertical Feed Suggestions */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search Bar */}
            <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center bg-zinc-950/80 border border-zinc-800/90 rounded-2xl px-4 py-3 shadow-inner focus-within:border-emerald-500/60 transition-all">
                <Search className="h-4 w-4 text-emerald-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search peers by name or tech stack (e.g., React, Python)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                />
                <button 
                  onClick={() => {}} 
                  className="ml-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition-all shadow-lg shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {domains.map((dom) => (
                  <button
                    key={dom}
                    onClick={() => setSelectedDomain(dom)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedDomain === dom 
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' 
                        : 'bg-zinc-950/60 text-zinc-400 hover:text-white border border-zinc-800/80'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Teammates Vertical Feed */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2 px-1">
                <Users className="h-4 w-4 text-emerald-400" /> Suggested Teammates
              </h3>
              
              <div className="space-y-3">
                {filteredSuggestions.length === 0 ? (
                  <p className="text-zinc-500 py-12 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800/80 backdrop-blur-xl">No matching peers found.</p>
                ) : (
                  filteredSuggestions.map((peer) => (
                    <div 
                      key={peer.id} 
                      className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between shadow-2xl hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all duration-300"
                    >
                      {/* Left: Avatar & Info */}
                      <div className="flex items-center gap-4 cursor-pointer flex-1 pr-4" onClick={() => navigate(`/profile/${peer.id}`)}>
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${peer.color} text-white flex items-center justify-center font-bold text-base shadow-lg shrink-0 border border-white/10`}>
                          {peer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-white text-sm hover:text-emerald-400 transition-colors">{peer.name}</h4>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${peer.badgeColor}`}>
                              {peer.domain}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">{peer.mutuals} mutual hackathons / events</p>
                        </div>
                      </div>

                      {/* Right: Action Button */}
                      <div className="shrink-0 flex gap-2">
                        <button
                          onClick={() => navigate(`/profile/${peer.id}`)}
                          className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs px-3.5 py-2 rounded-xl font-semibold transition-all border border-zinc-700/50"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => handleSendRequest(peer.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            peer.status === 'sent' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40'
                          }`}
                        >
                          {peer.status === 'sent' ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                          {peer.status === 'sent' ? 'Sent' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}