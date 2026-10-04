export function managuaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Managua', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function displayDate(isoDate) {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return 'Sin fecha';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
