import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { toast } from "sonner";
import { quizAPI, QuizQuestion } from "@/services/api";
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

const skillsList = [
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "SQL",
  "Git",
  "Problem Solving",
  "System Design",
];

interface SkillRating {
  [key: string]: number;
}

interface QuizAnswers {
  selectedInterests: string[];
  selectedDomains: string[];
  skillRatings: SkillRating;
  workStyle: {
    taskPreference?: string;
    teamPreference?: string;
    problemApproach?: string;
  };
  careerGoal?: string;
  industryPreference?: string;
}

const Assessment = () => {
  const navigate = useNavigate();
  const { updateQuizStatus } = useQuiz();
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswers>({
    selectedInterests: [],
    selectedDomains: [],
    skillRatings: {},
    workStyle: {},
  });

  useEffect(() => {
    // Load backend quiz questions and saved progress
    const loadQuiz = async () => {
      setIsLoading(true);
      try {
        const { data } = await quizAPI.getQuestions();
        setQuizQuestions(data);
        
        // Load saved local progress
        const savedState = localStorage.getItem("quizAnswers");
        if (savedState) {
          setAnswers(JSON.parse(savedState));
        }
      } catch (error: any) {
        console.error("Failed to load quiz questions:", error);
        toast.error("Failed to load quiz questions");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
    updateQuizStatus("in-progress");
  }, []);

  const progress = ((currentSection + 1) / sections.length) * 100;

  const toggleInterest = (id: string) => {
    setAnswers((prev) => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(id)
        ? prev.selectedInterests.filter((i) => i !== id)
        : [...prev.selectedInterests, id],
    }));
  };

  const toggleDomain = (id: string) => {
    setAnswers((prev) => ({
      ...prev,
      selectedDomains: prev.selectedDomains.includes(id)
        ? prev.selectedDomains.filter((i) => i !== id)
        : [...prev.selectedDomains, id],
    }));
  };

  const updateSkillRating = (skill: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      skillRatings: { ...prev.skillRatings, [skill]: value },
    }));
  };

  const handleSaveAndExit = () => {
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    toast.success("Progress saved!");
    navigate("/");
  };

  const handleNext = () => {
    // Validation
    if (currentSection === 1 && answers.selectedInterests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }
    if (currentSection === 1 && answers.selectedDomains.length === 0) {
      toast.error("Please select at least one domain");
      return;
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
      localStorage.setItem("quizAnswers", JSON.stringify(answers));
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Convert frontend answers to backend format
      const submissionData = {
        answers: quizQuestions.map((question) => {
          // Map frontend answers to question IDs
          // For now, use the first answer option as a placeholder
          // This should be enhanced based on actual answer mapping logic
          return {
            question_id: question.id,
            answer_id: question.answers[0]?.id || 1
          };
        })
      };

      await quizAPI.submitQuiz(submissionData);
      localStorage.removeItem("quizAnswers");
      updateQuizStatus("completed");
      toast.success("Assessment completed! Generating your recommendations...");
      navigate("/recommendations");
    } catch (error: any) {
      console.error("Failed to submit quiz:", error);
      toast.error(error.response?.data?.detail || "Failed to submit assessment");
    } finally {
      setIsSubmitting(false);
    }
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
            <Button variant="outline" size="sm" onClick={handleSaveAndExit}>
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
                          "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                          answers.selectedInterests.includes(option.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-3xl">{option.icon}</span>
                        <span className="text-sm font-medium text-foreground text-center">
                          {option.label}
                        </span>
                        {answers.selectedInterests.includes(option.id) && (
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
                          answers.selectedDomains.length >= 3 &&
                          !answers.selectedDomains.includes(option.id)
                        }
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                          answers.selectedDomains.includes(option.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                          answers.selectedDomains.length >= 3 &&
                            !answers.selectedDomains.includes(option.id) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className={cn("h-3 w-3 rounded-full", option.color)} />
                        <span className="text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                        {answers.selectedDomains.includes(option.id) && (
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
                    Move the slider to indicate your proficiency level (0 = Beginner, 100 = Expert)
                  </p>
                </div>

                {skillsList.map((skill) => {
                  const value = answers.skillRatings[skill] || 50;
                  const getLevel = (val: number) => {
                    if (val < 25) return "Beginner";
                    if (val < 50) return "Novice";
                    if (val < 75) return "Intermediate";
                    return "Advanced";
                  };

                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{skill}</span>
                        <span className="text-xs text-muted-foreground">{getLevel(value)}</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(vals) => updateSkillRating(skill, vals[0])}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  );
                })}
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

                <div className="space-y-6">
                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">You enjoy tasks that are:</p>
                    <RadioGroup
                      value={answers.workStyle.taskPreference}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          workStyle: { ...prev.workStyle, taskPreference: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="structured" id="structured" />
                        <Label htmlFor="structured" className="flex-1 cursor-pointer">
                          Structured and planned
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="exploratory" id="exploratory" />
                        <Label htmlFor="exploratory" className="flex-1 cursor-pointer">
                          Exploratory and experimental
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">You prefer working:</p>
                    <RadioGroup
                      value={answers.workStyle.teamPreference}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          workStyle: { ...prev.workStyle, teamPreference: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="alone" id="alone" />
                        <Label htmlFor="alone" className="flex-1 cursor-pointer">
                          Alone
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="team" id="team" />
                        <Label htmlFor="team" className="flex-1 cursor-pointer">
                          In a team
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">
                      When solving a problem, you:
                    </p>
                    <RadioGroup
                      value={answers.workStyle.problemApproach}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          workStyle: { ...prev.workStyle, problemApproach: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="logic" id="logic" />
                        <Label htmlFor="logic" className="flex-1 cursor-pointer">
                          Focus on logic first
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="ux" id="ux" />
                        <Label htmlFor="ux" className="flex-1 cursor-pointer">
                          Focus on user experience first
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
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
                    {[
                      "High-paying job",
                      "Research-based career",
                      "Startup / Entrepreneurship",
                      "Work-life balance",
                    ].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setAnswers((prev) => ({ ...prev, careerGoal: goal }))}
                        className={cn(
                          "rounded-lg border-2 p-4 text-sm font-medium transition-all",
                          answers.careerGoal === goal
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Preferred industry:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["Tech companies", "Freelancing", "Government", "Academia"].map(
                      (industry) => (
                        <button
                          key={industry}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, industryPreference: industry }))
                          }
                          className={cn(
                            "rounded-lg border-2 p-4 text-sm font-medium transition-all",
                            answers.industryPreference === industry
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                          )}
                        >
                          {industry}
                        </button>
                      )
                    )}
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
            onClick={handleNext}
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
