import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  CheckCircle,
  Circle,
  Flame,
  Award,
  BookOpen,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

const milestones = [
  { id: 1, title: "Complete Profile", completed: true },
  { id: 2, title: "Take Career Assessment", completed: true },
  { id: 3, title: "Review Recommendations", completed: true },
  { id: 4, title: "Start Learning Path", completed: false },
  { id: 5, title: "Complete First Course", completed: false },
  { id: 6, title: "Update Skills", completed: false },
];

const weeklyActivity = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.5 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 1 },
  { day: "Sun", hours: 0 },
];

const achievements = [
  {
    id: 1,
    icon: Flame,
    title: "7 Day Streak",
    description: "Logged in for 7 consecutive days",
    earned: true,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 2,
    icon: Target,
    title: "First Assessment",
    description: "Completed your first career quiz",
    earned: true,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 3,
    icon: Award,
    title: "Top Match",
    description: "Got a 90%+ career match",
    earned: true,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 4,
    icon: BookOpen,
    title: "Quick Learner",
    description: "Complete 5 learning modules",
    earned: false,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  {
    id: 5,
    icon: Code,
    title: "Skill Master",
    description: "Rate 10 skills at Expert level",
    earned: false,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
];

const Progress_ = () => {
  return (
    <DashboardLayout title="Your Progress" subtitle="Track your career journey">
      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Trophy, label: "Achievements", value: "3/8", color: "text-warning", bg: "bg-warning/10" },
          { icon: Target, label: "Goals Completed", value: "3/6", color: "text-primary", bg: "bg-primary/10" },
          { icon: Clock, label: "Learning Hours", value: "14h", color: "text-accent", bg: "bg-accent/10" },
          { icon: TrendingUp, label: "Skill Growth", value: "+24%", color: "text-success", bg: "bg-success/10" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl border border-border bg-card p-5 card-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={cn("rounded-lg p-2.5", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 card-shadow"
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">Journey Milestones</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">3 of 6 completed</span>
              <span className="font-medium text-foreground">50%</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                {milestone.completed ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    milestone.completed
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {milestone.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-card p-6 card-shadow"
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">Weekly Activity</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyActivity.map((day, index) => {
              const maxHeight = 4;
              const heightPercent = (day.hours / maxHeight) * 100;
              return (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                    className={cn(
                      "w-full rounded-t-lg min-h-[4px]",
                      day.hours > 0 ? "bg-primary" : "bg-muted"
                    )}
                  />
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total this week</span>
            <span className="font-semibold text-foreground">14 hours</span>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-xl border border-border bg-card p-6 card-shadow"
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground">Achievements</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={cn(
                "flex flex-col items-center rounded-xl p-4 text-center",
                achievement.bgColor,
                !achievement.earned && "opacity-50"
              )}
            >
              <achievement.icon className={cn("h-8 w-8 mb-2", achievement.color)} />
              <p className="text-sm font-medium text-foreground">{achievement.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Progress_;
