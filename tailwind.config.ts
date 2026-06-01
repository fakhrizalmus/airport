import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app.vue',
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './stores/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        susi: {
          navy: '#343464',
          red: '#EC343B',
          ink: '#172033',
          cloud: '#F5F7FB'
        }
      },
      boxShadow: {
        panel: '0 12px 32px rgba(22, 32, 51, 0.08)'
      }
    }
  }
}
