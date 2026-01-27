import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Check,
  Circle,
  BookOpen,
  Code,
  Database,
  Cloud,
  Lock,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const roadmapSteps = [
  {
    id: 1,
    title: "Foundation",
    duration: "2-3 months",
    status: "completed",
    items: [
      { title: "HTML, CSS, JavaScript Basics", completed: true },
      { title: "Git & Version Control", completed: true },
      { title: "Command Line Fundamentals", completed: true },
    ],
  },
  {
    id: 2,
    title: "Frontend Development",
    duration: "3-4 months",
    status: "in-progress",
    items: [
      { title: "React Fundamentals", completed: true },
      { title: "State Management", completed: false },
      { title: "TypeScript", completed: false },
      { title: "Testing (Jest, RTL)", completed: false },
    ],
  },
  {
    id: 3,
    title: "Backend Development",
    duration: "3-4 months",
    status: "locked",
    items: [
      { title: "Node.js & Express", completed: false },
      { title: "Database Design", completed: false },
      { title: "REST API Development", completed: false },
      { title: "Authentication & Security", completed: false },
    ],
  },
  {
    id: 4,
    title: "DevOps & Deployment",
    duration: "2-3 months",
    status: "locked",
    items: [
      { title: "Docker Fundamentals", completed: false },
      { title: "CI/CD Pipelines", completed: false },
      { title: "Cloud Services (AWS/GCP)", completed: false },
      { title: "Monitoring & Logging", completed: false },
    ],
  },
];

const certifications = [
  {
    id: 1,
    title: "AWS Solutions Architect",
    provider: "Amazon",
    icon: Cloud,
    color: "from-warning to-warning/70",
  },
  {
    id: 2,
    title: "Meta Frontend Developer",
    provider: "Meta",
    icon: Code,
    color: "from-primary to-primary/70",
  },
  {
    id: 3,
    title: "Google Cloud Professional",
    provider: "Google",
    icon: Database,
    color: "from-accent to-accent/70",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-success text-success-foreground";
    case "in-progress":
      return "bg-primary text-primary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    default:
      return "Locked";
  }
}

const CareerPaths = () => {
  return (
    <DashboardLayout
      title="Career Roadmap"
      subtitle="Full Stack Developer Learning Path"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-xl border border-border bg-card p-6 card-shadow"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
              <Code className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Full Stack Developer</h2>
              <p className="text-sm text-muted-foreground">
                Estimated completion: 10-14 months
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">25%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
            <div className="h-16 w-16 relative">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray="25, 100"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: "25, 100" }}
                  transition={{ duration: 1 }}
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Roadmap Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {roadmapSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "rounded-xl border bg-card p-5 card-shadow",
                step.status === "locked" ? "border-border opacity-60" : "border-border"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      step.status === "completed"
                        ? "bg-success text-success-foreground"
                        : step.status === "in-progress"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : step.status === "locked" ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.duration}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    getStatusColor(step.status)
                  )}
                >
                  {getStatusLabel(step.status)}
                </span>
              </div>

              <div className="space-y-2 ml-11">
                {step.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    {item.completed ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        item.completed ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              {step.status === "in-progress" && (
                <Button className="mt-4 ml-11" size="sm">
                  Continue Learning
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recommended Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-5 card-shadow"
          >
            <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Recommended Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={cn("rounded-lg p-2 bg-gradient-to-br", cert.color)}>
                    <cert.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {cert.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{cert.provider}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skill Gap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border bg-card p-5 card-shadow"
          >
            <h3 className="mb-4 font-semibold text-foreground">Skill Gap Analysis</h3>
            <div className="space-y-4">
              {[
                { skill: "React", current: 70, required: 90 },
                { skill: "Node.js", current: 30, required: 80 },
                { skill: "TypeScript", current: 40, required: 85 },
                { skill: "AWS", current: 10, required: 70 },
              ].map((item) => (
                <div key={item.skill}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">{item.skill}</span>
                    <span className="text-muted-foreground">
                      {item.current}% / {item.required}%
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.required}%` }}
                      className="absolute h-full rounded-full bg-muted-foreground/30"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.current}%` }}
                      transition={{ delay: 0.5 }}
                      className="absolute h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CareerPaths;
