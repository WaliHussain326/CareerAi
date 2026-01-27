import { motion } from "framer-motion";
import { Check, Star, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    icon: Check,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    title: "Completed Skills Assessment",
    time: "2 hours ago",
  },
  {
    icon: Star,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    title: "New Career Match Found",
    time: "1 day ago",
  },
  {
    icon: BookOpen,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Started Learning Path",
    time: "3 days ago",
  },
  {
    icon: Trophy,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "Achievement Unlocked",
    time: "5 days ago",
  },
];

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-5 card-shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={cn("rounded-lg p-2", activity.iconBg)}>
              <activity.icon className={cn("h-4 w-4", activity.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
