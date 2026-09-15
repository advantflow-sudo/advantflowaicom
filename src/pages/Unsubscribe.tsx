import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, MailX, CheckCircle2, AlertTriangle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

type State = "loading" | "valid" | "invalid" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (!token) return setState("invalid");
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.valid === false) return setState("invalid");
        if (data?.email) setEmail(data.email);
        setState("valid");
      } catch {
        setState("error");
      }
    };
    validate();
  }, [token]);

  const confirm = async () => {
    setSubmitting(true);
    const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    setSubmitting(false);
    setState(error ? "error" : "done");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <SEOHead
        title="Unsubscribe | Advant Flow AI"
        description="Manage your email preferences for Advant Flow AI."
        noindex
      />
      <div className="card-enhanced rounded-2xl p-10 max-w-md w-full text-center space-y-4">
        {state === "loading" && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Checking your link…</p>
          </>
        )}

        {state === "valid" && (
          <>
            <MailX className="w-12 h-12 text-primary mx-auto" />
            <h1 className="heading-md">Confirm unsubscribe</h1>
            <p className="text-muted-foreground">
              {email ? `${email} will` : "You will"} no longer receive emails from Advant Flow AI.
            </p>
            <Button onClick={confirm} disabled={submitting} className="w-full">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Unsubscribe
            </Button>
          </>
        )}

        {state === "done" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <h1 className="heading-md">You're unsubscribed</h1>
            <p className="text-muted-foreground">You won't receive further emails from us.</p>
          </>
        )}

        {(state === "invalid" || state === "error") && (
          <>
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="heading-md">Link not valid</h1>
            <p className="text-muted-foreground">
              This unsubscribe link is invalid or has already been used. Email{" "}
              <a href="mailto:info@advantflowai.com" className="text-primary">
                info@advantflowai.com
              </a>{" "}
              and we'll sort it.
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;
