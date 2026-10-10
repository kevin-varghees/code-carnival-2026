import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, Compass, Ticket, LayoutDashboard, Users, Bell, Check, X, UserPlus, Calendar } from 'lucide-react';

export default function Navbar({ user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'request', title: 'Connection Request', message: 'Alex Rivera wants to connect with you.', time: '2m ago', read: false },
    { id: 2, type: 'suggestion', title: 'Event Match', message: 'Based on your skills, you might like "Global AI Hackathon".', time: '1h ago', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const link = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-zinc-800/80 text-emerald-400 border border-emerald-500/30 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#010101]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-white tracking-wide group">
          <Sparkles className="h-5 w-5 text-emerald-400 group-hover:animate-pulse" /> EventEase
        </Link>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-1 hidden md:flex">
          <NavLink to="/" end className={link}>
            <Compass className="h-4 w-4" /> Explore
          </NavLink>
          <NavLink to="/events" className={link}>
            <Calendar className="h-4 w-4" /> Events
          </NavLink>
          <NavLink to="/tickets" className={link}>
            <Ticket className="h-4 w-4" /> My Tickets
          </NavLink>
          <NavLink to="/friends" className={link}>
            <Users className="h-4 w-4" /> Connections
          </NavLink>
          <NavLink to="/organizer" className={link}>
            <LayoutDashboard className="h-4 w-4" /> Management
          </NavLink>
        </div>

        {/* Right Side: Notifications & Profile (or Login) */}
        {user ? (
          <div className="flex items-center gap-4">
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-400 transition-all shadow-sm focus:outline-none"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#010101] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                )}
              </button>

              {/* Glassmorphic Notifications Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-zinc-950/95 border border-zinc-800/80 rounded-2xl shadow-2xl backdrop-blur-3xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Notifications {unreadCount > 0 && <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">{unreadCount} new</span>}
                    </h3>
                    <button onClick={() => setShowNotifications(false)} className="text-zinc-500 hover:text-white transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-zinc-500 text-sm">
                        You're all caught up! ✨
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => markAsRead(notif.id)}
                          className={`p-3 rounded-xl flex gap-3 transition-all cursor-pointer relative group ${notif.read ? 'opacity-70 hover:bg-zinc-900/50' : 'bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10'}`}
                        >
                          {/* Icon */}
                          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-inner ${notif.type === 'request' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {notif.type === 'request' ? <UserPlus className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 pr-6">
                            <div className="flex justify-between items-start mb-0.5">
                              <h4 className={`text-sm ${notif.read ? 'font-medium text-zinc-300' : 'font-bold text-white'}`}>{notif.title}</h4>
                              <span className="text-[10px] text-zinc-500">{notif.time}</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">{notif.message}</p>
                            
                            {/* Quick Actions for connection requests */}
                            {notif.type === 'request' && !notif.read && (
                              <div className="flex gap-2 mt-2">
                                <button className="px-3 py-1.5 bg-emerald-500 text-zinc-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors shadow-sm">Accept</button>
                                <button className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg hover:bg-zinc-700 transition-colors">Ignore</button>
                              </div>
                            )}
                          </div>

                          {/* Dismiss Button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                            className="absolute top-3 right-3 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-zinc-800/80 text-center">
                    <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Trigger */}
            <Link 
              to="/profile" 
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 py-1 pl-1 pr-3 hover:border-emerald-500/40 transition-all shadow-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-bold text-white overflow-hidden shadow-sm">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name?.[0]?.toUpperCase() || '?'
                )}
              </span>
              <span className="hidden text-sm sm:block">
                <span className="font-semibold text-zinc-200">{user.name}</span>
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link to="/signup" className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-950/30">
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}