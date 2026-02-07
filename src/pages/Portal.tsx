import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, FolderOpen, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { ProfileSection } from "@/components/portal/ProfileSection";

interface ClientProject {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  start_date: string | null;
  estimated_completion: string | null;
  total_cost: number | null;
  amount_paid: number | null;
  created_at: string;
}

interface Profile {
  full_name: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const Portal = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "profile">("projects");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);
    const [projectsRes, profileRes] = await Promise.all([
      supabase.from("client_projects").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (profileRes.data) setProfile(profileRes.data);
    setLoadingData(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusCounts = {
    active: projects.filter(p => p.status === "in_progress").length,
    review: projects.filter(p => p.status === "review").length,
    completed: projects.filter(p => p.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container-wide px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Advant<span className="text-primary">Flow</span>
            </span>
          </a>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-wide px-6 md:px-12 lg:px-24 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading-lg mb-2">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="text-muted-foreground mb-8">
            Track your projects, invoices, and account details.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Active Projects", value: statusCounts.active, icon: FolderOpen },
              { label: "In Review", value: statusCounts.review, icon: LayoutDashboard },
              { label: "Completed", value: statusCounts.completed, icon: FolderOpen },
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

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { id: "projects" as const, label: "Projects", icon: FolderOpen },
              { id: "profile" as const, label: "Profile", icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeTab === "projects" ? (
            projects.length === 0 ? (
              <div className="card-enhanced rounded-2xl p-12 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="heading-md mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  Once you start a project with us, it will appear here.
                </p>
                <Button variant="hero" onClick={() => navigate("/#contact")}>
                  Start a Project
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )
          ) : (
            <ProfileSection profile={profile} user={user} onUpdate={fetchData} />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Portal;
