import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Mail, Phone, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface BookingsManagerProps {
  isAdmin: boolean;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

export const BookingsManager = ({ isAdmin }: BookingsManagerProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: true })
        .order("booking_time", { ascending: true });
      setBookings(data || []);
      setLoading(false);
    };
    fetchBookings();

    const channel = supabase
      .channel("bookings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const firstDayOffset = useMemo(() => {
    const day = startOfMonth(currentMonth).getDay();
    return day === 0 ? 6 : day - 1; // Monday start
  }, [currentMonth]);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      if (!map[b.booking_date]) map[b.booking_date] = [];
      map[b.booking_date].push(b);
    });
    return map;
  }, [bookings]);

  const selectedBookings = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    let list = bookingsByDate[key] || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) => b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.phone?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedDate, bookingsByDate, search]);

  const upcomingBookings = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return bookings
      .filter((b) => b.booking_date >= today && b.status !== "cancelled")
      .slice(0, 5);
  }, [bookings]);

  const stats = useMemo(() => ({
    total: bookings.length,
    upcoming: bookings.filter((b) => b.booking_date >= format(new Date(), "yyyy-MM-dd") && b.status !== "cancelled").length,
    today: bookings.filter((b) => b.booking_date === format(new Date(), "yyyy-MM-dd")).length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="card-enhanced rounded-2xl p-12 text-center">
        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="heading-md mb-2">Your Bookings</h3>
        <p className="text-muted-foreground">Contact us to manage your appointments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: stats.total },
          { label: "Upcoming", value: stats.upcoming },
          { label: "Today", value: stats.today },
          { label: "Cancelled", value: stats.cancelled },
        ].map((s) => (
          <div key={s.label} className="card-enhanced rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-display">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card-enhanced rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg">{format(currentMonth, "MMMM yyyy")}</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }}>
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayBookings = bookingsByDate[key] || [];
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isPast = isBefore(day, startOfDay(new Date())) && !isToday(day);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(day)}
                  className={`relative p-2 rounded-xl text-sm transition-all min-h-[48px] flex flex-col items-center justify-start gap-0.5 ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isToday(day)
                      ? "bg-primary/10 text-primary font-bold"
                      : isPast
                      ? "text-muted-foreground/50 hover:bg-secondary/50"
                      : "hover:bg-secondary"
                  }`}
                >
                  <span className="text-xs">{format(day, "d")}</span>
                  {dayBookings.length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-primary"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming sidebar */}
        <div className="card-enhanced rounded-2xl p-6">
          <h3 className="font-display font-semibold mb-4">Upcoming</h3>
          {upcomingBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming bookings.</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedDate(parseISO(b.booking_date)); setCurrentMonth(parseISO(b.booking_date)); }}
                  className="w-full text-left p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{b.name}</span>
                    <Badge variant="outline" className={`text-[10px] ${statusColors[b.status] || ""}`}>{b.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarIcon className="w-3 h-3" />
                    {format(parseISO(b.booking_date), "dd MMM")}
                    <Clock className="w-3 h-3 ml-1" />
                    {b.booking_time}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected date detail */}
      {selectedDate && (
        <div className="card-enhanced rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">
              {format(selectedDate, "EEEE, dd MMMM yyyy")}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({selectedBookings.length} booking{selectedBookings.length !== 1 ? "s" : ""})
              </span>
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
              />
            </div>
          </div>

          {selectedBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No bookings on this date.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">{b.booking_time}</span>
                    </div>
                    <Badge variant="outline" className={statusColors[b.status] || ""}>{b.status}</Badge>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{b.name}</span>
                      {b.company && <span className="text-muted-foreground">· {b.company}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{b.email}</span>
                    </div>
                    {b.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{b.phone}</span>
                      </div>
                    )}
                  </div>
                  {b.service_interest && (
                    <p className="text-xs text-primary font-medium">{b.service_interest}</p>
                  )}
                  {b.notes && (
                    <p className="text-xs text-muted-foreground italic">"{b.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
