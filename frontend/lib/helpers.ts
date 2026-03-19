export const formatSocialModuleLabel = (value: string) => value.trim();

export function formatRelativeTime(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  if (!value || Number.isNaN(value.getTime())) return '';

  const now = Date.now();
  const diff = now - value.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}
