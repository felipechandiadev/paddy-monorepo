const parseMonthKey = (month) => {
  const [yearPart, monthPart] = month.split('-');
  const year = Number(yearPart);
  const monthIndex = Number(monthPart) - 1;
  const start = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const endExclusive = new Date(year, monthIndex + 1, 1, 0, 0, 0, 0);
  return { start, endExclusive };
};

const parseDateInput = (value) => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const parsed = new Date(normalized);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const { start, endExclusive } = parseMonthKey('2026-03');
console.log('Start:', start.toISOString());
console.log('End:', endExclusive.toISOString());

const testDates = ['2026-03-10', '2026-03-29', '2026-03-30', '2026-04-01'];
testDates.forEach(date => {
  const parsed = parseDateInput(date);
  const inRange = parsed && parsed >= start && parsed < endExclusive;
  console.log(`${date}: ${parsed?.toISOString()} -> ${inRange}`);
});
