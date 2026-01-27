import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Brain,
  Smartphone,
  Shield,
  Cloud,
  Server,
  ChevronRight,
  Star,
  TrendingUp,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

const careers = [
  {
    id: 1,
    icon: Code2,
    title: "Full Stack Developer",
    description: "Build complete web applications from frontend to backend",
    match: 95,
    salary: "$85,000 - $150,000",
    growth: "+25%",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    color: "from-primary to-primary/70",
  },
  {
    id: 2,
    icon: Brain,
    title: "AI/ML Engineer",
    description: "Develop intelligent systems and machine learning models",
    match: 88,
    salary: "$100,000 - $180,000",
    growth: "+40%",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
    color: "from-accent to-accent/70",
  },
  {
    id: 3,
    icon: Smartphone,
    title: "Mobile App Developer",
    description: "Create native and cross-platform mobile applications",
    match: 82,
    salary: "$75,000 - $140,000",
    growth: "+22%",
    skills: ["React Native", "Flutter", "Swift", "Kotlin"],
    color: "from-warning to-warning/70",
  },
  {
    id: 4,
    icon: Shield,
    title: "Cybersecurity Analyst",
    description: "Protect systems and networks from security threats",
    match: 78,
    salary: "$80,000 - $145,000",
    growth: "+35%",
    skills: ["Network Security", "Penetration Testing", "SIEM", "Compliance"],
    color: "from-destructive to-destructive/70",
  },
  {
    id: 5,
    icon: Cloud,
    title: "Cloud Solutions Architect",
    description: "Design scalable cloud infrastructure solutions",
    match: 75,
    salary: "$120,000 - $200,000",
    growth: "+30%",
    skills: ["AWS", "Azure", "Kubernetes", "Terraform"],
    color: "from-success to-success/70",
  },
  {
    id: 6,
    icon: Server,
    title: "DevOps Engineer",
    description: "Streamline development and operations processes",
    match: 72,
    salary: "$90,000 - $160,000",
    growth: "+28%",
    skills: ["Docker", "CI/CD", "Jenkins", "Monitoring"],
    color: "from-chart-5 to-chart-5/70",
  },
];

function getMatchColor(match: number) {
  if (match >= 85) return "text-success";
  if (match >= 70) return "text-warning";
  return "text-destructive";
}

const Recommendations = () => {
  return (
    <DashboardLayout
      title="AI Recommendations"
      subtitle="Career paths tailored to your profile"
    >
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-xl gradient-cta p-6 text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Great job, Adil! 🎉</h2>
            <p className="text-primary-foreground/80">
              Based on your assessment, we've found 12 career paths that match your profile.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">85%</p>
              <p className="text-xs text-primary-foreground/70">Overall Match Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-primary-foreground/70">Career Matches</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Career Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {careers.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-xl border border-border bg-card overflow-hidden card-shadow hover:card-shadow-lg transition-shadow"
          >
            {/* Match Badge */}
            <div className="absolute right-4 top-4 z-10">
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-3 py-1",
                  getMatchColor(career.match)
                )}
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-bold">{career.match}%</span>
              </div>
            </div>

            {/* Icon Header */}
            <div className={cn("h-24 bg-gradient-to-br flex items-center justify-center", career.color)}>
              <career.icon className="h-12 w-12 text-white" />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {career.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {career.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{career.salary}</span>
                </div>
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{career.growth} growth</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Key Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
