import { defineStore } from 'pinia'
import documentsData from '~/data/mock-documents.json'
import flightHoursData from '~/data/mock-flight-hours.json'
import schedulesData from '~/data/mock-schedules.json'

type RangeKey = '1w' | '1m' | '3m' | '6m' | '1y'
export type DocumentStatus = 'expired' | 'soon' | 'safe'

type Schedule = {
  id: string
  duty_date: string
  status: number
  base_name: string
  base_color: string
  duty_type: string
  count_schedules: number
  count_logbooks: number
}

type DocumentItem = {
  id: string
  label: string
  expiryDate: string
}

type FlightHour = {
  date: string
  hours: number
}

type DocumentStatusItem = DocumentItem & {
  daysRemaining: number
  status: DocumentStatus
  formattedExpiry: string
}

const TODAY = '2026-05-31'

const dayMs = 24 * 60 * 60 * 1000

const parseIsoDate = (value: string): [number, number, number] => {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
  return [year, month, day]
}

const parseMonth = (value: string): [number, number] => {
  const [year = 0, month = 1] = value.split('-').map(Number)
  return [year, month]
}

const toDate = (value: string) => {
  const [year, month, day] = parseIsoDate(value)
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

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    today: TODAY,
    selectedRange: '1w' as RangeKey,
    selectedMonth: '2026-05',
    ranges: ['1w', '1m', '3m', '6m', '1y'] as RangeKey[],
    documents: documentsData.documents as DocumentItem[],
    documentThreshold: documentsData.thresholds.warningDays,
    pilot: flightHoursData.pilot,
    limits: flightHoursData.limits,
    chartBounds: flightHoursData.chartBounds as Record<RangeKey, {
      limit: number
      max: number
      windowDays: number
      displayRangeDays: number
    }>,
    flightHours: flightHoursData.flightHours as FlightHour[],
    legend: schedulesData.legend,
    schedules: schedulesData.schedules as Schedule[]
  }),
  getters: {
    todayLabel: (state) => formatDate(state.today, { weekday: 'long' }),
    totalFlights: (state) => state.schedules.reduce((sum, item) => sum + item.count_schedules, 0),
    completedFlights: (state) => state.schedules.reduce((sum, item) => sum + item.count_logbooks, 0),
    upcomingDuties: (state) => state.schedules.filter((item) => item.status === 1 && item.duty_date >= state.today),
    currentRangeBound: (state) => state.chartBounds[state.selectedRange],
    hoursInSelectedWindow(): FlightHour[] {
      const bound = this.currentRangeBound
      const end = toDate(this.today)
      const start = addDays(end, -(bound.windowDays - 1))
      return this.flightHours.filter((item) => {
        const date = toDate(item.date)
        return date >= start && date <= end
      })
    },
    displayedHours(): FlightHour[] {
      const bound = this.currentRangeBound
      return this.hoursInSelectedWindow.slice(-bound.displayRangeDays)
    },
    selectedWindowTotal(): number {
      return Number(this.hoursInSelectedWindow.reduce((sum, item) => sum + item.hours, 0).toFixed(1))
    },
    selectedWindowUsage(): number {
      return Math.min(100, Math.round((this.selectedWindowTotal / this.currentRangeBound.limit) * 100))
    },
    latestDailyHours: (state) => state.flightHours.find((item) => item.date === state.today)?.hours ?? 0,
    dailyUsage(): number {
      return Math.round((this.latestDailyHours / this.limits.daily) * 100)
    },
    documentStatuses: (state): DocumentStatusItem[] => {
      const today = toDate(state.today)
      return state.documents.map((document) => {
        const daysRemaining = Math.ceil((toDate(document.expiryDate).getTime() - today.getTime()) / dayMs)
        const status: DocumentStatus = daysRemaining <= 0 ? 'expired' : daysRemaining <= state.documentThreshold ? 'soon' : 'safe'
        return {
          ...document,
          daysRemaining,
          status,
          formattedExpiry: formatDate(document.expiryDate)
        }
      })
    },
    calendarDays: (state) => {
      const [year, month] = parseMonth(state.selectedMonth)
      const first = new Date(year, month - 1, 1)
      const offset = (first.getDay() + 6) % 7
      const cells = []
      const start = addDays(first, -offset)

      for (let index = 0; index < 42; index += 1) {
        const date = addDays(start, index)
        const iso = toIso(date)
        const schedule = state.schedules.find((item) => item.duty_date === iso)
        cells.push({
          iso,
          day: date.getDate(),
          isCurrentMonth: date.getMonth() === first.getMonth(),
          isToday: iso === state.today,
          schedule
        })
      }

      return cells
    },
    selectedMonthLabel: (state) => {
      const [year, month] = parseMonth(state.selectedMonth)
      return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
    },
    nextDuties(): Schedule[] {
      return this.upcomingDuties.slice(0, 5)
    }
  },
  actions: {
    setRange(range: RangeKey) {
      this.selectedRange = range
    },
    moveMonth(direction: -1 | 1) {
      const [year, month] = parseMonth(this.selectedMonth)
      const next = new Date(year, month - 1 + direction, 1)
      this.selectedMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`
    },
    formatDate
  }
})
