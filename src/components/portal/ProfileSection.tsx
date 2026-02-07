import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface ProfileSectionProps {
  profile: {
    full_name: string | null;
    company: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
  user: User;
  onUpdate: () => void;
}

export const ProfileSection = ({ profile, user, onUpdate }: ProfileSectionProps) => {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [company, setCompany] = useState(profile?.company || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, company, phone })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Your changes have been saved." });
      onUpdate();
    }
    setSaving(false);
  };

  return (
    <div className="card-enhanced rounded-2xl p-8 max-w-2xl">
      <h3 className="text-lg font-semibold font-display mb-6">Your Profile</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
          <Input value={user.email || ""} disabled className="bg-secondary" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Company</label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7123 456789" />
        </div>

        <Button variant="hero" onClick={handleSave} disabled={saving} className="mt-4">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};
