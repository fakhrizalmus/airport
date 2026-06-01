<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  Home,
  MoreHorizontal,
  Plane
} from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '~/stores/dashboard'

const dashboard = useDashboardStore()
const {
  calendarDays,
  legend,
  selectedMonthLabel
} = storeToRefs(dashboard)

const selectedDate = ref<string | null>(null)

const openDay = (date: string) => {
  selectedDate.value = date
}
</script>

<template>
  <main class="min-h-screen bg-susi-cloud pb-24">
    <header class="bg-white shadow-sm ring-1 ring-slate-200">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <img src="/images/susi-air-logo.png" alt="Susi Air" class="h-11 w-11 rounded-md bg-white object-contain ring-1 ring-slate-200">
          <div>
            <p class="text-sm font-bold uppercase text-susi-red">Crew Schedule</p>
            <h1 class="text-xl font-bold text-susi-ink">Monthly calendar</h1>
          </div>
        </div>
        <Plane class="h-6 w-6 text-susi-navy" />
      </div>
    </header>

    <div class="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <section class="rounded-md bg-white p-5 shadow-panel ring-1 ring-slate-200">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase text-susi-red">Schedule</p>
            <h2 class="mt-1 text-xl font-bold text-susi-ink">{{ selectedMonthLabel }}</h2>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              title="Previous month"
              @click="dashboard.moveMonth(-1)"
            >
              <ArrowLeft class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              title="Next month"
              @click="dashboard.moveMonth(1)"
            >
              <ArrowRight class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase text-slate-500">
          <span v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">{{ day }}</span>
        </div>

        <div class="mt-2 grid grid-cols-7 gap-2">
          <button
            v-for="day in calendarDays"
            :key="day.iso"
            type="button"
            class="relative flex aspect-square min-h-16 flex-col justify-between rounded-md border p-2 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
            :class="[
              day.isCurrentMonth ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 text-slate-300',
              day.isToday ? 'ring-2 ring-susi-red' : ''
            ]"
            @click="openDay(day.iso)"
          >
            <div class="flex items-start justify-between gap-1">
              <span class="text-sm font-bold">{{ day.day }}</span>
              <span
                v-if="day.schedule"
                class="grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold text-white"
                :style="{ backgroundColor: day.schedule.count_logbooks === day.schedule.count_schedules ? '#10B981' : '#343464' }"
              >
                <Check v-if="day.schedule.count_logbooks === day.schedule.count_schedules" class="h-3 w-3" />
                <template v-else>{{ day.schedule.count_schedules }}</template>
              </span>
            </div>
            <div
              v-if="day.schedule"
              class="rounded px-1.5 py-1 text-xs font-bold text-white"
              :style="{ backgroundColor: day.schedule.base_color }"
            >
              {{ day.schedule.duty_type }}
            </div>
          </button>
        </div>
      </section>

      <section
        v-if="selectedDate"
        class="rounded-md border border-susi-red/20 bg-red-50 p-4 text-sm font-bold text-susi-red"
      >
        Detail page coming soon.
      </section>

      <section class="rounded-md bg-white p-5 shadow-panel ring-1 ring-slate-200">
        <div class="flex items-center gap-2">
          <CalendarDays class="h-5 w-5 text-susi-navy" />
          <h2 class="text-lg font-bold text-susi-ink">Legend</h2>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <div
            v-for="item in legend"
            :key="item.code"
            class="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2"
          >
            <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: item.color }" />
            <div class="min-w-0">
              <p class="text-xs font-bold text-susi-ink">{{ item.code }}</p>
              <p class="truncate text-xs font-semibold text-slate-500">{{ item.label }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <nav class="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white">
      <div class="mx-auto grid h-16 max-w-6xl grid-cols-4 px-2">
        <NuxtLink to="/home" class="flex flex-col items-center justify-center gap-1 text-slate-500">
          <Home class="h-5 w-5" />
          <span class="text-xs font-bold">Home</span>
        </NuxtLink>
        <NuxtLink to="/schedule" class="flex flex-col items-center justify-center gap-1 text-susi-red">
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
