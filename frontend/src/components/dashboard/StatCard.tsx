import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  colorClass?: string;
}

export const StatCard = ({ title, value, description, trend }: StatCardProps) => {
  return (
    <Card className="bg-card shadow-sm border border-border">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          
          {description && (
            <p className={cn(
              "text-xs font-medium",
              trend === "up" ? "text-emerald-600 dark:text-emerald-400" : trend === "down" ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
            )}>
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
