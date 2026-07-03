import { Badge } from "@/components/ui/badge";
import { StatusPembayaran } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: StatusPembayaran;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getBadgeStyle = (status: StatusPembayaran) => {
    switch (status) {
      case "lunas":
        return "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
      case "belum_bayar":
        return "bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30";
      case "terlambat":
        return "bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getLabel = (status: StatusPembayaran) => {
    switch (status) {
      case "lunas":
        return "Lunas";
      case "belum_bayar":
        return "Belum Bayar";
      case "terlambat":
        return "Terlambat";
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
