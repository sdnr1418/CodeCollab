// "12 min ago", "2 h ago", "yesterday", "Oct 28"
export function timeAgo(isoDate) {
  const minutes = Math.round((Date.now() - new Date(isoDate)) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// "10:42"
export const clockTime = (isoDate) =>
  new Date(isoDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })