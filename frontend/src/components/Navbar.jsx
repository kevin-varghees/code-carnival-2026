import { Link, NavLink } from 'react-router-dom';
import { Sparkles, Compass, Ticket, LayoutDashboard } from 'lucide-react';

export default function Navbar({ user }) {
  const link = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-zinc-800/80 text-emerald-400 border border-emerald-500/30 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#010101]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-white tracking-wide">
          <Sparkles className="h-5 w-5 text-emerald-400" /> EventEase
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={link}>
            <Compass className="h-4 w-4" /> Explore
          </NavLink>
          
          {user && (
            <NavLink to="/tickets" className={link}>
              <Ticket className="h-4 w-4" /> My Tickets
            </NavLink>
          )}

          {user && (
            <NavLink to="/organizer" className={link}>
              <LayoutDashboard className="h-4 w-4" /> Management
            </NavLink>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-2">
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