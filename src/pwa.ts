// Guarded service worker registration.
// Never registers in dev or inside the Lovable preview — only on the real site.
import { registerSW } from "virtual:pwa-register";

const STALE_HTML_CACHE = "html-pages";
const RECOVERY_FLAG = "afa-sw-recovered";

// Older builds cached whole HTML pages. Those cached pages reference asset files
// that no longer exist after a deploy, which shows visitors a blank screen.
// Delete that cache on every load so it can never be served again.
async function dropStaleHtmlCache() {
  if (!("caches" in window)) return;
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k.includes(STALE_HTML_CACHE)).map((k) => caches.delete(k)),
    );
  } catch {
    /* cache access can be blocked in private mode — ignore */
  }
}

// Last-resort self-heal: if the page fails to load a script chunk (the classic
// symptom of a stale cache), wipe everything and reload once.
function installRecovery() {
  const heal = async () => {
    if (sessionStorage.getItem(RECOVERY_FLAG)) return;
    sessionStorage.setItem(RECOVERY_FLAG, "1");
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  window.addEventListener("error", (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "SCRIPT" || target.tagName === "LINK")) heal();
  }, true);

  window.addEventListener("unhandledrejection", (e) => {
    const msg = String((e.reason as Error)?.message ?? e.reason ?? "");
    if (/dynamically imported module|Importing a module script failed|Failed to fetch/i.test(msg)) {
      heal();
    }
  });
}

export function setupPWA() {
  if (typeof window === "undefined") return;

  installRecovery();
  void dropStaleHtmlCache();

  if (import.meta.env.DEV) return;

  const host = window.location.hostname;
  const isPreview = host.endsWith("lovable.app") && host.includes("preview");
  if (isPreview) return;

  registerSW({ immediate: true });
}
