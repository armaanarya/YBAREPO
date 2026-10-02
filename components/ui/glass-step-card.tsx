import { T } from '@/lib/theme'

// Original implementation informed by the 21st.dev Glass Blog Card preview:
// https://21st.dev/@moumensoliman/components/glass-blog-card-shadcnui
// Its source requires sign-in; no locked source or additional dependencies used.
export function GlassStepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <li className="glass-step-card" style={{ fontFamily: T.inter }}>
      <span className="glass-step-number" aria-hidden="true">{num}</span>
      <h3 style={{ fontFamily: T.manrope }}>{title}</h3>
      <p>{desc}</p>
    </li>
  )
}
