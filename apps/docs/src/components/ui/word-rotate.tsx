'use client'

import { AnimatePresence, motion, MotionProps } from 'motion/react'
import { useEffect, useState } from 'react'

import { cn } from '@rememr/ui'

interface WordRotateProps {
  words: string[]
  duration?: number
  motionProps?: MotionProps
  className?: string
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % words.length)
    }, duration)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <span className="text-primary overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.strong key={words[index]} className={cn(className)} {...motionProps}>
          {words[index]}
        </motion.strong>
      </AnimatePresence>
    </span>
  )
}
