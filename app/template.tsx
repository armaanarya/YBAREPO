'use client'

import React from 'react'
import { motion } from 'framer-motion'

// template.tsx (unlike layout.tsx) remounts on every navigation, which is what
// gives us the per-route enter animation.
//
// OPACITY ONLY — do not add y/translate here. ScrollLegend on the home page is
// position: fixed, and a transform on any ancestor would make this wrapper its
// containing block, re-anchoring it from the viewport and visibly breaking it.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
