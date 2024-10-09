const uiConfig = require('@rememr/ui/tailwind.config')

const config = {
  content: ['./src/**/*.{tsx,html}', '../../packages/ui/src/**/*.{ts,tsx}'],
  ...uiConfig,
}

export default config
