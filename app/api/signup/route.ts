import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '../../../lib/supabase-server'
import { rateLimit, clientIp } from '../../../lib/rate-limit'
import { clean } from '../../../lib/sanitize'

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`signup:${clientIp(req)}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60' } })
    }

    const body = await req.json()

    // Honeypot: real users never fill this hidden field.
    if (body.company) return NextResponse.json({ ok: true })

    const name   = clean(body.name, 120)
    const email  = clean(body.email, 254).toLowerCase()
    const school = clean(body.school, 200)
    const grade  = clean(body.grade, 40)
    const build_idea = clean(body.build_idea, 2000)

    if (!name || !email || !school || !grade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await supabase.from('signups').insert({
      name, email, school, grade, build_idea: build_idea || null,
    })

    if (error) {
      if (error.code === '23505') return NextResponse.json({ ok: true, duplicate: true })
      console.error('[signup]', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
