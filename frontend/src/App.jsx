import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
      <div className="min-h-screen bg-[#010101] text-zinc-100 selection:bg-[#39ff14]/30 selection:text-white relative overflow-hidden">
        {/* Ambient Dark Neon Green Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-emerald-950/40 via-emerald-900/10 to-transparent rounded-b-[100%] blur-3xl pointer-events-none" />

        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Explore user={user} />} />
          
          {/* Redirect to home if user is already logged in */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/" replace /> : <Signup setUser={setUser} />} 
          />
          
          <Route path="/events/:id" element={<EventDetails user={user} />} />
          <Route path="/tickets" element={<MyTickets />} />
          
          {/* Create Event Route added here */}
          <Route 
            path="/create-event" 
            element={user ? <CreateEvent user={user} /> : <Navigate to="/login" state={{ from: '/create-event' }} />} 
          />
          
          {/* Profile Page Route with onLogout passed down */}
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} setUser={setUser} onLogout={handleLogout} /> : <Navigate to="/login" state={{ from: '/profile' }} />} 
          />
          
          {/* Management / Organizer Dashboard Route */}
          <Route 
            path="/organizer" 
            element={user ? <OrganizerDashboard /> : <Navigate to="/login" state={{ from: '/organizer' }} />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}