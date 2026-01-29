import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  label: string;
  subtext?: string;
  subtextColor?: string;
  hasProgress?: boolean;
  progressValue?: number;
}

export function StatsCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  label,
  subtext,
  subtextColor = "text-muted-foreground",
  hasProgress,
  progressValue = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5 card-shadow"
    >
      <div className="flex items-start gap-4">
        <div className={cn("rounded-lg p-2.5", iconBgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {hasProgress && (
            <div className="mt-2">
              <div className="h-1.5 w-full rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-success"
                />
              </div>
            </div>
          )}
          {subtext && (
            <p className={cn("mt-1 text-xs font-medium", subtextColor)}>{subtext}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
