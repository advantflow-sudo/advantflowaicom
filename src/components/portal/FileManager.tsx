import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, File, Trash2, Download, Loader2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  content_type: string | null;
  created_at: string;
  uploaded_by: string;
}

interface FileManagerProps {
  projects: { id: string; title: string }[];
  isAdmin: boolean;
}

export const FileManager = ({ projects, isAdmin }: FileManagerProps) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, [selectedProject]);

  const fetchFiles = async () => {
    setLoading(true);
    let query = supabase.from("project_files").select("*").order("created_at", { ascending: false });
    if (selectedProject !== "all") {
      query = query.eq("project_id", selectedProject);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching files:", error);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const targetProject = selectedProject !== "all" ? selectedProject : projects[0]?.id;
    if (!targetProject) {
      toast.error("Please select a project first.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be under 20MB.");
      return;
    }

    setUploading(true);
    const filePath = `${targetProject}/${Date.now()}_${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("project_files").insert({
        project_id: targetProject,
        uploaded_by: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        content_type: file.type,
      });

      if (dbError) throw dbError;

      toast.success("File uploaded successfully.");
      fetchFiles();
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = async (file: ProjectFile) => {
    const { data, error } = await supabase.storage
      .from("project-files")
      .download(file.file_path);

    if (error) {
      toast.error("Failed to download file.");
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (file: ProjectFile) => {
    const { error: storageError } = await supabase.storage
      .from("project-files")
      .remove([file.file_path]);

    if (storageError) {
      toast.error("Failed to delete file from storage.");
      return;
    }

    const { error: dbError } = await supabase
      .from("project_files")
      .delete()
      .eq("id", file.id);

    if (dbError) {
      toast.error("Failed to delete file record.");
      return;
    }

    toast.success("File deleted.");
    fetchFiles();
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getProjectName = (projectId: string) =>
    projects.find((p) => p.id === projectId)?.title || "Unknown";

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            variant="hero"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || projects.length === 0}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload File
          </Button>
        </div>
      </div>

      {/* File List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : files.length === 0 ? (
        <div className="card-enhanced rounded-2xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold font-display mb-2">No files yet</h3>
          <p className="text-muted-foreground">Upload files to share them with your team.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-enhanced rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <File className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getProjectName(file.project_id)} · {formatSize(file.file_size)} · {format(new Date(file.created_at), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => handleDownload(file)}>
                  <Download className="w-4 h-4" />
                </Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => handleDelete(file)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
