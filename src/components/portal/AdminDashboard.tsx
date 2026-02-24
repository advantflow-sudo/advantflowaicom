import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, FolderOpen, PoundSterling, TrendingUp, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface ClientWithProfile {
  user_id: string;
  full_name: string | null;
  company: string | null;
  email: string;
}

interface ProjectSummary {
  id: string;
  title: string;
  client_id: string;
  status: string;
  total_cost: number | null;
  amount_paid: number | null;
  progress: number;
  created_at: string;
}

export const AdminDashboard = () => {
  const [clients, setClients] = useState<ClientWithProfile[]>([]);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"overview" | "clients" | "finances" | "leads">("overview");

  // New project form
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", client_id: "", total_cost: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [projectsRes, profilesRes, leadsRes] = await Promise.all([
      supabase.from("client_projects").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, full_name, company"),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (leadsRes.data) setLeads(leadsRes.data);

    // Build client list from profiles that have projects
    if (profilesRes.data && projectsRes.data) {
      const clientIds = new Set(projectsRes.data.map((p) => p.client_id));
      const clientProfiles = profilesRes.data
        .filter((p) => clientIds.has(p.user_id))
        .map((p) => ({ ...p, email: "" }));
      setClients(clientProfiles);
    }

    setLoading(false);
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.client_id) {
      toast.error("Title and client are required.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("client_projects").insert({
      title: newProject.title,
      description: newProject.description || null,
      client_id: newProject.client_id,
      total_cost: newProject.total_cost ? Number(newProject.total_cost) : null,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Project created.");
      setShowNewProject(false);
      setNewProject({ title: "", description: "", client_id: "", total_cost: "" });
      fetchAll();
    }
    setSaving(false);
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from("client_projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Project deleted.");
      fetchAll();
    }
  };

  const totalRevenue = projects.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0);
  const totalOutstanding = projects.reduce((sum, p) => sum + (Number(p.total_cost || 0) - Number(p.amount_paid || 0)), 0);
  const activeProjects = projects.filter((p) => p.status === "in_progress").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const views: { id: typeof view; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "clients", label: "Clients" },
    { id: "finances", label: "Finances" },
    { id: "leads", label: "Leads" },
  ];

  return (
    <div className="space-y-8">
      {/* Sub-nav */}
      <div className="flex gap-2 flex-wrap">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === v.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Clients", value: clients.length, icon: Users },
              { label: "Active Projects", value: activeProjects, icon: FolderOpen },
              { label: "Revenue", value: `£${totalRevenue.toLocaleString()}`, icon: PoundSterling },
              { label: "Outstanding", value: `£${totalOutstanding.toLocaleString()}`, icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="card-enhanced p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-3xl font-bold font-display">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-display">Recent Projects</h3>
              <Button variant="outline" size="sm" onClick={() => setShowNewProject(true)}>
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
            </div>
            <div className="space-y-2">
              {projects.slice(0, 5).map((p) => (
                <div key={p.id} className="card-enhanced rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.status} · {p.progress}% · {format(new Date(p.created_at), "dd MMM yyyy")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteProject(p.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {view === "clients" && (
        <div className="space-y-2">
          {clients.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No clients with active projects yet.</p>
          ) : (
            clients.map((c) => {
              const clientProjects = projects.filter((p) => p.client_id === c.user_id);
              return (
                <div key={c.user_id} className="card-enhanced rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium font-display">{c.full_name || "Unnamed"}</p>
                      <p className="text-sm text-muted-foreground">{c.company || "No company"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{clientProjects.length} project{clientProjects.length !== 1 ? "s" : ""}</p>
                      <p className="text-xs text-muted-foreground">
                        £{clientProjects.reduce((s, p) => s + Number(p.amount_paid || 0), 0).toLocaleString()} paid
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {view === "finances" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card-enhanced rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-4xl font-bold font-display text-primary">£{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="card-enhanced rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-1">Outstanding Balance</p>
              <p className="text-4xl font-bold font-display text-accent">£{totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-2">
            {projects.filter((p) => p.total_cost).map((p) => (
              <div key={p.id} className="card-enhanced rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">£{Number(p.amount_paid || 0).toLocaleString()} / £{Number(p.total_cost || 0).toLocaleString()}</p>
                  <div className="w-24 bg-secondary rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${p.total_cost ? (Number(p.amount_paid || 0) / Number(p.total_cost)) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "leads" && (
        <div className="space-y-2">
          {leads.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No leads yet.</p>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="card-enhanced rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{lead.name}</p>
                    {lead.lead_score > 0 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        lead.lead_status === 'hot' ? 'bg-red-500/20 text-red-400' :
                        lead.lead_status === 'warm' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {lead.lead_score}/100 · {lead.lead_status?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{format(new Date(lead.created_at), "dd MMM yyyy")}</span>
                </div>
                <p className="text-sm text-muted-foreground">{lead.email} {lead.company ? `· ${lead.company}` : ""}</p>
                {lead.service_interest && (
                  <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">{lead.service_interest}</span>
                )}
                {lead.score_reason && (
                  <p className="text-xs text-muted-foreground mt-2 italic">AI: {lead.score_reason}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{lead.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowNewProject(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-8 w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-semibold font-display">Create New Project</h3>
            <Input placeholder="Project title" value={newProject.title} onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))} />
            <Input placeholder="Description (optional)" value={newProject.description} onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))} />
            <select
              value={newProject.client_id}
              onChange={(e) => setNewProject((p) => ({ ...p, client_id: e.target.value }))}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground"
            >
              <option value="">Select client...</option>
              {clients.map((c) => (
                <option key={c.user_id} value={c.user_id}>{c.full_name || c.user_id}</option>
              ))}
            </select>
            <Input placeholder="Total cost (£)" type="number" value={newProject.total_cost} onChange={(e) => setNewProject((p) => ({ ...p, total_cost: e.target.value }))} />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowNewProject(false)} className="flex-1">Cancel</Button>
              <Button variant="hero" onClick={handleCreateProject} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
