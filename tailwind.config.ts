import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        titulo: ['Montserrat', 'sans-serif'],
        cuerpo: ['Roboto', 'sans-serif'],
        subtitulo: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
