import { Badge } from "@/components/ui/badge";
import { StatusKamar } from "@/types";
import { cn } from "@/lib/utils";

interface KamarBadgeProps {
  status: StatusKamar;
  className?: string;
}

export const KamarBadge = ({ status, className }: KamarBadgeProps) => {
  const getBadgeStyle = (status: StatusKamar) => {
    switch (status) {
      case "tersedia":
        return "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
      case "terisi":
        return "bg-blue-100/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
      case "maintenance":
        return "bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getLabel = (status: StatusKamar) => {
    switch (status) {
      case "tersedia":
        return "Tersedia";
      case "terisi":
        return "Terisi";
      case "maintenance":
        return "Maintenance";
      default:
        return status;
    }
  };

  return (
    <Badge variant="outline" className={cn("font-medium", getBadgeStyle(status), className)}>
      {getLabel(status)}
    </Badge>
  );
};
