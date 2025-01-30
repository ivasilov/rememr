const uiConfig = require('@rememr/ui/tailwind.config')

const config = {
  ...uiConfig,
  content: ['./src/**/*.{tsx,html}', '../../packages/ui/src/**/*.{ts,tsx}'],
}

export default config
