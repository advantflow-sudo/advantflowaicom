import * as React from 'npm:react@18.3.1'
import { Button, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { Shell, brand } from './theme.tsx'

interface Props {
  firstName?: string
  interest?: string
  bookingLink?: string
}

function LeadConfirmation({
  firstName = 'there',
  interest = 'our services',
  bookingLink = 'https://advantflowai.com/#booking',
}: Props) {
  return (
    <Shell preview="We've got your message — here's what happens next">
      <Text style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px' }}>
        Hi {firstName},
      </Text>
      <Text style={{ color: brand.muted, fontSize: '15px' }}>
        Thanks for reaching out to Advant Flow AI — we've received your message about{' '}
        <span style={{ color: brand.cyan, fontWeight: 600 }}>{interest}</span>.
      </Text>
      <Text style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
        Here's what happens next:
      </Text>
      <Text style={{ color: brand.muted, fontSize: '15px' }}>
        We'll review what you've shared and get back to you within one business day with next
        steps (or to book a quick call if that's easier).
      </Text>
      <Text style={{ color: brand.muted, fontSize: '15px' }}>
        In the meantime, if you'd like to skip ahead, you can grab a slot directly on our calendar:
      </Text>
      <Button
        href={bookingLink}
        style={{
          background: 'linear-gradient(135deg,#00d4ff,#0ea5e9)',
          color: '#0a0e1a',
          fontWeight: 'bold',
          padding: '14px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '15px',
        }}
      >
        Book a call →
      </Button>
      <Text style={{ color: brand.muted, fontSize: '15px', marginTop: '24px' }}>
        Talk soon,
        <br />
        The Advant Flow AI Team
      </Text>
    </Shell>
  )
}

export const template = {
  component: LeadConfirmation,
  displayName: 'Lead confirmation (visitor)',
  subject: "We've got your message — here's what happens next",
  previewData: {
    firstName: 'Jane',
    interest: 'AI Automation',
    bookingLink: 'https://advantflowai.com/#booking',
  },
} satisfies TemplateEntry
