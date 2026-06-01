import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts}'
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
      },
      borderRadius: {
        md: '14px'
      }
    }
  }
}
