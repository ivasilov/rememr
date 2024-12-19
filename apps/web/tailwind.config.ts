const uiConfig = require('@rememr/ui/tailwind.config')

const config = {
  ...uiConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
}

export default config
