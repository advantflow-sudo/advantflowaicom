import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Search, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  lead_status: string | null;
  lead_score: number | null;
  score_reason: string | null;
  message: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "New", variant: "default" },
  contacted: { label: "Contacted", variant: "secondary" },
  qualified: { label: "Qualified", variant: "default" },
  converted: { label: "Converted", variant: "default" },
  lost: { label: "Lost", variant: "destructive" },
};

const getScoreColor = (score: number | null) => {
  if (!score) return "text-muted-foreground";
  if (score >= 70) return "text-primary font-bold";
  if (score >= 40) return "text-accent font-semibold";
  return "text-muted-foreground";
};

const getScoreLabel = (score: number | null) => {
  if (!score) return "—";
  if (score >= 70) return "Hot 🔥";
  if (score >= 40) return "Warm";
  return "Cold";
};

export const LeadsCRM = ({ isAdmin }: { isAdmin: boolean }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"created_at" | "lead_score">("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setLeads(data);
    if (error) console.error("Error fetching leads:", error);
    setLoading(false);
  };

  const toggleSort = (field: "created_at" | "lead_score") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = leads
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.phone && l.phone.includes(q)) ||
        (l.company && l.company.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const valA = sortField === "lead_score" ? (a.lead_score ?? 0) : new Date(a.created_at).getTime();
      const valB = sortField === "lead_score" ? (b.lead_score ?? 0) : new Date(b.created_at).getTime();
      return sortAsc ? valA - valB : valB - valA;
    });

  if (!isAdmin) {
    return (
      <div className="card-enhanced rounded-2xl p-12 text-center">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="heading-md mb-2">Leads</h3>
        <p className="text-muted-foreground">Your captured leads will appear here once your AI system is active.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="heading-md">Leads CRM</h2>
          <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: leads.length },
          { label: "Hot Leads 🔥", value: leads.filter((l) => (l.lead_score ?? 0) >= 70).length },
          { label: "Warm Leads", value: leads.filter((l) => (l.lead_score ?? 0) >= 40 && (l.lead_score ?? 0) < 70).length },
          { label: "New Today", value: leads.filter((l) => new Date(l.created_at).toDateString() === new Date().toDateString()).length },
        ].map((s) => (
          <div key={s.label} className="card-enhanced rounded-xl p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card-enhanced rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="heading-md mb-2">{search ? "No matches" : "No leads yet"}</h3>
          <p className="text-muted-foreground">
            {search ? "Try a different search term." : "Leads will appear here when customers contact you."}
          </p>
        </div>
      ) : (
        <div className="card-enhanced rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("lead_score")}
                  >
                    <div className="flex items-center gap-1">
                      AI Score
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("created_at")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => {
                  const status = statusConfig[lead.lead_status ?? "new"] ?? statusConfig.new;
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{lead.name}</p>
                          {lead.company && (
                            <p className="text-xs text-muted-foreground">{lead.company}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-sm text-foreground">{lead.email}</p>
                          {lead.phone && (
                            <p className="text-xs text-muted-foreground">{lead.phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {lead.service_interest ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className={`text-lg ${getScoreColor(lead.lead_score)}`}>
                            {lead.lead_score ?? "—"}
                          </span>
                          <p className="text-xs text-muted-foreground">{getScoreLabel(lead.lead_score)}</p>
                          {lead.score_reason && (
                            <p className="text-xs text-muted-foreground/60 max-w-[120px] truncate" title={lead.score_reason}>
                              {lead.score_reason}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
