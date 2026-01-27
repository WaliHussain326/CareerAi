import { motion } from "framer-motion";
import { Code2, Brain, Smartphone, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const careers = [
  {
    icon: Code2,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Full Stack Developer",
    match: 95,
  },
  {
    icon: Brain,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "AI/ML Engineer",
    match: 88,
  },
  {
    icon: Smartphone,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    title: "Mobile App Developer",
    match: 82,
  },
  {
    icon: Shield,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    title: "Cybersecurity Analyst",
    match: 78,
  },
];

function getMatchColor(match: number) {
  if (match >= 85) return "text-match-high";
  if (match >= 70) return "text-match-medium";
  return "text-match-low";
}

function getMatchBg(match: number) {
  if (match >= 85) return "bg-success/10";
  if (match >= 70) return "bg-warning/10";
  return "bg-destructive/10";
}

export function CareerMatches() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-xl border border-border bg-card p-5 card-shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Top Career Matches</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          Explore more
        </button>
      </div>

      <div className="space-y-3">
        {careers.map((career, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + index * 0.1 }}
            className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className={cn("rounded-lg p-2", career.iconBg)}>
              <career.icon className={cn("h-5 w-5", career.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{career.title}</p>
              <p className="text-xs text-muted-foreground">{career.match}% Match</p>
            </div>
            <div
              className={cn(
                "rounded-full px-3 py-1 text-sm font-bold",
                getMatchBg(career.match),
                getMatchColor(career.match)
              )}
            >
              {career.match}%
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
