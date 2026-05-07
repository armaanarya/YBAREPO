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
import React, { useRef, useState } from 'react'

type Page = 'home' | 'about' | 'goals' | 'curriculum' | 'podcast' | 'register' | 'contact'

interface NavItem { name: string; page: Page }

interface YBANavProps {
  items: NavItem[]
  currentPage: Page
  onNavigate: (p: Page) => void
  className?: string
}

export function YBANav({ items, currentPage, onNavigate, className }: YBANavProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 80)
  })

  const go = (p: Page) => { onNavigate(p); setMobileOpen(false) }

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
          width: visible ? '60%' : '100%',
          y: visible ? 12 : 0,
          borderRadius: visible ? 999 : 0,
          background: visible ? 'rgba(9,9,15,0.88)' : 'rgba(9,9,15,0)',
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 44 }}
        style={{ minWidth: 600 }}
        className="relative z-[60] mx-auto hidden max-w-5xl flex-row items-center justify-between px-6 py-3 lg:flex"
      >
        {/* Logo */}
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2 shrink-0"
          aria-label="Go to home"
        >
          <Image src="/yba-mark.svg" alt="YBA" width={30} height={30} priority />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#eeeeff', letterSpacing: '-0.01em' }}>
            YBA
          </span>
        </button>

        {/* Centered links */}
        <DesktopLinks items={items} currentPage={currentPage} onNavigate={go} />

        {/* CTA */}
        <button
          onClick={() => go('register')}
          className={cn(
            'relative z-[61] shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
            'bg-[#eeeeff] text-[#09090f] hover:bg-[#d4d4d8] active:scale-95',
          )}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Join YBA
        </button>
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
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2"
          aria-label="Go to home"
        >
          <Image src="/yba-mark.svg" alt="YBA" width={28} height={28} priority />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#eeeeff' }}>
            YBA
          </span>
        </button>

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
                <button
                  key={item.page}
                  onClick={() => go(item.page)}
                  className={cn(
                    'w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                    currentPage === item.page
                      ? 'bg-[rgba(238,238,255,0.12)] text-[#eeeeff]'
                      : 'text-[rgba(238,238,255,0.6)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#eeeeff]',
                  )}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => go('register')}
                className="mt-3 w-full rounded-xl bg-[#eeeeff] py-3 text-sm font-semibold text-[#09090f] transition-colors hover:bg-[#d4d4d8]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Join YBA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DesktopLinks({ items, currentPage, onNavigate }: {
  items: NavItem[]
  currentPage: Page
  onNavigate: (p: Page) => void
}) {
  const [hovered, setHovered] = useState<Page | null>(null)

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className="pointer-events-none absolute inset-0 hidden flex-row items-center justify-center gap-1 lg:flex"
    >
      {items.map(item => (
        <button
          key={item.page}
          onMouseEnter={() => setHovered(item.page)}
          onClick={() => onNavigate(item.page)}
          className="pointer-events-auto relative px-3 py-2 text-sm transition-colors duration-150"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: currentPage === item.page
              ? '#eeeeff'
              : hovered === item.page
                ? '#eeeeff'
                : 'rgba(238,238,255,0.55)',
          }}
        >
          {hovered === item.page && (
            <motion.div
              layoutId="nav-hover"
              className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.06)]"
            />
          )}
          {currentPage === item.page && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 rounded-full bg-[rgba(238,238,255,0.1)]"
            />
          )}
          <span className="relative z-10">{item.name}</span>
        </button>
      ))}
    </div>
  )
}
