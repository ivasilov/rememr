'use client'

import { motion, useAnimation, type Variants } from 'motion/react'
import React, {
  type SVGProps,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'

const dotVariants: Variants = {
  normal: {
    opacity: 1,
  },
  animate: (custom: number) => ({
    opacity: [1, 0, 0, 1, 1, 0, 0, 1],
    transition: {
      opacity: {
        times: [
          0,
          0.1,
          0.1 + custom * 0.1,
          0.1 + custom * 0.1 + 0.1,
          0.5,
          0.6,
          0.6 + custom * 0.1,
          0.6 + custom * 0.1 + 0.1,
        ],
        duration: 1.5,
      },
    },
  }),
}

export interface MessageCircleMoreHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

const MessageCircleMoreIcon = React.forwardRef<
  MessageCircleMoreHandle,
  SVGProps<SVGSVGElement>
>(({ onMouseEnter, onMouseLeave, ...props }, ref) => {
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
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <svg
        fill="none"
        height="28"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="28"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <motion.path
          animate={controls}
          custom={0}
          d="M8 12h.01"
          variants={dotVariants}
        />
        <motion.path
          animate={controls}
          custom={1}
          d="M12 12h.01"
          variants={dotVariants}
        />
        <motion.path
          animate={controls}
          custom={2}
          d="M16 12h.01"
          variants={dotVariants}
        />
      </svg>
    </div>
  )
})

export { MessageCircleMoreIcon }
