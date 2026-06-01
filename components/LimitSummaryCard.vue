<script setup lang="ts">
const props = defineProps<{
  title: string
  current: number
  limit: number
  window: string
}>()

const usage = computed(() => Math.min(100, Math.round((props.current / props.limit) * 100)))
const tone = computed(() => {
  if (props.current >= props.limit) return 'bg-susi-red'
  if (props.current / props.limit >= 0.8) return 'bg-amber-500'
  return 'bg-emerald-500'
})
</script>

<template>
  <article class="rounded-md border border-slate-200 p-3 sm:p-4">
    <p class="text-sm font-bold text-slate-500">{{ title }}</p>
    <p class="mt-3 text-2xl font-bold text-susi-ink">{{ current }}h</p>
    <p class="mt-1 text-xs font-semibold text-slate-500">Limit {{ limit }}h</p>
    <div class="mt-3 h-2 rounded-full bg-slate-100">
      <div class="h-2 rounded-full transition-all duration-300" :class="tone" :style="{ width: `${usage}%` }" />
    </div>
    <p class="mt-2 text-xs font-semibold text-slate-500">{{ window }}</p>
  </article>
</template>
