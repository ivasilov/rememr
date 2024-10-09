import type { PlasmoCSConfig } from 'plasmo'

import { CountButton } from '~features/count-button'

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  world: 'MAIN',
}

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8">
      <CountButton />
    </div>
  )
}

export default PlasmoOverlay
