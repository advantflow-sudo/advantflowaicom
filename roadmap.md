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
- [ ] Resume the paused Lovable Cloud hosted database so live forms, chat and the dashboard can save or read leads
- [ ] Repair the failed Sales Follow-up execution in n8n (production webhook returned HTTP 500 "Error in workflow" on a labeled live test); then rerun the end-to-end lead test
- [ ] Optional: add BOOKING_LINK and CALL_LINK if you want to swap booking links
- [ ] Google Search Console connection (needs your authorisation)

## Current request
- [x] Test the published Sales Follow-up webhook; it returned HTTP 500 (end-to-end confirmation waits on the two blockers above)
- [x] Show follow-up email state and sent time in the leads dashboard (website's 48-hour email only; n8n events are not recorded in the app)
- [x] Provide direct call/text actions and capture optional callback numbers in chat (phone carrier integration not provisioned)
- [x] Ensure the existing website contact form is accessible independently of chat, including pricing
