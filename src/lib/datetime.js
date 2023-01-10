/**
 * friendlyDate
 * @description Takes in a date value and returns a friendly version
 */

export function friendlyDateWithTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

export function friendlyDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}
