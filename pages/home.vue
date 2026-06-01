<script setup lang="ts">
import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  Home,
  MoreHorizontal,
  Plane,
  ShieldAlert,
  UserRound
} from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '~/stores/dashboard'
import type { DocumentStatus } from '~/stores/dashboard'

type RangeKey = '1w' | '1m' | '3m' | '6m' | '1y'

const dashboard = useDashboardStore()
const {
  documentStatuses,
  flightHours,
  limits,
  nextDuties,
  pilot,
  selectedRange,
  today
} = storeToRefs(dashboard)

const ranges: RangeKey[] = ['1w', '1m', '3m', '6m', '1y']

const chartConfig: Record<RangeKey, { label: string; windowDays: number; limit: number; max: number }> = {
  '1w': { label: '1w', windowDays: 7, limit: 40, max: 45 },
  '1m': { label: '1m', windowDays: 30, limit: 100, max: 125 },
  '3m': { label: '3m', windowDays: 90, limit: 300, max: 325 },
  '6m': { label: '6m', windowDays: 180, limit: 600, max: 625 },
  '1y': { label: '1y', windowDays: 365, limit: 1050, max: 1250 }
}

const newsCards = [
  {
    title: 'Runway condition update',
    meta: 'Ops Bulletin',
    body: 'Papua sector crews should confirm local runway condition before first departure.'
  },
  {
    title: 'Monthly safety reminder',
    meta: 'Safety',
    body: 'Review mountain weather alternates and fuel planning notes for remote operations.'
  },
  {
    title: 'Training roster released',
    meta: 'Crew Training',
    body: 'June recurrent sessions are available for pilot acknowledgement.'
  }
]

const documentTone: Record<DocumentStatus, { label: string; badge: string; dot: string }> = {
  safe: {
    label: 'Valid',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500'
  },
  soon: {
    label: 'Due soon',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500'
  },
  expired: {
    label: 'Expired',
    badge: 'bg-red-50 text-red-700 ring-red-200',
    dot: 'bg-susi-red'
  }
}

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

const hoursByDate = computed(() => new Map(flightHours.value.map((item) => [item.date, item.hours])))

const rollingSum = (dateIso: string, windowDays: number) => {
  const end = toDate(dateIso)
  let total = 0

  for (let offset = windowDays - 1; offset >= 0; offset -= 1) {
    total += hoursByDate.value.get(toIso(addDays(end, -offset))) ?? 0
  }

  return Number(total.toFixed(1))
}

const todayHours = computed(() => hoursByDate.value.get(today.value) ?? 0)

const limitCards = computed(() => [
  {
    title: 'Daily',
    current: todayHours.value,
    limit: limits.value.daily,
    window: 'Today only'
  },
  {
    title: 'Weekly',
    current: rollingSum(today.value, 7),
    limit: limits.value.weekly,
    window: 'Rolling 7 days'
  },
  {
    title: 'Monthly',
    current: rollingSum(today.value, 30),
    limit: limits.value.monthly,
    window: 'Rolling 30 days'
  },
  {
    title: 'Annual',
    current: rollingSum(today.value, 365),
    limit: limits.value.annual,
    window: 'Rolling 365 days'
  }
])

const chartDays = computed(() => {
  const anchor = toDate(today.value)
  const config = chartConfig[selectedRange.value as RangeKey]

  return Array.from({ length: 15 }, (_, index) => {
    const date = addDays(anchor, index - 7)
    const iso = toIso(date)

    return {
      iso,
      label: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(date),
      isToday: iso === today.value,
      value: rollingSum(iso, config.windowDays)
    }
  })
})

const chartWidth = 720
const chartHeight = 210

const chartPoints = computed(() => {
  const config = chartConfig[selectedRange.value as RangeKey]

  return chartDays.value.map((point, index) => {
    const x = (index / (chartDays.value.length - 1)) * chartWidth
    const y = chartHeight - (point.value / config.max) * chartHeight
    return `${x},${Math.max(0, y)}`
  }).join(' ')
})

const limitY = computed(() => {
  const config = chartConfig[selectedRange.value as RangeKey]
  return chartHeight - (config.limit / config.max) * chartHeight
})

