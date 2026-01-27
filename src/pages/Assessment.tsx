import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  Heart,
  Wrench,
  Brain,
  Target,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "background", title: "Academic Background", icon: BookOpen },
  { id: "interests", title: "Interest Mapping", icon: Heart },
  { id: "skills", title: "Skill Assessment", icon: Wrench },
  { id: "workstyle", title: "Work Style", icon: Brain },
  { id: "preferences", title: "Career Preferences", icon: Target },
];

const interestOptions = [
  { id: "building", label: "Building Applications", icon: "🏗️" },
  { id: "algorithms", label: "Solving Algorithms", icon: "🧮" },
  { id: "data", label: "Working with Data", icon: "📊" },
  { id: "systems", label: "Designing Systems", icon: "⚙️" },
  { id: "research", label: "Research & Innovation", icon: "🔬" },
  { id: "security", label: "Security & Privacy", icon: "🔐" },
];

const domainOptions = [
  { id: "web", label: "Web Development", color: "bg-primary" },
  { id: "mobile", label: "Mobile Apps", color: "bg-accent" },
  { id: "ai", label: "Artificial Intelligence", color: "bg-warning" },
  { id: "security", label: "Cyber Security", color: "bg-destructive" },
  { id: "games", label: "Game Development", color: "bg-success" },
  { id: "cloud", label: "Cloud & DevOps", color: "bg-chart-5" },
];

const Assessment = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const progress = ((currentSection + 1) / sections.length) * 100;

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleDomain = (id: string) => {
    setSelectedDomains((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout title="Career Assessment" subtitle="Discover your ideal career path">
      <div className="mx-auto max-w-4xl">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-border bg-card p-6 card-shadow"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Section {currentSection + 1} of {sections.length}
              </p>
              <h2 className="text-lg font-semibold text-foreground">
                {sections[currentSection].title}
              </h2>
            </div>
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save & Exit
            </Button>
          </div>

          <Progress value={progress} className="h-2" />

          {/* Section tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isCompleted = index < currentSection;
              const isCurrent = index === currentSection;

              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all whitespace-nowrap",
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Question Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-border bg-card p-6 card-shadow"
          >
            {currentSection === 1 && (
              <div className="space-y-8">
                {/* Question 1: Activities */}
                <div>
                  <h3 className="mb-4 text-lg font-medium text-foreground">
                    Which activities excite you the most?
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Select all that apply
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {interestOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleInterest(option.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                          selectedInterests.includes(option.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-3xl">{option.icon}</span>
                        <span className="text-sm font-medium text-foreground text-center">
                          {option.label}
                        </span>
                        {selectedInterests.includes(option.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                          >
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Domains */}
                <div>
                  <h3 className="mb-4 text-lg font-medium text-foreground">
                    Which domains interest you?
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Select up to 3 domains
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {domainOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDomain(option.id)}
                        disabled={
                          selectedDomains.length >= 3 &&
                          !selectedDomains.includes(option.id)
                        }
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                          selectedDomains.includes(option.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                          selectedDomains.length >= 3 &&
                            !selectedDomains.includes(option.id) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className={cn("h-3 w-3 rounded-full", option.color)} />
                        <span className="text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                        {selectedDomains.includes(option.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                          >
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentSection === 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium text-foreground">
                    Academic Background
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    This information is pre-filled from your profile. You can update if needed.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Degree</p>
                    <p className="font-medium text-foreground">BS Computer Science</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Graduation Year</p>
                    <p className="font-medium text-foreground">2024</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">University</p>
                    <p className="font-medium text-foreground">FAST NUCES</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">GPA</p>
                    <p className="font-medium text-foreground">3.5 / 4.0</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">Key Subjects Studied</p>
                  <div className="flex flex-wrap gap-2">
                    {["Data Structures", "Algorithms", "Database Systems", "Web Development", "Machine Learning", "Operating Systems"].map(
                      (subject) => (
                        <span
                          key={subject}
                          className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          {subject}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium text-foreground">
                    Rate Your Skills
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Move the slider to indicate your proficiency level
                  </p>
                </div>

                {["Python", "JavaScript", "React", "Node.js", "SQL", "Git"].map((skill) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{skill}</span>
                      <span className="text-xs text-muted-foreground">Intermediate</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.random() * 40 + 40}%` }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentSection === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium text-foreground">
                    Work Style Preferences
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Choose the option that best describes you
                  </p>
                </div>

                {[
                  {
                    question: "You enjoy tasks that are:",
                    options: ["Structured and planned", "Exploratory and experimental"],
                  },
                  {
                    question: "You prefer working:",
                    options: ["Alone", "In a team"],
                  },
                  {
                    question: "When solving a problem, you:",
                    options: ["Focus on logic first", "Focus on user experience first"],
                  },
                ].map((q, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">{q.question}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((option) => (
                        <button
                          key={option}
                          className="rounded-lg border-2 border-border px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentSection === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium text-foreground">
                    Career Preferences
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    What matters most to you in your career?
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Preferred career goal:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["High-paying job", "Research-based career", "Startup / Entrepreneurship", "Work-life balance"].map(
                      (goal) => (
                        <button
                          key={goal}
                          className="rounded-lg border-2 border-border p-4 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5"
                        >
                          {goal}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Preferred industry:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["Tech companies", "Freelancing", "Government", "Academia"].map((industry) => (
                      <button
                        key={industry}
                        className="rounded-lg border-2 border-border p-4 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5"
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={() =>
              setCurrentSection((prev) => Math.min(sections.length - 1, prev + 1))
            }
            className="gradient-cta text-primary-foreground hover:opacity-90"
          >
            {currentSection === sections.length - 1 ? (
              <>
                Submit
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assessment;
