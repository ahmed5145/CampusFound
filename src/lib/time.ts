export function timeAgo(isoDate: string): string {
  try {
    const then = new Date(isoDate).getTime()
    const now = Date.now()
    const diff = Math.floor((now - then) / 1000) // seconds

    if (Number.isNaN(diff) || diff < 0) return new Date(isoDate).toLocaleString()

    if (diff < 10) return 'just now'
    if (diff < 60) return `${diff} seconds ago`
    const minutes = Math.floor(diff / 60)
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`

    // Fallback to localized date for older items
    return new Date(isoDate).toLocaleDateString()
  } catch {
    return isoDate
  }
}
