import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '../../../lib/supabase-server'
import { rateLimit, clientIp } from '../../../lib/rate-limit'
import { clean, clampJson } from '../../../lib/sanitize'

const VALID_EVENTS = new Set([
  'page_view', 'button_click', 'form_start', 'form_submit', 'officer_click',
])

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`analytics:${clientIp(req)}`, 60, 60_000)) {
      return NextResponse.json({ ok: true }) // silently drop; never disrupt UX
    }

    const body = await req.json()
    const event_type = clean(body.event_type, 40)
    if (!VALID_EVENTS.has(event_type)) {
      return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 })
    }

    const { error } = await supabase.from('analytics').insert({
      event_type,
      page: body.page ? clean(body.page, 80) : null,
      metadata: clampJson(body.metadata, 4096),
    })
    if (error) {
      console.error('[analytics]', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[analytics]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
