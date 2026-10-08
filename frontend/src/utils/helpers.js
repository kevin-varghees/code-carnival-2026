export const fmtDate = (d) => {
  if (!d) return 'Date to be announced';
  const x = new Date(d);
  if (isNaN(x)) return String(d);
  return x.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

// Backend field names are read defensively so small naming differences don't break the UI.
export const eventDate = (e) => e?.date || e?.start_time || e?.event_date || e?.datetime;
export const eventCode = (e) => e?.event_code || e?.code || `EV-${e?.id ?? ''}`;
export const qrValue = (t) =>
  t?.qr_token || t?.qr_code || t?.ticket_code || t?.token || t?.code || String(t?.id ?? '');
export const isCheckedIn = (t) =>
  Boolean(t?.checked_in || t?.is_checked_in || t?.checked_in_at || t?.status === 'checked_in');
export const statNums = (s = {}) => ({
  registered: s.registered ?? s.total_registrations ?? s.registrations ?? s.registered_count ?? 0,
  attended: s.checked_in ?? s.attended ?? s.attendance ?? s.checked_in_count ?? 0,
});
