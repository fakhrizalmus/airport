<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Loader2,
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
const isChangingMonth = ref(false)

const openDay = (date: string) => {
  selectedDate.value = date
}

const changeMonth = (direction: -1 | 1) => {
  isChangingMonth.value = true
  dashboard.moveMonth(direction)
  window.setTimeout(() => {
    isChangingMonth.value = false
  }, 350)
}
</script>

<template>
  <main class="min-h-screen bg-susi-cloud pb-24">
    <AppHeader eyebrow="Crew Schedule" title="Monthly calendar" :icon="Plane" />

    <div class="mx-auto max-w-6xl space-y-5 px-3 py-5 sm:px-6 lg:px-8">
      <UiPanel class="px-3 py-4 sm:p-5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold uppercase text-susi-red">Schedule</p>
            <h2 class="mt-1 text-xl font-bold text-susi-ink">{{ selectedMonthLabel }}</h2>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              class="tap-target grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70"
              title="Previous month"
              :disabled="isChangingMonth"
              @click="changeMonth(-1)"
            >
              <Loader2 v-if="isChangingMonth" class="h-4 w-4 animate-spin" />
              <ArrowLeft v-else class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="tap-target grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70"
              title="Next month"
              :disabled="isChangingMonth"
              @click="changeMonth(1)"
            >
              <ArrowRight class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-7 gap-0.5 text-center text-[10px] font-bold uppercase text-slate-500 min-[390px]:gap-1.5 min-[390px]:text-xs sm:gap-2">
          <span v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
            <span class="min-[390px]:hidden">{{ day.slice(0, 1) }}</span>
            <span class="hidden min-[390px]:inline">{{ day }}</span>
          </span>
        </div>

        <div class="mt-2 grid grid-cols-7 gap-0.5 min-[390px]:gap-1.5 sm:gap-2">
          <button
            v-for="day in calendarDays"
            :key="day.iso"
            type="button"
            class="tap-target relative flex aspect-square min-h-11 flex-col justify-start rounded-md border p-1 text-left transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-susi-navy min-[390px]:min-h-14 min-[390px]:justify-between min-[390px]:p-1.5 sm:min-h-16 sm:p-2"
            :class="[
              day.isCurrentMonth ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 text-slate-300',
              day.isToday ? 'ring-2 ring-susi-red' : '',
              selectedDate === day.iso ? 'z-10 border-susi-navy bg-red-50 outline outline-2 outline-offset-2 outline-susi-navy' : ''
            ]"
            :aria-pressed="selectedDate === day.iso"
            @click="openDay(day.iso)"
          >
            <div class="flex items-start justify-between gap-1">
              <span class="text-xs font-bold min-[390px]:text-sm">{{ day.day }}</span>
              <span
                v-if="day.schedule"
                class="grid h-3.5 min-w-3.5 place-items-center rounded-full px-1 text-[9px] font-bold text-white min-[390px]:h-5 min-[390px]:min-w-5 min-[390px]:text-xs"
                :style="{ backgroundColor: day.schedule.count_logbooks === day.schedule.count_schedules ? '#10B981' : '#343464' }"
              >
                <Check v-if="day.schedule.count_logbooks === day.schedule.count_schedules" class="h-2.5 w-2.5 min-[390px]:h-3 min-[390px]:w-3" />
                <template v-else>{{ day.schedule.count_schedules }}</template>
              </span>
            </div>
            <div
              v-if="day.schedule"
              class="hidden truncate rounded px-1.5 py-1 text-[10px] font-bold text-white min-[390px]:block min-[390px]:text-[11px] sm:text-xs"
              :style="{ backgroundColor: day.schedule.base_color }"
            >
              {{ day.schedule.duty_type }}
            </div>
          </button>
        </div>
      </UiPanel>

      <section
        v-if="selectedDate"
        class="rounded-md border border-susi-red/20 bg-red-50 p-4 text-sm font-bold text-susi-red"
      >
        Detail page coming soon.
      </section>

      <UiPanel>
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
      </UiPanel>
    </div>

    <AppBottomNav />
  </main>
</template>
