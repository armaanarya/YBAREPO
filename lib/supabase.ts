import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(url, key)

export type Signup = {
  id?: string
  name: string
  email: string
  school: string
  grade: string
  build_idea?: string
  created_at?: string
}

export type AnalyticsEvent = {
  event_type: 'page_view' | 'button_click' | 'form_start' | 'form_submit' | 'officer_click'
  page?: string
  metadata?: Record<string, unknown>
}
