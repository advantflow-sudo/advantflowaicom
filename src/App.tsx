import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";

// Secondary pages load on demand so the homepage ships less JavaScript.
// After a new deploy the old chunk filenames disappear, which makes a stale
// tab/service-worker fail the dynamic import and show a blank screen.
// Retry once, then force one hard reload to pick up the fresh build.
const RELOAD_FLAG = "afa-chunk-reload";

function lazyWithRetry<T extends { default: React.ComponentType<any> }>(
  factory: () => Promise<T>,
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      sessionStorage.removeItem(RELOAD_FLAG);
      return mod;
    } catch (err) {
      if (!sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        if ("caches" in window) {
          try {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          } catch {
            /* ignore */
          }
        }
        window.location.reload();
        // Never resolves — the page is reloading.
        return new Promise<T>(() => {});
      }
      throw err;
    }
  });
}

const Auth = lazyWithRetry(() => import("./pages/Auth"));
const Portal = lazyWithRetry(() => import("./pages/Portal"));
const Blog = lazyWithRetry(() => import("./pages/Blog"));
const BlogPost = lazyWithRetry(() => import("./pages/BlogPost"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const PaymentSuccess = lazyWithRetry(() => import("./pages/PaymentSuccess"));
const PricingPage = lazyWithRetry(() => import("./pages/PricingPage"));
const ResetPassword = lazyWithRetry(() => import("./pages/ResetPassword"));
const Download = lazyWithRetry(() => import("./pages/Download"));
const Unsubscribe = lazyWithRetry(() =>
  import("./pages/Unsubscribe"),
);
const ChatWidget = lazyWithRetry(() =>
  import("@/components/chat/ChatWidget").then((m) => ({ default: m.ChatWidget })),
);


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/download" element={<Download />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <ChatWidget />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
