import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

// Brand tokens — Midnight Navy + Cyan (matches the website design system).
export const brand = {
  navy: '#0A0F1C',
  panel: '#111827',
  cyan: '#00D4FF',
  text: '#E2E8F0',
  muted: '#94A3B8',
}

export function Shell({
  preview,
  children,
}: {
  preview: string
  children: React.ReactNode
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: brand.navy,
          fontFamily: "'Space Grotesk','Segoe UI',Helvetica,Arial,sans-serif",
          margin: 0,
          padding: '24px 0',
        }}
      >
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Section
            style={{
              background: 'linear-gradient(135deg,#1a1f4d,#0a0e2a)',
              textAlign: 'center',
              padding: '32px 20px 24px',
              borderBottom: `2px solid ${brand.cyan}`,
            }}
          >
            <Text style={{ fontSize: '26px', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>
              Advant<span style={{ color: brand.cyan }}>Flow</span>AI
            </Text>
            <Text style={{ color: brand.muted, fontSize: '13px', margin: '6px 0 0' }}>
              Technology Made Simple
            </Text>
          </Section>
          <Section style={{ backgroundColor: brand.panel, padding: '32px 28px' }}>
            {children}
          </Section>
          <Hr style={{ borderColor: '#1e293b', margin: 0 }} />
          <Section style={{ textAlign: 'center', padding: '24px 20px' }}>
            <Text style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
              <Link href="https://advantflowai.com" style={{ color: brand.cyan, textDecoration: 'none' }}>
                advantflowai.com
              </Link>{' '}
              ·{' '}
              <Link href="mailto:info@advantflowai.com" style={{ color: brand.cyan, textDecoration: 'none' }}>
                info@advantflowai.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <Section style={{ marginBottom: '12px' }}>
      <Text
        style={{
          color: brand.cyan,
          fontSize: '11px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          margin: '0 0 2px',
        }}
      >
        {label}
      </Text>
      <Text style={{ color: brand.text, fontSize: '15px', margin: 0 }}>{value}</Text>
    </Section>
  )
}
