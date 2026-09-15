// Guarded service worker registration.
// Never registers in dev or inside the Lovable preview — only on the real site.
import { registerSW } from "virtual:pwa-register";

export function setupPWA() {
  if (typeof window === "undefined") return;
  if (import.meta.env.DEV) return;

  const host = window.location.hostname;
  const isPreview = host.endsWith("lovable.app") && host.includes("preview");
  if (isPreview) return;

  registerSW({ immediate: true });
}
