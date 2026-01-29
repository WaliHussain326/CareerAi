import { motion } from "framer-motion";
import { Check, Star, BookOpen, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { quizAPI, careersAPI, onboardingAPI } from "@/services/api";

interface Activity {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  time: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setIsLoading(true);
      const activityList: Activity[] = [];

      // Check onboarding completion
      try {
        const onboardingData = await onboardingAPI.getOnboardingData();
        if (onboardingData.data) {
          activityList.push({
            icon: Check,
            iconBg: "bg-success/10",
            iconColor: "text-success",
            title: "Completed profile setup",
            time: "Recently",
          });
        }
      } catch (error) {
        // Onboarding not completed
      }

      // Check quiz completion
      try {
        const quizProgress = await quizAPI.getProgress();
        if (quizProgress.data.is_completed) {
          activityList.push({
            icon: Target,
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            title: "Completed career assessment",
            time: "Recently",
          });
        }
      } catch (error) {
        // Quiz not completed
      }

      // Check career recommendations
      try {
        const careers = await careersAPI.getRecommendations();
        if (careers.data.length > 0) {
          activityList.push({
            icon: Star,
            iconBg: "bg-warning/10",
            iconColor: "text-warning",
            title: `Found ${careers.data.length} career match${careers.data.length !== 1 ? 'es' : ''}`,
            time: "Recently",
          });
        }
      } catch (error) {
        // No careers yet
      }

      // Add default activity if none found
      if (activityList.length === 0) {
        activityList.push({
          icon: BookOpen,
          iconBg: "bg-accent/10",
          iconColor: "text-accent",
          title: "Start your career journey",
          time: "Now",
        });
      }

      setActivities(activityList.slice(0, 4));
    } catch (error) {
      console.error("Failed to load recent activity:", error);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-5 card-shadow"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </motion.div>
    );
  }

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
