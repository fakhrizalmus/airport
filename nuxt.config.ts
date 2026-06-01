export default defineNuxtConfig({
  compatibilityDate: '2026-05-31',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Susi Air Pilot Dashboard',
      meta: [
        {
          name: 'description',
          content: 'Pilot dashboard for schedules, flight-hour limits, and document validity.'
        }
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/images/susi-air-logo.png' }]
    }
  }
})
