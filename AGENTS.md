# Project architecture

- Keep lead capture in the existing `leads` table and route notifications through the existing lead functions, because chat, contact, bookings, and the admin portal share those records.
- Treat `follow_up_sent_at` as evidence of the website's scheduled 48-hour email only, not of an n8n workflow response, because n8n has no authenticated callback to this database.
- Offer calling and texting through the owner's existing `tel:` and `sms:` number rather than claiming chat messages become phone calls, because carrier-backed chat-to-call delivery requires a separate telephony service.