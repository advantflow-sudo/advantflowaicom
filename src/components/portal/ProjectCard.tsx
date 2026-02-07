import { motion } from "framer-motion";
import { Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    progress: number;
    start_date: string | null;
    estimated_completion: string | null;
    total_cost: number | null;
    amount_paid: number | null;
  };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  in_progress: "bg-primary/10 text-primary border-primary/30",
  review: "bg-accent/10 text-accent border-accent/30",
  completed: "bg-green-500/10 text-green-400 border-green-500/30",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  review: "In Review",
  completed: "Completed",
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-enhanced rounded-2xl p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold font-display">{project.title}</h3>
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${
                statusColors[project.status] || statusColors.pending
              }`}
            >
              {statusLabels[project.status] || project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}
        </div>

        <div className="flex gap-6 text-sm text-muted-foreground">
          {project.start_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(new Date(project.start_date), "dd MMM yyyy")}
            </div>
          )}
          {project.total_cost && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              £{Number(project.total_cost).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${project.progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-muted-foreground">Progress</span>
        <span className="text-xs font-medium">{project.progress}%</span>
      </div>

      {/* Payment info */}
      {project.total_cost && (
        <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
          <span className="text-muted-foreground">
            Paid: £{Number(project.amount_paid || 0).toLocaleString()} / £{Number(project.total_cost).toLocaleString()}
          </span>
          {Number(project.total_cost) > Number(project.amount_paid || 0) && (
            <span className="text-primary font-medium">
              £{(Number(project.total_cost) - Number(project.amount_paid || 0)).toLocaleString()} remaining
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
