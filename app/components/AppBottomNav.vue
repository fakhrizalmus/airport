<script setup lang="ts">
import {
  BookOpenCheck,
  CalendarDays,
  Home,
  MoreHorizontal
} from '@lucide/vue'

const route = useRoute()

const navItems = [
  { label: 'Home', to: '/home', icon: Home },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Logbook', to: '/logbook', icon: BookOpenCheck },
  { label: 'More', to: '/more', icon: MoreHorizontal }
]
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white">
    <div class="mx-auto grid h-16 max-w-6xl grid-cols-4 px-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="tap-target flex flex-col items-center justify-center gap-1"
        :class="route.path === item.to ? 'text-susi-red' : 'text-slate-500'"
      >
        <component :is="item.icon" class="h-5 w-5" />
        <span class="text-xs font-bold">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
