// Fire-and-forget analytics — never blocks the user
export async function track(
  event_type: 'page_view' | 'button_click' | 'form_start' | 'form_submit' | 'officer_click',
  page?: string,
  metadata?: Record<string, unknown>,
) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type, page, metadata }),
    })
  } catch {
    // Swallow — analytics must never break UX
  }
}
