'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'
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

// ─── Single-block flow-in text ────────────────────────────────────────────────
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

export interface TextStaggerProps extends HTMLMotionProps<'div'> {
  text: string
  /** Accepted for API compatibility; no longer used (single-block animation). */
  stagger?: number
  /** Accepted for API compatibility; no longer used (single-block animation). */
  direction?: TransformDirection
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function TextStagger({
  text,
  stagger: _stagger,
  direction: _direction,
  className,
  as: Component = 'span',
  ...props
}: TextStaggerProps) {
  const MotionComp = React.useMemo(
    () => motion.create(Component as React.ElementType),
    [Component],
  )
  return (
    <MotionComp
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative', className)}
      {...props}
    >
      {text}
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
