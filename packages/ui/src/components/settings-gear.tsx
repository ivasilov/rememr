'use client'

import { SVGMotionProps, motion, useAnimation } from 'motion/react'
import React, { useCallback, useImperativeHandle, useRef } from 'react'

export interface SettingsGearHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

const SettingsGearIcon = React.forwardRef<SettingsGearHandle, SVGMotionProps<SVGSVGElement>>(
  ({ onMouseEnter, onMouseLeave, ...props }, ref) => {
    const controls = useAnimation()
    const isControlledRef = useRef(false)

    useImperativeHandle(ref, () => {
      isControlledRef.current = true // Mark as externally controlled when ref is used
      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      }
    })

    const handleMouseEnter = useCallback(() => {
      if (!isControlledRef.current) {
        controls.start('animate')
      }
    }, [controls])

    const handleMouseLeave = useCallback(() => {
      if (!isControlledRef.current) {
        controls.start('normal')
      }
    }, [controls])

    return (
      <motion.svg
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{ type: 'spring', stiffness: 50, damping: 10 }}
        variants={{
          normal: {
            rotate: 0,
          },
          animate: {
            rotate: 180,
          },
        }}
        animate={controls}
        {...props}
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </motion.svg>
    )
  },
)

SettingsGearIcon.displayName = 'SettingsGearIcon'

export { SettingsGearIcon }
