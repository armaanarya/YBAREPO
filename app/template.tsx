import React from 'react'

// template.tsx (unlike layout.tsx) remounts on every navigation, which is what
// gives us the per-route enter animation.
//
// Deliberately CSS, not framer-motion. A motion.div would server-render as
// style="opacity:0" and depend on hydration to become visible — if the JS ever
// failed, the entire page would be invisible. The CSS keyframe fails the other
// way: no animation means the element simply renders at opacity 1. It also
// keeps this a server component, so no JS ships for it at all.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-transition">{children}</div>
}
