export const useDateUtils = () => {
  const toDate = (value: string) => {
    const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const toIso = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const addDays = (date: Date, days: number) => {
    const next = new Date(date)
    next.setDate(next.getDate() + days)
    return next
  }

  const formatDate = (value: string, options: Intl.DateTimeFormatOptions = {}) =>
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...options
    }).format(toDate(value))

  return {
    addDays,
    formatDate,
    toDate,
    toIso
  }
}
