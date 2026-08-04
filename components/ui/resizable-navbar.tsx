'use client'

import { cn } from '@/lib/utils'
import { IconMenu2, IconX } from '@tabler/icons-react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import type { NavLink } from '@/lib/site-nav'

interface YBANavProps {
  items: NavLink[]
  className?: string
}

export function YBANav({ items, className }: YBANavProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 80)
  })

  // startsWith keeps Articles lit while reading /articles/<slug>; the '/' case
  // is special-cased or Home would match every route.
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Link navigation does not unmount the menu, and this also covers back/forward.
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <motion.div
      ref={ref}
      className={cn('fixed inset-x-0 top-0 z-50 w-full', className)}
    >
      {/* Desktop nav */}
      <motion.div
        animate={{
          backdropFilter: visible ? 'blur(16px)' : 'blur(0px)',
          boxShadow: visible
            ? '0 0 0 1px rgba(238,238,255,0.1), 0 8px 32px rgba(0,0,0,0.5)'
            : 'none',
          width: visible ? '78%' : '100%',
          y: visible ? 12 : 0,
          borderRadius: visible ? 999 : 0,
          background: visible ? 'rgba(9,9,15,0.88)' : 'rgba(9,9,15,0)',
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 44 }}
        style={{ minWidth: 780 }}
        className="relative z-[60] mx-auto hidden max-w-6xl flex-row items-center justify-between gap-4 px-6 py-4 lg:flex"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Go to home"
        >
          <span
            style={{
              filter: 'invert(1) brightness(2) drop-shadow(0 0 6px rgba(0,0,0,0.4))',
              display: 'inline-flex',
              lineHeight: 0,
            }}
          >
            <Image src="/yba-mark.svg" alt="YBA" width={30} height={30} priority />
          </span>
          <span style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#eeeeff', letterSpacing: '-0.01em' }}>
            YBA
          </span>
        </Link>

        {/* Centered links */}
        <DesktopLinks items={items} isActive={isActive} />

        {/* CTA */}
        <Link
          href="/register"
          className={cn(
            'relative z-[61] shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
            'bg-[#eeeeff] text-[#09090f] hover:bg-[#d4d4d8] active:scale-95',
          )}
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Join YBA
        </Link>
      </motion.div>

      {/* Mobile nav */}
      <motion.div
        animate={{
          backdropFilter: visible ? 'blur(16px)' : 'blur(0px)',
          background: visible ? 'rgba(9,9,15,0.88)' : 'rgba(9,9,15,0)',
          boxShadow: visible ? '0 1px 0 rgba(238,238,255,0.08)' : 'none',
        }}
        className="relative z-[60] flex w-full flex-row items-center justify-between px-5 py-4 lg:hidden"
      >
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Go to home"
        >
          <span
            style={{
              filter: 'invert(1) brightness(2) drop-shadow(0 0 6px rgba(0,0,0,0.4))',
              display: 'inline-flex',
              lineHeight: 0,
            }}
          >
            <Image src="/yba-mark.svg" alt="YBA" width={28} height={28} priority />
          </span>
          <span style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#eeeeff' }}>
            YBA
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="p-1 text-[#eeeeff]"
        >
          {mobileOpen
            ? <IconX className="size-5" />
            : <IconMenu2 className="size-5" />
          }
        </button>
      </motion.div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-50 mx-3 mt-1 rounded-2xl border border-[rgba(238,238,255,0.12)] bg-[rgba(9,9,15,0.96)] px-4 py-5 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-[rgba(238,238,255,0.12)] text-[#eeeeff]'
                      : 'text-[rgba(238,238,255,0.6)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#eeeeff]',
                  )}
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="mt-3 w-full rounded-xl bg-[#eeeeff] py-3 text-center text-sm font-semibold text-[#09090f] transition-colors hover:bg-[#d4d4d8]"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Join YBA
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DesktopLinks({ items, isActive }: {
  items: NavLink[]
  isActive: (href: string) => boolean
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className="hidden min-w-0 flex-1 flex-row items-center justify-center gap-0.5 lg:flex"
    >
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          onMouseEnter={() => setHovered(item.href)}
          className="relative shrink-0 whitespace-nowrap px-2 py-2 transition-colors duration-150"
          style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: isActive(item.href)
              ? '#eeeeff'
              : hovered === item.href
                ? '#eeeeff'
                : 'rgba(238,238,255,0.65)',
          }}
        >
          {hovered === item.href && (
            <motion.div
              layoutId="nav-hover"
              className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.06)]"
            />
          )}
          {isActive(item.href) && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 rounded-full bg-[rgba(238,238,255,0.1)]"
            />
          )}
          <span className="relative z-10">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}
