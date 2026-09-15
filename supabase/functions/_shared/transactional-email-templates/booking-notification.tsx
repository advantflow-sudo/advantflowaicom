import * as React from 'npm:react@18.3.1'
import { Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { Shell, Row } from './theme.tsx'

// >>> YOUR INBOX <<< every new booking is delivered here instantly.
const OWNER_INBOX = 'info@advantflowai.com'

interface Props {
  name?: string
  email?: string
  phone?: string
  company?: string
  interest?: string
  date?: string
  time?: string
  timezone?: string
  notes?: string
}

function BookingNotification({
  name = 'Unknown',
  email = '',
  phone,
  company,
  interest = 'Not specified',
  date = '',
  time = '',
  timezone = 'Europe/London',
  notes,
}: Props) {
  return (
    <Shell preview={`New booking: ${name} — ${date} ${time}`}>
      <Text style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', margin: '0 0 16px' }}>
        New booking
      </Text>
      <Row label="Name" value={name} />
      <Row label="Email" value={email} />
      {phone ? <Row label="Phone" value={phone} /> : null}
      {company ? <Row label="Company" value={company} /> : null}
      <Row label="Interest" value={interest} />
      <Row label="Date" value={date} />
      <Row label="Time" value={`${time} (${timezone})`} />
      {notes ? <Row label="Notes" value={notes} /> : null}
    </Shell>
  )
}

export const template = {
  component: BookingNotification,
  displayName: 'New booking notification',
  to: OWNER_INBOX,
  subject: (data: Record<string, any>) =>
    `New booking: ${data?.name ?? 'Website visitor'} — ${data?.date ?? ''} ${data?.time ?? ''}`.trim(),
  previewData: {
    name: 'Jane Smith',
    email: 'jane@example.co.uk',
    interest: 'Websites',
    date: '2026-09-20',
    time: '10:00',
    timezone: 'Europe/London',
  },
} satisfies TemplateEntry
