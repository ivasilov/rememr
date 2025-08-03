'use client'

import { motion } from 'motion/react'
import { forwardRef, type ComponentProps } from 'react'

export const MotionH2 = forwardRef<HTMLHeadingElement, ComponentProps<typeof motion.h2>>((props, ref) => {
  return <motion.h2 ref={ref} {...props} />
})

MotionH2.displayName = 'MotionH2'
