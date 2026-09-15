import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Apple, Monitor, Smartphone, Terminal } from "lucide-react";

// >>> PASTE YOUR HOSTED DOWNLOAD LINKS HERE <<<
// Upload the packaged files (AdvantFlowAI-Windows.zip, AdvantFlowAI-macOS.zip,
// AdvantFlowAI-Linux.tar.gz) to your own storage/CDN and paste the URLs below.
const DESKTOP_DOWNLOADS = [
  { label: "Download for Windows", icon: Monitor, url: "" },
  { label: "Download for macOS", icon: Apple, url: "" },
  { label: "Download for Linux", icon: Terminal, url: "" },
];

const Download = () => (
  <main className="relative min-h-screen">
    <SEOHead
      title="Download the Advant Flow AI App"
      description="Install Advant Flow AI on your phone or desktop — one tap to your projects, files, messages and bookings."
      canonical="https://advantflowai.com/download"
    />
    <Navbar />

    <section className="container-wide px-6 md:px-12 lg:px-20 pt-32 pb-24">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
        Get the <span className="text-primary">Advant Flow AI</span> app
      </h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Everything on the website, in an app you can open from your home screen or desktop.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8">
          <Smartphone className="w-8 h-8 text-primary" />
          <h2 className="font-display text-xl font-semibold mt-4 text-foreground">Phone &amp; tablet</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>
              <strong className="text-foreground">iPhone / iPad:</strong> open this page in Safari, tap Share, then
              “Add to Home Screen”.
            </li>
            <li>
              <strong className="text-foreground">Android:</strong> open in Chrome, tap the menu, then “Install app”.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8">
          <Monitor className="w-8 h-8 text-primary" />
          <h2 className="font-display text-xl font-semibold mt-4 text-foreground">Computer</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Install straight from your browser (look for the install icon in the address bar), or download the desktop
            app below.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {DESKTOP_DOWNLOADS.map(({ label, icon: Icon, url }) => (
              <Button
                key={label}
                variant={url ? "hero" : "outline"}
                className="justify-start"
                disabled={!url}
                asChild={!!url}
              >
                {url ? (
                  <a href={url} download>
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </a>
                ) : (
                  <span>
                    <Icon className="w-4 h-4 mr-2 inline" />
                    {label} — coming soon
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default Download;
