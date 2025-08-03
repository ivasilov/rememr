'use client'

import { motion } from 'motion/react'
import { forwardRef, type ComponentProps } from 'react'

export const MotionDiv = forwardRef<HTMLDivElement, ComponentProps<typeof motion.div>>((props, ref) => {
  return <motion.div ref={ref} {...props} />
})

MotionDiv.displayName = 'MotionDiv'
