import { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, Loader2, MessageSquare, Save, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  booking_date: string;
  booking_time: string;
  timezone: string;
  notes: string | null;
  status: string;
  created_at: string;
}

interface Enquiry {
  id: string;
  service_interest: string | null;
  message: string;
  lead_status: string | null;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  rescheduled: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * Client-facing view: a signed-in visitor sees the bookings and enquiries that
 * match their verified email address, and can keep their own details up to date.
 */
export const ClientBookings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { phone: string; company: string; notes: string }>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const [bookingRes, leadRes] = await Promise.all([
      supabase.from("bookings").select("*").order("booking_date", { ascending: false }),
      supabase
        .from("leads")
        .select("id, service_interest, message, lead_status, created_at")
        .order("created_at", { ascending: false }),
    ]);

    const rows = (bookingRes.data ?? []) as Booking[];
    setBookings(rows);
    setEnquiries((leadRes.data ?? []) as Enquiry[]);
    setDrafts(
      Object.fromEntries(
        rows.map((b) => [b.id, { phone: b.phone ?? "", company: b.company ?? "", notes: b.notes ?? "" }]),
      ),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    // Live updates when our team changes a booking status
    const channel = supabase
      .channel("client-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const saveDetails = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSaving(id);
    const { error } = await supabase
      .from("bookings")
      .update({ phone: draft.phone || null, company: draft.company || null, notes: draft.notes || null })
      .eq("id", id);
    setSaving(null);
    if (error) {
      toast.error("We couldn't save that — please try again.");
      return;
    }
    toast.success("Your details have been updated.");
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookings.length === 0 && enquiries.length === 0) {
    return (
      <div className="card-enhanced rounded-2xl p-12 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="heading-md mb-2">Nothing here yet</h3>
        <p className="text-muted-foreground mb-6">
          Book a call or send us a message and it will show up here, with live status updates.
        </p>
        <Button variant="hero" onClick={() => (window.location.href = "/#booking")}>
          Book a Free Call
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {bookings.length > 0 && (
        <section>
          <h3 className="heading-md mb-4">Your calls</h3>
          <div className="grid gap-4">
            {bookings.map((b) => {
              const draft = drafts[b.id] ?? { phone: "", company: "", notes: "" };
              return (
                <div key={b.id} className="card-enhanced rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div>
                      <p className="font-display font-bold text-lg flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {formatDate(b.booking_date)}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {b.booking_time} ({b.timezone})
                        {b.service_interest ? ` · ${b.service_interest}` : ""}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full border ${
                        statusStyles[b.status] ?? "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`phone-${b.id}`}>Phone</Label>
                      <Input
                        id={`phone-${b.id}`}
                        value={draft.phone}
                        placeholder="Best number to reach you"
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [b.id]: { ...draft, phone: e.target.value } }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`company-${b.id}`}>Business name</Label>
                      <Input
                        id={`company-${b.id}`}
                        value={draft.company}
                        placeholder="Your business"
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [b.id]: { ...draft, company: e.target.value } }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor={`notes-${b.id}`}>Your notes for the call</Label>
                    <Textarea
                      id={`notes-${b.id}`}
                      rows={3}
                      value={draft.notes}
                      placeholder="What's prompting the change, must-haves, deadlines, rough budget…"
                      onChange={(e) => setDrafts((d) => ({ ...d, [b.id]: { ...draft, notes: e.target.value } }))}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button size="sm" variant="hero" onClick={() => saveDetails(b.id)} disabled={saving === b.id}>
                      {saving === b.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save changes
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {enquiries.length > 0 && (
        <section>
          <h3 className="heading-md mb-4">Your messages to us</h3>
          <div className="grid gap-4">
            {enquiries.map((e) => (
              <div key={e.id} className="card-enhanced rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <p className="font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    {e.service_interest || "General enquiry"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{e.message}</p>
                {e.lead_status && (
                  <p className="text-xs text-primary mt-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Status: {e.lead_status}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
