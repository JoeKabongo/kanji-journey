import type { Config } from 'postcss'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

const config: Config = {
  plugins: [tailwindcss(), autoprefixer()],
}

export default config
