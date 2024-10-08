const uiConfig = require('@rememr/ui/tailwind.config')

const config = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  ...uiConfig,
}

export default config
