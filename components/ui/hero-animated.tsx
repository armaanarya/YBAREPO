'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, useMotionValue, useSpring, type HTMLMotionProps, type Transition } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'

// ─── Types ────────────────────────────────────────────────────────────────────
export type TransformDirection = 'top' | 'bottom' | 'left' | 'right' | 'z'

const heroVariants = cva(
  'relative min-h-svh w-full overflow-hidden',
  {
    variants: {
      layout: {
        default: 'flex flex-col items-center text-center justify-center place-content-center',
        colLeft: 'flex flex-col justify-center items-start',
      },
    },
    defaultVariants: { layout: 'default' },
  }
)

// ─── Hero wrapper ─────────────────────────────────────────────────────────────
export interface HeroProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof heroVariants> {}

export function Hero({ children, className, layout, ...props }: HeroProps) {
  return (
    <section className={cn(heroVariants({ layout }), className)} {...props}>
      {children}
    </section>
  )
}

// ─── Gradient background ──────────────────────────────────────────────────────
const GRADIENT_COLORS = {
  indigo: [
    { color: 'rgba(255,255,255,0.95)', start: '0%' },
    { color: 'rgba(238,238,255,0.7)', start: '15%' },
    { color: 'rgba(238,238,255,0.35)', start: '35%' },
    { color: 'rgba(238,238,255,0.08)', start: '60%' },
    { color: '#09090f', start: '100%' },
  ],
  dark: [
    { color: '#1a1a22', start: '0%' },
    { color: '#0f0f17', start: '35%' },
    { color: '#09090f', start: '100%' },
  ],
}

const GRADIENT_SIZES = {
  default: { width: '70%', height: '55%' },
  lg: { width: '90%', height: '72%' },
  sm: { width: '50%', height: '35%' },
}

const GRADIENT_POSITIONS = {
  top: { x: '50%', y: '-8%' },
  center: { x: '50%', y: '50%' },
  topLeft: { x: '20%', y: '-5%' },
}

export interface BgGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: keyof typeof GRADIENT_SIZES
  gradientPosition?: keyof typeof GRADIENT_POSITIONS
  gradientColors?: keyof typeof GRADIENT_COLORS
}

export function BgGradient({
  gradientSize = 'lg',
  gradientPosition = 'top',
  gradientColors = 'indigo',
  className,
  ...props
}: BgGradientProps) {
  const colors = GRADIENT_COLORS[gradientColors]
  const size = GRADIENT_SIZES[gradientSize]
  const pos = GRADIENT_POSITIONS[gradientPosition]

  const gradientString = colors.map(({ color, start }) => `${color} ${start}`).join(', ')
  const gradientStyle = `radial-gradient(${size.width} ${size.height} at ${pos.x} ${pos.y}, ${gradientString})`
  const dominantColor = colors[colors.length - 1].color

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 size-full select-none', className)}
      style={{ background: dominantColor, backgroundImage: gradientStyle, ...props.style }}
      {...props}
    />
  )
}

// ─── Word-by-word stagger text ────────────────────────────────────────────────
function transformVariants(direction?: TransformDirection) {
  return {
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'top' ? '-100%' : direction === 'bottom' ? '100%' : 0,
      scale: direction === 'z' ? 0 : 1,
      opacity: 0,
    },
    visible: { x: 0, y: 0, scale: 1, opacity: 1 },
  }
}

interface WordProps {
  word: string
  transition?: Transition
  direction?: TransformDirection
}

function Word({ word, transition = { ease: [0.25, 0.1, 0.25, 1], duration: 0.45 }, direction = 'bottom' }: WordProps) {
  return (
    <span className="inline-block text-nowrap align-top">
      {word.split('').map((char, i) => (
        <span key={i} className="inline-block">
          <motion.span
            className="inline-block"
            variants={transformVariants(direction)}
            transition={transition}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export interface TextStaggerProps extends HTMLMotionProps<'div'> {
  text: string
  stagger?: number
  direction?: TransformDirection
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function TextStagger({
  text,
  stagger = 0.04,
  direction,
  className,
  as: Component = 'span',
  ...props
}: TextStaggerProps) {
  const words = text.split(' ')
  const MotionComp = motion(Component as React.ElementType)

  return (
    <MotionComp
      transition={{ staggerChildren: stagger }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('relative', className)}
      {...props}
    >
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <Word direction={direction} word={word} />
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </MotionComp>
  )
}

// ─── Animated container ───────────────────────────────────────────────────────
export interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  transformDirection?: TransformDirection
  className?: string
}

export const AnimatedContainer = React.forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, transformDirection = 'bottom', ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn('relative z-10', className)}
      variants={transformVariants(transformDirection)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        delay: (props.transition as { delay?: number })?.delay ?? 0.3,
        ...props.transition,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
)
AnimatedContainer.displayName = 'AnimatedContainer'

// ─── Hero Spotlight (cursor-following light spot) ────────────────────────────
export function HeroSpotlight() {
  const ref = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 60, damping: 18, mass: 0.6 })

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      if (e.clientY < r.top || e.clientY > r.bottom) return
      x.set(e.clientX - r.left)
      y.set(e.clientY - r.top)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden="true"
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(238,238,255,0.18), transparent 60%)',
          position: 'absolute',
          mixBlendMode: 'plus-lighter',
        }}
      />
    </div>
  )
}
