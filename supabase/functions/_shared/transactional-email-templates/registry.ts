import type * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides the caller-provided recipientEmail. */
  to?: string
}

import { template as leadNotification } from './lead-notification.tsx'
import { template as leadConfirmation } from './lead-confirmation.tsx'
import { template as bookingNotification } from './booking-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'lead-notification': leadNotification,
  'lead-confirmation': leadConfirmation,
  'booking-notification': bookingNotification,
}
