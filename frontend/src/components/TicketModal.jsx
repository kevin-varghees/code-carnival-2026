import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, Clock, Calendar, MapPin } from 'lucide-react';
import { eventDate, fmtDate, isCheckedIn, qrValue } from '../utils/helpers';

// Use as a modal (pass onClose) or inline card (pass inline).
export default function TicketModal({ ticket, event, onClose, inline = false }) {
  if (!ticket) return null;
  const ev = event || ticket.event || {};
  const title = ev.title || ticket.event_title || 'Event ticket';
  const checkedIn = isCheckedIn(ticket);
  const value = qrValue(ticket);

  const body = (
    <div className="glass relative w-full max-w-sm p-6 text-center shadow-glow">
      {!inline && (
        <button onClick={onClose} aria-label="Close ticket" className="absolute right-3 top-3 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      )}
      <h3 className="px-6 text-lg font-bold text-white">{title}</h3>
      <div className="mt-1 flex flex-col items-center gap-1 text-sm text-slate-400">
        {eventDate(ev) && <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{fmtDate(eventDate(ev))}</p>}
        {ev.location && <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{ev.location}</p>}
      </div>

      <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-4 shadow-glow">
        <QRCodeSVG value={value} size={190} level="M" />
      </div>
      <p className="mt-3 break-all font-mono text-xs text-slate-500">{value}</p>

      <div className="mt-4 flex justify-center">
        {checkedIn ? (
          <span className="badge border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> Checked in{ticket.checked_in_at ? ` · ${fmtDate(ticket.checked_in_at)}` : ''}
          </span>
        ) : (
          <span className="badge border-blue-500/30 bg-blue-500/10 text-blue-300">
            <Clock className="h-3.5 w-3.5" /> Not checked in
          </span>
        )}
      </div>
      <p className="mt-4 text-xs text-slate-500">Show this code at the entrance.</p>
    </div>
  );

  if (inline) return body;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div onClick={(e) => e.stopPropagation()} className="flex w-full justify-center">{body}</div>
    </div>
  );
}
