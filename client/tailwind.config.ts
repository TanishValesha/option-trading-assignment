// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {fontFamily: {
        // 'sans' is the default sans-serif stack. We'll extend it to include Poppins.
        // Poppins should be the first font in the array to be the primary font.
        // Fallback fonts (sans-serif) are important in case Poppins fails to load.
        poppins: ['Poppins', 'sans-serif'], // Custom font family name
        // Or, you can override the default sans-serif font:
        // sans: ['Poppins', ...require('tailwindcss/defaultTheme').fontFamily.sans],
      },} },
  plugins: [],
}

export default config;
