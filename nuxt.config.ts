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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
        },
        { rel: 'icon', type: 'image/png', href: '/images/susi-air-logo.png' }
      ]
    }
  }
})
