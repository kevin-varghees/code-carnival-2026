import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { eventCode, eventDate, fmtDate } from '../utils/helpers';

export default function EventCard({ event, actionLabel = 'View & register', to }) {
  return (
    <article className="group flex flex-col justify-between gap-4 p-6 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/30 hover:-translate-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 font-semibold text-emerald-400">
          {eventCode(event)}
        </span>
        <span className="flex items-center gap-1.5 text-zinc-400">
          <Users className="h-3.5 w-3.5 text-emerald-500" />
          {event.registered_count != null ? `${event.registered_count} / ` : ''}
          {event.capacity ?? '—'} seats
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{event.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">{event.description}</p>
      </div>

      <div className="space-y-2 text-sm text-zinc-300 pt-3 border-t border-zinc-900">
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-400" />{fmtDate(eventDate(event))}</p>
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-400" />{event.location || 'Location to be announced'}</p>
      </div>

      <Link 
        to={to || `/events/${event.id}`} 
        className="mt-auto w-full py-3 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-zinc-200 hover:text-white border border-zinc-800 hover:border-emerald-500 font-semibold text-xs tracking-wide text-center transition-all shadow-sm"
      >
        {actionLabel}
      </Link>
    </article>
  );
}