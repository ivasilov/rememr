'use client'

import { motion } from 'motion/react'
import { type ComponentProps, forwardRef } from 'react'

export const MotionDiv = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof motion.div>
>((props, ref) => {
  return <motion.div ref={ref} {...props} />
})

MotionDiv.displayName = 'MotionDiv'
