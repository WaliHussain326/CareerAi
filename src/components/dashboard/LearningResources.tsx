import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

const resources = [
  {
    icon: Code,
    title: "Advanced React Patterns",
    description: "Master modern React development",
    duration: "8 hours",
    gradient: "from-primary to-primary/70",
  },
  {
    icon: Database,
    title: "Database Design Mastery",
    description: "SQL and NoSQL fundamentals",
    duration: "12 hours",
    gradient: "from-muted-foreground to-muted-foreground/70",
  },
  {
    icon: Cloud,
    title: "Cloud Architecture",
    description: "AWS, Azure, and GCP essentials",
    duration: "16 hours",
    gradient: "from-accent to-accent/70",
  },
];

export function LearningResources() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-5 card-shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recommended Learning Resources</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          See all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="group cursor-pointer"
          >
            <div
              className={cn(
                "rounded-xl p-5 mb-3 bg-gradient-to-br transition-transform group-hover:scale-[1.02]",
                resource.gradient
              )}
            >
              <resource.icon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-foreground text-sm mb-1">
              {resource.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              {resource.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{resource.duration}</span>
              <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Start
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
