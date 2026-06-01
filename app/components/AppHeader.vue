<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
  icon?: Component
}>()
</script>

<template>
  <header class="bg-white shadow-sm ring-1 ring-slate-200">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex min-w-0 items-center gap-3">
        <img src="/images/susi-air-logo.png" alt="Susi Air" class="h-11 w-11 rounded-md bg-white object-contain ring-1 ring-slate-200">
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-slate-500">
            {{ eyebrow }}
          </p>
          <h1 class="truncate text-xl font-bold text-susi-ink">{{ title }}</h1>
          <p v-if="subtitle" class="truncate text-xs font-semibold uppercase text-slate-500">{{ subtitle }}</p>
        </div>
      </div>

      <slot name="actions">
        <component :is="icon" v-if="icon" class="h-6 w-6 shrink-0 text-susi-navy" />
      </slot>
    </div>
  </header>
</template>
