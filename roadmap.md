# Roadmap

## Done
- [x] Pricing update (web design + AI automation à la carte) across site, Stripe prices, comparison table, metadata, llms.txt
- [x] Lead-capture form inside the chat widget (interest chips, name, email, optional message)
- [x] Contact form: on-page confirmation, visitor auto-reply, notification to info@advantflowai.com
- [x] Booking calendar on the home page and the pricing page
- [x] Unified lead routing via LEAD_WEBHOOK_URL (console fallback)
- [x] Booking confirmation email + 1-hour-before reminder (hourly job)
- [x] 48-hour follow-up email for leads who never booked (daily job)
- [x] All five email templates rewritten to the approved wording, with real values swapped in
- [x] EMAIL_API_KEY / BOOKING_LINK / CALL_LINK env vars supported (fall back to current settings)

## Waiting on you
- [ ] Add LEAD_WEBHOOK_URL (n8n / Zapier / Make / CRM) so leads forward automatically
- [ ] Optional: add EMAIL_API_KEY, BOOKING_LINK, CALL_LINK if you want to swap providers/links
- [ ] Google Search Console connection (needs your authorisation)
