import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { routeLead } from "@/lib/lead-routing";
import { CalendarCheck, Clock, User, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { format, addDays, isBefore, isWeekend, startOfDay } from "date-fns";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

const services = [
  "Web Design",
  "AI Automation",
  "Custom AI Agents",
  "Full Package (Web + AI)",
  "Not sure yet",
];

export const BookingCalendar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [step, setStep] = useState<"date" | "details" | "confirmed">("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service_interest: "",
    notes: "",
  });

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  const disabledDays = (date: Date) => {
    return isBefore(date, today) || date > maxDate || isWeekend(date);
  };

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (date) {
      // Fetch booked slots for this date via SECURITY DEFINER RPC (no PII exposed)
      const dateStr = format(date, "yyyy-MM-dd");
      const { data } = await supabase.rpc("get_booked_slots", { _date: dateStr });
      setBookedSlots((data as any[])?.map((b: any) => b.booking_time) || []);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.name || !formData.email) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        service_interest: formData.service_interest || null,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        booking_time: selectedTime,
        notes: formData.notes || null,
      });

      if (error) throw error;

      // Unified lead routing (CRM / Zapier / Make / n8n) — non-blocking
      routeLead({
        name: formData.name,
        email: formData.email,
        interest: formData.service_interest,
        message: `Booked a call for ${format(selectedDate, "yyyy-MM-dd")} at ${selectedTime}. ${formData.notes || ""}`.trim(),
        source: "booking",
      });

      // Trigger confirmation email (non-blocking)
      try {
        await supabase.functions.invoke("send-booking-confirmation", {
          body: {
            name: formData.name,
            email: formData.email,
            booking_date: format(selectedDate, "yyyy-MM-dd"),
            booking_time: selectedTime,
            service_interest: formData.service_interest || undefined,
          },
        });
      } catch (emailErr) {
        console.error("Booking email trigger failed:", emailErr);
      }

      setStep("confirmed");
      toast({ title: "Discovery call booked! 🎉", description: "Check your inbox for confirmation details." });
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({ title: "Booking failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSlots = TIME_SLOTS.filter((t) => !bookedSlots.includes(t));

  return (
    <section id="booking" className="section-padding relative overflow-hidden">
      <div className="container-wide">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Book a Call
          </span>
          <h2 className="heading-lg mb-4">
            Schedule a <span className="text-gradient">Free Discovery Call</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            30 minutes to discuss your project, explore solutions, and get a custom quote. No obligation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {step === "confirmed" ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">You're All Set! 🎉</h3>
              <p className="text-muted-foreground mb-2">
                Your discovery call is booked for{" "}
                <span className="text-primary font-semibold">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d")} at {selectedTime}
                </span>
              </p>
              <p className="text-muted-foreground text-sm">We'll send you a calendar invite and preparation tips shortly.</p>
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => {
                  setStep("date");
                  setSelectedDate(undefined);
                  setSelectedTime("");
                  setFormData({ name: "", email: "", phone: "", service_interest: "", notes: "" });
                }}
              >
                Book Another Call
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl blur-3xl" />
              <div className="relative bg-card border border-border rounded-3xl p-6 md:p-10">
                {/* Steps indicator */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === "date" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <CalendarCheck className="w-4 h-4" /> Pick a Time
                  </div>
                  <div className="w-8 h-px bg-border" />
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === "details" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <User className="w-4 h-4" /> Your Details
                  </div>
                </div>

                {step === "date" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Select a Date</h4>
                      <div className="bg-secondary/50 rounded-2xl p-4 flex justify-center">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={disabledDays}
                          className="text-foreground"
                        />
                      </div>
                    </div>

                    {/* Time slots */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        {selectedDate
                          ? `Available Times — ${format(selectedDate, "EEE, MMM d")}`
                          : "Select a date first"}
                      </h4>
                      {selectedDate ? (
                        <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                          {availableSlots.length > 0 ? (
                            availableSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                  selectedTime === time
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "bg-secondary/50 text-foreground border-border hover:border-primary/50 hover:bg-secondary"
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                {time}
                              </button>
                            ))
                          ) : (
                            <p className="col-span-2 text-muted-foreground text-sm text-center py-8">
                              No available slots for this date. Try another day.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[320px] text-muted-foreground text-sm">
                          <p>← Pick a date to see available times</p>
                        </div>
                      )}
                      {selectedTime && (
                        <Button
                          variant="hero"
                          className="w-full mt-4"
                          onClick={() => setStep("details")}
                        >
                          Continue →
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {step === "details" && (
                  <div className="max-w-lg mx-auto space-y-5">
                    <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3 text-sm">
                      <CalendarCheck className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium">
                        {selectedDate && format(selectedDate, "EEEE, MMMM d")} at {selectedTime} (London time)
                      </span>
                      <button onClick={() => setStep("date")} className="ml-auto text-primary text-xs hover:underline">
                        Change
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">What are you interested in?</label>
                      <Select
                        value={formData.service_interest}
                        onValueChange={(v) => setFormData((p) => ({ ...p, service_interest: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Anything we should know?</label>
                      <Textarea
                        placeholder="Tell us briefly about your project..."
                        value={formData.notes}
                        onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full group"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Booking...
                        </>
                      ) : (
                        <>
                          Confirm Booking
                          <CalendarCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Free 30-min call · No obligation · Cancel anytime
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
