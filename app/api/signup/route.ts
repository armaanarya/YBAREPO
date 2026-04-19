import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, school, grade, build_idea } = body

    if (!name || !email || !school || !grade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email sanity check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await supabase.from('signups').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      school: school.trim(),
      grade,
      build_idea: build_idea?.trim() || null,
    })

    if (error) {
      // Duplicate email — still return success so we don't leak info
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, duplicate: true })
      }
      console.error('[signup]', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
