import * as React from 'npm:react@18.3.1'
import { Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { Shell, Row, brand } from './theme.tsx'

// >>> YOUR INBOX <<< every new lead is delivered here instantly.
const OWNER_INBOX = 'lerone.smith1@outlook.com'

interface Props {
  name?: string
  email?: string
  company?: string
  phone?: string
  interest?: string
  message?: string
  source?: string
  timestamp?: string
}

function LeadNotification({
  name = 'Unknown',
  email = '',
  company,
  phone,
  interest = 'Not specified',
  message = '',
  source = 'advantflowai.com',
  timestamp = new Date().toISOString(),
}: Props) {
  return (
    <Shell preview={`New lead: ${name} — ${interest}`}>
      <Text style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', margin: '0 0 16px' }}>
        New lead
      </Text>
      <Row label="Name" value={name} />
      <Row label="Email" value={email} />
      {company ? <Row label="Company" value={company} /> : null}
      {phone ? <Row label="Phone" value={phone} /> : null}
      <Row label="Interest" value={interest} />
      {message ? <Row label="Message" value={message} /> : null}
      <Row label="Source" value={source} />
      <Row label="Received" value={timestamp} />
      <Text style={{ color: brand.muted, fontSize: '13px', marginTop: '20px' }}>
        Reply straight to this lead at {email}.
      </Text>
    </Shell>
  )
}

export const template = {
  component: LeadNotification,
  displayName: 'New lead notification',
  to: OWNER_INBOX,
  subject: (data: Record<string, any>) =>
    `New lead: ${data?.name ?? 'Website visitor'} — ${data?.interest ?? 'General'}`,
  previewData: {
    name: 'Jane Smith',
    email: 'jane@example.co.uk',
    company: 'Smith Plumbing',
    interest: 'AI Automation',
    message: 'We want to automate quote follow-ups.',
    source: 'advantflowai.com contact form',
    timestamp: new Date().toISOString(),
  },
} satisfies TemplateEntry
