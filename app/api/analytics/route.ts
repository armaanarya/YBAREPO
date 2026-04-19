import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

const VALID_EVENTS = new Set([
  'page_view', 'button_click', 'form_start', 'form_submit', 'officer_click',
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_type, page, metadata } = body

    if (!event_type || !VALID_EVENTS.has(event_type)) {
      return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 })
    }

    const { error } = await supabase.from('analytics').insert({
      event_type,
      page: page ?? null,
      metadata: metadata ?? null,
    })

    if (error) {
      console.error('[analytics]', error)
      // Don't fail silently in dev, but never crash the user's experience
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[analytics]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