const upcomingFlight = computed(() => {
  const duty = nextDuties.value[0]

  return {
    date: duty ? formatDate(duty.duty_date, { weekday: 'short', day: '2-digit', month: 'short' }) : formatDate(today.value),
    time: '07:20 WIT',
    departure: 'WAVV - Ambon',
    arrival: 'WASR - Manokwari',
    aircraft: 'C208B Caravan'
  }
})
</script>

<template>
  <main class="min-h-screen bg-susi-cloud pb-24">
    <header class="bg-white shadow-sm ring-1 ring-slate-200">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex min-w-0 items-center gap-3">
          <img src="/images/susi-air-logo.png" alt="Susi Air" class="h-11 w-11 rounded-md bg-white object-contain ring-1 ring-slate-200">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-slate-500">Welcome back,</p>
            <h1 class="truncate text-xl font-bold text-susi-ink">{{ pilot.name }}</h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden text-right sm:block">
            <p class="text-xs font-semibold uppercase text-slate-500">Total Flight Hours</p>
            <p class="text-lg font-bold text-susi-ink">{{ pilot.totalFlightHours.toLocaleString() }}h</p>
          </div>
          <button type="button" class="relative grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-susi-ink">
            <Bell class="h-5 w-5" />
            <span class="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-susi-red px-1 text-xs font-bold text-white">3</span>
          </button>
          <div class="grid h-11 w-11 place-items-center rounded-md bg-susi-navy text-white">
            <UserRound class="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <section class="rounded-md bg-white p-5 shadow-panel ring-1 ring-slate-200">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold uppercase text-susi-red">Upcoming Flight</p>
            <h2 class="mt-1 text-xl font-bold text-susi-ink">{{ upcomingFlight.date }} - {{ upcomingFlight.time }}</h2>
          </div>
          <Plane class="h-6 w-6 text-susi-navy" />
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div class="rounded-md bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase text-slate-500">Departure</p>
            <p class="mt-1 text-lg font-bold text-susi-ink">{{ upcomingFlight.departure }}</p>
          </div>
          <ChevronRight class="hidden h-6 w-6 text-slate-400 sm:block" />
          <div class="rounded-md bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase text-slate-500">Arrival</p>
            <p class="mt-1 text-lg font-bold text-susi-ink">{{ upcomingFlight.arrival }}</p>
          </div>
        </div>

        <p class="mt-3 text-sm font-semibold text-slate-500">{{ upcomingFlight.aircraft }}</p>
      </section>

      <section>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-susi-ink">Latest News</h2>
          <span class="text-sm font-bold text-susi-red">3 updates</span>
        </div>
        <div class="mt-3 flex gap-3 overflow-x-auto pb-2">
          <article
            v-for="news in newsCards"
            :key="news.title"
            class="min-w-[260px] rounded-md bg-white p-4 shadow-panel ring-1 ring-slate-200 sm:min-w-[320px]"
          >
            <p class="text-xs font-bold uppercase text-susi-red">{{ news.meta }}</p>
            <h3 class="mt-2 text-base font-bold text-susi-ink">{{ news.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-500">{{ news.body }}</p>
          </article>
        </div>
      </section>

      <section class="rounded-md bg-white p-5 shadow-panel ring-1 ring-slate-200">
        <div>
          <p class="text-sm font-semibold uppercase text-susi-red">Hours to Limit</p>
          <h2 class="mt-1 text-xl font-bold text-susi-ink">Limit summary</h2>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <article v-for="card in limitCards" :key="card.title" class="rounded-md border border-slate-200 p-4">
            <p class="text-sm font-bold text-slate-500">{{ card.title }}</p>
            <p class="mt-3 text-2xl font-bold text-susi-ink">{{ card.current }}h</p>
            <p class="mt-1 text-xs font-semibold text-slate-500">Limit {{ card.limit }}h</p>
            <div class="mt-3 h-2 rounded-full bg-slate-100">
              <div
                class="h-2 rounded-full"
                :class="card.current >= card.limit ? 'bg-susi-red' : card.current / card.limit >= 0.8 ? 'bg-amber-500' : 'bg-emerald-500'"
                :style="{ width: `${Math.min(100, Math.round((card.current / card.limit) * 100))}%` }"
              />
            </div>
            <p class="mt-2 text-xs font-semibold text-slate-500">{{ card.window }}</p>
          </article>
        </div>

        <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 class="text-base font-bold text-susi-ink">Rolling sum trend</h3>
          <div class="flex w-full rounded-md bg-slate-100 p-1 sm:w-auto">
            <button
              v-for="range in ranges"
              :key="range"
              type="button"
              class="h-9 flex-1 rounded px-3 text-sm font-bold transition sm:min-w-11"
              :class="selectedRange === range ? 'bg-white text-susi-navy shadow-sm' : 'text-slate-500 hover:text-susi-ink'"
              @click="dashboard.setRange(range)"
            >
              {{ chartConfig[range].label }}
            </button>
          </div>
        </div>

        <div class="mt-4 overflow-hidden rounded-md border border-slate-200 bg-slate-50 p-4">
          <svg class="h-72 w-full overflow-visible" :viewBox="`0 0 ${chartWidth} ${chartHeight + 70}`" role="img" aria-label="Rolling flight hours chart">
            <line x1="0" :y1="limitY" :x2="chartWidth" :y2="limitY" stroke="#EC343B" stroke-width="2" stroke-dasharray="8 8" />
            <text x="0" :y="limitY - 9" fill="#EC343B" font-size="13" font-weight="700">
              Limit {{ chartConfig[selectedRange].limit }}h
            </text>
            <polyline :points="chartPoints" fill="none" stroke="#343464" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <g v-for="(point, index) in chartDays" :key="point.iso">
              <line
                v-if="point.isToday"
                :x1="(index / (chartDays.length - 1)) * chartWidth"
                y1="0"
                :x2="(index / (chartDays.length - 1)) * chartWidth"
                :y2="chartHeight"
                stroke="#94A3B8"
                stroke-width="2"
                stroke-dasharray="5 5"
              />
              <circle
                :cx="(index / (chartDays.length - 1)) * chartWidth"
                :cy="Math.max(0, chartHeight - (point.value / chartConfig[selectedRange].max) * chartHeight)"
                r="4.5"
                :fill="point.isToday ? '#EC343B' : '#343464'"
              />
              <text
                :x="(index / (chartDays.length - 1)) * chartWidth"
                y="242"
                fill="#64748B"
                font-size="11"
                text-anchor="middle"
              >
                {{ point.label }}
              </text>
            </g>
          </svg>
        </div>
      </section>

      <section class="rounded-md bg-white p-5 shadow-panel ring-1 ring-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase text-susi-red">My Documents</p>
            <h2 class="mt-1 text-xl font-bold text-susi-ink">Expiry status</h2>
          </div>
          <ShieldAlert class="h-5 w-5 text-susi-navy" />
        </div>

        <div class="mt-5 space-y-3">
          <article v-for="document in documentStatuses" :key="document.id" class="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-4">
            <div class="flex min-w-0 items-center gap-3">
              <span class="h-3 w-3 rounded-full" :class="documentTone[document.status].dot" />
              <div class="min-w-0">
                <h3 class="truncate font-bold text-susi-ink">{{ document.label }}</h3>
                <p class="text-sm text-slate-500">{{ document.formattedExpiry }}</p>
              </div>
            </div>
            <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1" :class="documentTone[document.status].badge">
              {{ documentTone[document.status].label }}
            </span>
          </article>
        </div>
      </section>
    </div>

    <nav class="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white">
      <div class="mx-auto grid h-16 max-w-6xl grid-cols-4 px-2">
        <NuxtLink to="/home" class="flex flex-col items-center justify-center gap-1 text-susi-red">
          <Home class="h-5 w-5" />
          <span class="text-xs font-bold">Home</span>
        </NuxtLink>
        <NuxtLink to="/schedule" class="flex flex-col items-center justify-center gap-1 text-slate-500">
          <CalendarDays class="h-5 w-5" />
          <span class="text-xs font-bold">Schedule</span>
        </NuxtLink>
        <NuxtLink to="/home" class="flex flex-col items-center justify-center gap-1 text-slate-500">
          <BookOpenCheck class="h-5 w-5" />
          <span class="text-xs font-bold">Logbook</span>
        </NuxtLink>
        <NuxtLink to="/home" class="flex flex-col items-center justify-center gap-1 text-slate-500">
          <MoreHorizontal class="h-5 w-5" />
          <span class="text-xs font-bold">More</span>
        </NuxtLink>
      </div>
    </nav>
  </main>
</template>
