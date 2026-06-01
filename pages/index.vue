<script setup lang="ts">
import { HelpCircle, LockKeyhole, LogIn, UserRound } from '@lucide/vue'

const router = useRouter()

const credentials = reactive({
  username: '',
  password: ''
})

const submitLogin = () => {
  router.push('/home')
}
</script>

<template>
  <main class="min-h-screen bg-susi-cloud">
    <section class="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
      <div class="max-w-2xl">
        <div class="flex items-center gap-4">
          <div class="grid h-16 w-16 place-items-center rounded-md bg-white shadow-panel ring-1 ring-slate-200">
            <img src="/images/susi-air-logo.png" alt="Susi Air" class="h-12 w-12 object-contain">
          </div>
          <div>
            <p class="text-sm font-bold uppercase text-susi-red">Susi Air Crew Operations</p>
            <h1 class="text-3xl font-bold text-susi-ink sm:text-4xl">Pilot portal</h1>
          </div>
        </div>

        <div class="mt-8 border-l-4 border-susi-red pl-5">
          <p class="text-lg font-semibold leading-8 text-slate-700">
            Access schedule readiness, flight-hour limits, and document validity from one operational dashboard.
          </p>
        </div>
      </div>

      <form class="rounded-md bg-white p-6 shadow-panel ring-1 ring-slate-200" @submit.prevent="submitLogin">
        <div>
          <p class="text-sm font-semibold uppercase text-susi-red">Sign In</p>
          <h2 class="mt-1 text-2xl font-bold text-susi-ink">Pilot login</h2>
        </div>

        <label class="mt-6 block">
          <span class="text-sm font-bold text-slate-700">Username</span>
          <span class="mt-2 flex h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 focus-within:border-susi-navy focus-within:ring-2 focus-within:ring-susi-navy/20">
            <UserRound class="h-5 w-5 text-slate-400" />
            <input
              v-model="credentials.username"
              type="text"
              autocomplete="username"
              class="h-full min-w-0 flex-1 border-0 bg-transparent text-susi-ink outline-none placeholder:text-slate-400"
              placeholder="Pilot username"
              required
            >
          </span>
        </label>

        <label class="mt-4 block">
          <span class="text-sm font-bold text-slate-700">Password</span>
          <span class="mt-2 flex h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 focus-within:border-susi-navy focus-within:ring-2 focus-within:ring-susi-navy/20">
            <LockKeyhole class="h-5 w-5 text-slate-400" />
            <input
              v-model="credentials.password"
              type="password"
              autocomplete="current-password"
              class="h-full min-w-0 flex-1 border-0 bg-transparent text-susi-ink outline-none placeholder:text-slate-400"
              placeholder="Password"
              required
            >
          </span>
        </label>

        <button
          type="submit"
          class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-susi-red px-4 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-susi-red/30"
        >
          <LogIn class="h-5 w-5" />
          Sign in
        </button>

        <a
          href="mailto:crd@susiair.com"
          class="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-susi-navy hover:text-susi-red"
        >
          <HelpCircle class="h-4 w-4" />
          Need help? Contact CRD
        </a>
      </form>
    </section>
  </main>
</template>
