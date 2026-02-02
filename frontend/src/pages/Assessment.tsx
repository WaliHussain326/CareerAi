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
import { onboardingAPI, quizAPI, QuizQuestion } from "@/services/api";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  Heart,
  Wrench,
  Brain,
  Save,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "background", title: "Academic Background", icon: BookOpen },
  { id: "interests", title: "Interest Mapping", icon: Heart },
  { id: "skills", title: "Skill Assessment", icon: Wrench },
  { id: "personality", title: "Personality Traits", icon: Brain },
  { id: "workstyle", title: "Work Preferences", icon: Brain },
  { id: "goals", title: "Career Goals", icon: Target },
];

const getInterestOptions = (field: string) => {
  const fieldMap: Record<string, { id: string; label: string; icon: string }[]> = {
    "Computer Science": [
      { id: "building", label: "Building Applications", icon: "🏗️" },
      { id: "algorithms", label: "Solving Algorithms", icon: "🧮" },
      { id: "data", label: "Working with Data", icon: "📊" },
      { id: "systems", label: "Designing Systems", icon: "⚙️" },
      { id: "research", label: "Research & Innovation", icon: "🔬" },
      { id: "security", label: "Security & Privacy", icon: "🔐" },
    ],
    "Software Engineering": [
      { id: "frontend", label: "Frontend Engineering", icon: "🎨" },
      { id: "backend", label: "Backend Systems", icon: "🧠" },
      { id: "testing", label: "Testing & QA", icon: "🧪" },
      { id: "devops", label: "DevOps Automation", icon: "⚙️" },
      { id: "architecture", label: "System Architecture", icon: "🏗️" },
      { id: "security", label: "Secure Development", icon: "🔐" },
    ],
    "Information Technology": [
      { id: "support", label: "IT Support", icon: "🛠️" },
      { id: "network", label: "Networking", icon: "🌐" },
      { id: "infra", label: "Infrastructure", icon: "🏢" },
      { id: "security", label: "Security", icon: "🔐" },
      { id: "cloud", label: "Cloud Systems", icon: "☁️" },
      { id: "automation", label: "Automation", icon: "🤖" },
    ],
    "Data Science": [
      { id: "analysis", label: "Data Analysis", icon: "📈" },
      { id: "ml", label: "Machine Learning", icon: "🤖" },
      { id: "viz", label: "Data Visualization", icon: "📊" },
      { id: "research", label: "Research", icon: "🔬" },
      { id: "engineering", label: "Data Engineering", icon: "🏗️" },
      { id: "ai", label: "AI Systems", icon: "🧠" },
    ],
    "Accounting": [
      { id: "reporting", label: "Financial Reporting", icon: "🧾" },
      { id: "tax", label: "Taxation", icon: "📑" },
      { id: "audit", label: "Auditing", icon: "🔎" },
      { id: "forensic", label: "Forensic Accounting", icon: "🕵️" },
      { id: "compliance", label: "Compliance", icon: "✅" },
      { id: "analysis", label: "Financial Analysis", icon: "📊" },
    ],
    "Finance": [
      { id: "invest", label: "Investment Analysis", icon: "📈" },
      { id: "risk", label: "Risk Management", icon: "⚠️" },
      { id: "banking", label: "Banking", icon: "🏦" },
      { id: "markets", label: "Capital Markets", icon: "💹" },
      { id: "planning", label: "Financial Planning", icon: "🧭" },
      { id: "fintech", label: "FinTech", icon: "💳" },
    ],
    "Business Administration": [
      { id: "strategy", label: "Strategy", icon: "♟️" },
      { id: "ops", label: "Operations", icon: "⚙️" },
      { id: "marketing", label: "Marketing", icon: "📣" },
      { id: "people", label: "People Management", icon: "👥" },
      { id: "product", label: "Product", icon: "📦" },
      { id: "analytics", label: "Business Analytics", icon: "📊" },
    ],
    "Marketing": [
      { id: "brand", label: "Brand Strategy", icon: "🎯" },
      { id: "digital", label: "Digital Marketing", icon: "💻" },
      { id: "content", label: "Content", icon: "✍️" },
      { id: "growth", label: "Growth", icon: "🚀" },
      { id: "research", label: "Market Research", icon: "🔎" },
      { id: "social", label: "Social Media", icon: "📱" },
    ],
  };

  return (
    fieldMap[field] || [
      { id: "problem", label: "Problem Solving", icon: "🧩" },
      { id: "research", label: "Research & Innovation", icon: "🔬" },
      { id: "analysis", label: "Data Analysis", icon: "📊" },
      { id: "leadership", label: "Leadership", icon: "🧭" },
      { id: "collaboration", label: "Collaboration", icon: "🤝" },
      { id: "communication", label: "Communication", icon: "🗣️" },
    ]
  );
};

const getDomainOptions = (field: string) => {
  const fieldMap: Record<string, { id: string; label: string; color: string }[]> = {
    "Computer Science": [
      { id: "web", label: "Web Development", color: "bg-primary" },
      { id: "mobile", label: "Mobile Apps", color: "bg-accent" },
      { id: "ai", label: "Artificial Intelligence", color: "bg-warning" },
      { id: "security", label: "Cyber Security", color: "bg-destructive" },
      { id: "games", label: "Game Development", color: "bg-success" },
      { id: "cloud", label: "Cloud & DevOps", color: "bg-chart-5" },
    ],
    "Software Engineering": [
      { id: "frontend", label: "Frontend", color: "bg-primary" },
      { id: "backend", label: "Backend", color: "bg-accent" },
      { id: "devops", label: "DevOps", color: "bg-chart-5" },
      { id: "mobile", label: "Mobile", color: "bg-warning" },
      { id: "qa", label: "QA & Testing", color: "bg-success" },
      { id: "security", label: "Secure Systems", color: "bg-destructive" },
    ],
    "Information Technology": [
      { id: "infra", label: "Infrastructure", color: "bg-primary" },
      { id: "network", label: "Networking", color: "bg-accent" },
      { id: "cloud", label: "Cloud", color: "bg-chart-5" },
      { id: "security", label: "Security", color: "bg-destructive" },
      { id: "support", label: "IT Support", color: "bg-success" },
      { id: "automation", label: "Automation", color: "bg-warning" },
    ],
    "Data Science": [
      { id: "analysis", label: "Analytics", color: "bg-primary" },
      { id: "ml", label: "Machine Learning", color: "bg-accent" },
      { id: "engineering", label: "Data Engineering", color: "bg-warning" },
      { id: "ai", label: "AI Products", color: "bg-chart-5" },
      { id: "research", label: "Research", color: "bg-success" },
      { id: "viz", label: "Visualization", color: "bg-destructive" },
    ],
    "Accounting": [
      { id: "audit", label: "Audit & Assurance", color: "bg-primary" },
      { id: "tax", label: "Tax", color: "bg-accent" },
      { id: "reporting", label: "Reporting", color: "bg-warning" },
      { id: "forensic", label: "Forensic", color: "bg-destructive" },
      { id: "compliance", label: "Compliance", color: "bg-success" },
      { id: "analysis", label: "Financial Analysis", color: "bg-chart-5" },
    ],
    "Finance": [
      { id: "banking", label: "Banking", color: "bg-primary" },
      { id: "invest", label: "Investments", color: "bg-accent" },
      { id: "risk", label: "Risk", color: "bg-destructive" },
      { id: "planning", label: "Financial Planning", color: "bg-success" },
      { id: "markets", label: "Capital Markets", color: "bg-warning" },
      { id: "fintech", label: "FinTech", color: "bg-chart-5" },
    ],
    "Business Administration": [
      { id: "strategy", label: "Strategy", color: "bg-primary" },
      { id: "ops", label: "Operations", color: "bg-accent" },
      { id: "marketing", label: "Marketing", color: "bg-warning" },
      { id: "product", label: "Product", color: "bg-success" },
      { id: "people", label: "People Ops", color: "bg-destructive" },
      { id: "analytics", label: "Business Analytics", color: "bg-chart-5" },
    ],
    "Marketing": [
      { id: "brand", label: "Brand", color: "bg-primary" },
      { id: "digital", label: "Digital", color: "bg-accent" },
      { id: "content", label: "Content", color: "bg-warning" },
      { id: "growth", label: "Growth", color: "bg-success" },
      { id: "research", label: "Research", color: "bg-destructive" },
      { id: "social", label: "Social", color: "bg-chart-5" },
    ],
  };

  return (
    fieldMap[field] || [
      { id: "strategy", label: "Strategy", color: "bg-primary" },
      { id: "analysis", label: "Analysis", color: "bg-accent" },
      { id: "operations", label: "Operations", color: "bg-warning" },
      { id: "research", label: "Research", color: "bg-success" },
      { id: "communication", label: "Communication", color: "bg-chart-5" },
      { id: "leadership", label: "Leadership", color: "bg-destructive" },
    ]
  );
};

// Dynamic skill lists based on field of study
const getSkillsList = (field: string) => {
  const fieldMap: Record<string, string[]> = {
    "Computer Science": [
      "Programming", "Data Structures", "Algorithms", "Problem Solving",
      "Database Management", "Software Design", "Critical Thinking", "Communication"
    ],
    "Software Engineering": [
      "Software Development", "Version Control", "Testing", "System Design",
      "Code Review", "Debugging", "Documentation", "Agile/Scrum"
    ],
    "Information Technology": [
      "Network Administration", "System Administration", "Troubleshooting",
      "Security Practices", "Cloud Services", "Technical Support", "Documentation", "Communication"
    ],
    "Data Science": [
      "Statistical Analysis", "Data Visualization", "Machine Learning Basics",
      "Data Cleaning", "Python/R", "SQL", "Critical Thinking", "Communication"
    ],
    "Accounting": [
      "Financial Reporting", "Tax Preparation", "Bookkeeping", "Compliance",
      "Excel/Spreadsheets", "Attention to Detail", "Organization", "Communication"
    ],
    "Finance": [
      "Financial Analysis", "Risk Assessment", "Investment Analysis", "Financial Modeling",
      "Excel/Spreadsheets", "Market Research", "Presentation", "Critical Thinking"
    ],
    "Business Administration": [
      "Project Management", "Strategic Planning", "Leadership", "Problem Solving",
      "Communication", "Presentation", "Analytical Thinking", "Teamwork"
    ],
    "Marketing": [
      "Market Research", "Content Creation", "Social Media", "Analytics",
      "Communication", "Creativity", "Strategic Thinking", "Presentation"
    ],
    "Electrical Engineering": [
      "Circuit Analysis", "Electronics", "Power Systems", "Control Systems",
      "Problem Solving", "Technical Drawing", "Mathematics", "Communication"
    ],
    "Mechanical Engineering": [
      "CAD/CAM", "Thermodynamics", "Material Science", "Manufacturing Processes",
      "Problem Solving", "Technical Drawing", "Mathematics", "Project Management"
    ],
    "Civil Engineering": [
      "Structural Analysis", "Construction Management", "Surveying", "AutoCAD",
      "Project Management", "Technical Writing", "Mathematics", "Communication"
    ],
    "Psychology": [
      "Research Methods", "Statistical Analysis", "Counseling Skills", "Assessment",
      "Communication", "Empathy", "Critical Thinking", "Documentation"
    ],
    "Economics": [
      "Economic Analysis", "Statistical Methods", "Data Analysis", "Research",
      "Excel/Spreadsheets", "Writing", "Critical Thinking", "Presentation"
    ],
    "Human Resources": [
      "Recruitment", "Employee Relations", "Compliance", "Training & Development",
      "Communication", "Organization", "Conflict Resolution", "HRIS Systems"
    ],
  };

  return (
    fieldMap[field] || [
      "Research", "Analysis", "Communication", "Problem Solving",
      "Organization", "Teamwork", "Critical Thinking", "Time Management"
    ]
  );
};

interface SkillRating {
  [key: string]: number;
}

interface OnboardingInfo {
  education_level?: string;
  field_of_study?: string;
  institution?: string;
  graduation_year?: number;
  current_role?: string;
  years_of_experience?: number;
  technical_skills?: string[];
  soft_skills?: string[];
  interests?: string[];
}

interface QuizAnswers {
  selectedInterests: string[];
  selectedDomains: string[];
  skillRatings: SkillRating;
  workStyle: {
    taskPreference?: string;
    teamPreference?: string;
    problemApproach?: string;
    workEnvironment?: string;
    workHours?: string;
    communicationStyle?: string;
  };
  personality: {
    decisionMaking?: string;
    stressHandling?: string;
    learningStyle?: string;
    riskTolerance?: string;
    leadership?: string;
    detailOrientation?: string;
  };
  goals: {
    shortTermGoal?: string;
    longTermGoal?: string;
    priorityFactor?: string;
    industryPreference?: string;
    growthPreference?: string;
  };
}

const Assessment = () => {
  const navigate = useNavigate();
  const { updateQuizStatus } = useQuiz();
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [fieldOfStudy, setFieldOfStudy] = useState<string>("");
  const [onboardingInfo, setOnboardingInfo] = useState<OnboardingInfo>({});
  const [answers, setAnswers] = useState<QuizAnswers>({
    selectedInterests: [],
    selectedDomains: [],
    skillRatings: {},
    workStyle: {},
    personality: {},
    goals: {},
  });

  useEffect(() => {
    // Load backend quiz questions and saved progress
    const loadQuiz = async () => {
      setIsLoading(true);
      try {
        const { data } = await quizAPI.getQuestions();
        setQuizQuestions(data);

        try {
          const { data: onboarding } = await onboardingAPI.get();
          console.log("Onboarding data loaded:", onboarding);
          if (onboarding && onboarding.is_completed) {
            setOnboardingInfo({
              education_level: onboarding.education_level || undefined,
              field_of_study: onboarding.field_of_study || undefined,
              institution: onboarding.institution || undefined,
              graduation_year: onboarding.graduation_year || undefined,
              current_role: onboarding.current_role || undefined,
              years_of_experience: onboarding.years_of_experience || undefined,
              technical_skills: onboarding.technical_skills || [],
              soft_skills: onboarding.soft_skills || [],
              interests: onboarding.interests || [],
            });
            if (onboarding.field_of_study) {
              setFieldOfStudy(onboarding.field_of_study);
            }
          }
        } catch (error) {
          console.error("Failed to load onboarding data:", error);
          // Onboarding may not be completed yet
        }
        
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

  useEffect(() => {
    if (!fieldOfStudy) return;
    setAnswers((prev) => ({
      ...prev,
      selectedInterests: [],
      selectedDomains: [],
    }));
  }, [fieldOfStudy]);

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
    // Validation based on current section
    if (currentSection === 1 && answers.selectedInterests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }
    if (currentSection === 1 && answers.selectedDomains.length === 0) {
      toast.error("Please select at least one domain");
      return;
    }
    if (currentSection === 2 && Object.keys(answers.skillRatings).length < 4) {
      toast.error("Please rate at least 4 skills");
      return;
    }
    if (currentSection === 3) {
      const personalityAnswers = Object.values(answers.personality).filter(Boolean);
      if (personalityAnswers.length < 3) {
        toast.error("Please answer at least 3 personality questions");
        return;
      }
    }
    if (currentSection === 4) {
      const workStyleAnswers = Object.values(answers.workStyle).filter(Boolean);
      if (workStyleAnswers.length < 3) {
        toast.error("Please answer at least 3 work preference questions");
        return;
      }
    }
    if (currentSection === 5) {
      const goalAnswers = Object.values(answers.goals).filter(Boolean);
      if (goalAnswers.length < 2) {
        toast.error("Please answer at least 2 goal questions");
        return;
      }
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
                    {getInterestOptions(fieldOfStudy).map((option) => (
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
                    {getDomainOptions(fieldOfStudy).map((option) => (
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
                    This information is from your profile. If anything is incorrect, please update your onboarding profile.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Education Level</p>
                    <p className="font-medium text-foreground">{onboardingInfo.education_level || "Not specified"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Field of Study</p>
                    <p className="font-medium text-foreground">{onboardingInfo.field_of_study || "Not specified"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Institution</p>
                    <p className="font-medium text-foreground">{onboardingInfo.institution || "Not specified"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Graduation Year</p>
                    <p className="font-medium text-foreground">{onboardingInfo.graduation_year || "Not specified"}</p>
                  </div>
                </div>

                {onboardingInfo.current_role && (
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Current Role</p>
                    <p className="font-medium text-foreground">
                      {onboardingInfo.current_role}
                      {onboardingInfo.years_of_experience && ` • ${onboardingInfo.years_of_experience} years experience`}
                    </p>
                  </div>
                )}

                {onboardingInfo.technical_skills && onboardingInfo.technical_skills.length > 0 && (
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-2">Technical Skills from Profile</p>
                    <div className="flex flex-wrap gap-2">
                      {onboardingInfo.technical_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingInfo.soft_skills && onboardingInfo.soft_skills.length > 0 && (
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-2">Soft Skills from Profile</p>
                    <div className="flex flex-wrap gap-2">
                      {onboardingInfo.soft_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingInfo.interests && onboardingInfo.interests.length > 0 && (
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-2">Interests from Profile</p>
                    <div className="flex flex-wrap gap-2">
                      {onboardingInfo.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!onboardingInfo.field_of_study && (
                  <div className="rounded-lg border border-warning/50 bg-warning/5 p-4">
                    <p className="text-sm text-warning-foreground">
                      ⚠️ Please complete your onboarding profile first to get personalized assessment questions.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigate("/onboarding")}
                    >
                      Complete Onboarding
                    </Button>
                  </div>
                )}
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

                {getSkillsList(fieldOfStudy).map((skill) => {
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
                    Personality Traits
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Help us understand your personality to find the best career fit
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">How do you typically make decisions?</p>
                    <RadioGroup
                      value={answers.personality.decisionMaking}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          personality: { ...prev.personality, decisionMaking: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="analytical" id="analytical" />
                        <Label htmlFor="analytical" className="flex-1 cursor-pointer">
                          Analytical - I gather data and analyze thoroughly
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="intuitive" id="intuitive" />
                        <Label htmlFor="intuitive" className="flex-1 cursor-pointer">
                          Intuitive - I trust my gut feeling
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="collaborative" id="collaborative" />
                        <Label htmlFor="collaborative" className="flex-1 cursor-pointer">
                          Collaborative - I seek input from others
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="quick" id="quick" />
                        <Label htmlFor="quick" className="flex-1 cursor-pointer">
                          Quick - I decide fast and adapt as needed
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">How do you handle stressful situations?</p>
                    <RadioGroup
                      value={answers.personality.stressHandling}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          personality: { ...prev.personality, stressHandling: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="calm" id="calm" />
                        <Label htmlFor="calm" className="flex-1 cursor-pointer">
                          Stay calm and methodical
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="energized" id="energized" />
                        <Label htmlFor="energized" className="flex-1 cursor-pointer">
                          Get energized and focused
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="support" id="support" />
                        <Label htmlFor="support" className="flex-1 cursor-pointer">
                          Seek support from colleagues
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="break" id="break" />
                        <Label htmlFor="break" className="flex-1 cursor-pointer">
                          Take a break to clear my mind
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">What's your preferred learning style?</p>
                    <RadioGroup
                      value={answers.personality.learningStyle}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          personality: { ...prev.personality, learningStyle: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="visual" id="visual" />
                        <Label htmlFor="visual" className="flex-1 cursor-pointer">
                          Visual - I learn best through diagrams and videos
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="reading" id="reading" />
                        <Label htmlFor="reading" className="flex-1 cursor-pointer">
                          Reading - I prefer documentation and articles
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="handson" id="handson" />
                        <Label htmlFor="handson" className="flex-1 cursor-pointer">
                          Hands-on - I learn by doing and experimenting
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="discussion" id="discussion" />
                        <Label htmlFor="discussion" className="flex-1 cursor-pointer">
                          Discussion - I learn through conversations
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">How comfortable are you with taking risks?</p>
                    <RadioGroup
                      value={answers.personality.riskTolerance}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          personality: { ...prev.personality, riskTolerance: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="high" id="high-risk" />
                        <Label htmlFor="high-risk" className="flex-1 cursor-pointer">
                          Very comfortable - I embrace calculated risks
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="moderate" id="moderate-risk" />
                        <Label htmlFor="moderate-risk" className="flex-1 cursor-pointer">
                          Moderate - I take risks when benefits are clear
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="low" id="low-risk" />
                        <Label htmlFor="low-risk" className="flex-1 cursor-pointer">
                          Prefer stability - I favor proven approaches
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">Do you see yourself as a leader?</p>
                    <RadioGroup
                      value={answers.personality.leadership}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          personality: { ...prev.personality, leadership: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="natural" id="natural-leader" />
                        <Label htmlFor="natural-leader" className="flex-1 cursor-pointer">
                          Yes, I naturally take charge
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="situational" id="situational-leader" />
                        <Label htmlFor="situational-leader" className="flex-1 cursor-pointer">
                          When needed, I can lead effectively
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="contributor" id="contributor" />
                        <Label htmlFor="contributor" className="flex-1 cursor-pointer">
                          I prefer being a strong team contributor
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="independent" id="independent" />
                        <Label htmlFor="independent" className="flex-1 cursor-pointer">
                          I work best independently
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">How detail-oriented are you?</p>
                    <RadioGroup
                      value={answers.personality.detailOrientation}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          personality: { ...prev.personality, detailOrientation: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="very" id="very-detail" />
                        <Label htmlFor="very-detail" className="flex-1 cursor-pointer">
                          Very detail-oriented - I catch every small issue
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="balanced" id="balanced-detail" />
                        <Label htmlFor="balanced-detail" className="flex-1 cursor-pointer">
                          Balanced - I focus on important details
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="bigpicture" id="bigpicture" />
                        <Label htmlFor="bigpicture" className="flex-1 cursor-pointer">
                          Big-picture focused - I delegate details
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
                    Work Preferences
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Tell us about your ideal work environment
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
                        <RadioGroupItem value="structured" id="structured-task" />
                        <Label htmlFor="structured-task" className="flex-1 cursor-pointer">
                          Structured and planned
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="exploratory" id="exploratory-task" />
                        <Label htmlFor="exploratory-task" className="flex-1 cursor-pointer">
                          Exploratory and experimental
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="mixed" id="mixed-task" />
                        <Label htmlFor="mixed-task" className="flex-1 cursor-pointer">
                          A mix of both
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
                        <RadioGroupItem value="alone" id="alone-team" />
                        <Label htmlFor="alone-team" className="flex-1 cursor-pointer">
                          Independently
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="small-team" id="small-team" />
                        <Label htmlFor="small-team" className="flex-1 cursor-pointer">
                          In a small team (2-5 people)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="large-team" id="large-team" />
                        <Label htmlFor="large-team" className="flex-1 cursor-pointer">
                          In a large collaborative team
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="flexible" id="flexible-team" />
                        <Label htmlFor="flexible-team" className="flex-1 cursor-pointer">
                          Flexible - depends on the project
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">Preferred work environment:</p>
                    <RadioGroup
                      value={answers.workStyle.workEnvironment}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          workStyle: { ...prev.workStyle, workEnvironment: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="office" id="office" />
                        <Label htmlFor="office" className="flex-1 cursor-pointer">
                          Office - I like the structure and social aspects
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="remote" id="remote" />
                        <Label htmlFor="remote" className="flex-1 cursor-pointer">
                          Remote - I value flexibility and focus
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="hybrid" id="hybrid" />
                        <Label htmlFor="hybrid" className="flex-1 cursor-pointer">
                          Hybrid - Best of both worlds
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="field" id="field" />
                        <Label htmlFor="field" className="flex-1 cursor-pointer">
                          Field work - I like being on the move
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">Preferred work hours:</p>
                    <RadioGroup
                      value={answers.workStyle.workHours}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          workStyle: { ...prev.workStyle, workHours: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="traditional" id="traditional" />
                        <Label htmlFor="traditional" className="flex-1 cursor-pointer">
                          Traditional 9-5
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="flexible" id="flexible-hours" />
                        <Label htmlFor="flexible-hours" className="flex-1 cursor-pointer">
                          Flexible hours
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="shift" id="shift" />
                        <Label htmlFor="shift" className="flex-1 cursor-pointer">
                          Shift-based / Night shifts okay
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="project" id="project-hours" />
                        <Label htmlFor="project-hours" className="flex-1 cursor-pointer">
                          Project-based (intense periods, then breaks)
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
                        <RadioGroupItem value="logic" id="logic-problem" />
                        <Label htmlFor="logic-problem" className="flex-1 cursor-pointer">
                          Focus on logic and data first
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="creative" id="creative-problem" />
                        <Label htmlFor="creative-problem" className="flex-1 cursor-pointer">
                          Explore creative solutions
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="collaborative" id="collaborative-problem" />
                        <Label htmlFor="collaborative-problem" className="flex-1 cursor-pointer">
                          Brainstorm with others
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="research" id="research-problem" />
                        <Label htmlFor="research-problem" className="flex-1 cursor-pointer">
                          Research existing solutions first
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">Your communication style is:</p>
                    <RadioGroup
                      value={answers.workStyle.communicationStyle}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          workStyle: { ...prev.workStyle, communicationStyle: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="direct" id="direct" />
                        <Label htmlFor="direct" className="flex-1 cursor-pointer">
                          Direct and to the point
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="diplomatic" id="diplomatic" />
                        <Label htmlFor="diplomatic" className="flex-1 cursor-pointer">
                          Diplomatic and considerate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed" className="flex-1 cursor-pointer">
                          Detailed and thorough
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="casual" id="casual" />
                        <Label htmlFor="casual" className="flex-1 cursor-pointer">
                          Casual and friendly
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium text-foreground">
                    Career Goals
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Help us understand your career aspirations
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">What's your short-term career goal (1-2 years)?</p>
                    <RadioGroup
                      value={answers.goals.shortTermGoal}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          goals: { ...prev.goals, shortTermGoal: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="firstjob" id="firstjob" />
                        <Label htmlFor="firstjob" className="flex-1 cursor-pointer">
                          Land my first job in my field
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="switch" id="switch" />
                        <Label htmlFor="switch" className="flex-1 cursor-pointer">
                          Switch to a new career path
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="grow" id="grow" />
                        <Label htmlFor="grow" className="flex-1 cursor-pointer">
                          Grow skills in my current role
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="promotion" id="promotion" />
                        <Label htmlFor="promotion" className="flex-1 cursor-pointer">
                          Get a promotion or raise
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="explore" id="explore" />
                        <Label htmlFor="explore" className="flex-1 cursor-pointer">
                          Explore different options
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">What's your long-term career aspiration (5-10 years)?</p>
                    <RadioGroup
                      value={answers.goals.longTermGoal}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          goals: { ...prev.goals, longTermGoal: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="expert" id="expert" />
                        <Label htmlFor="expert" className="flex-1 cursor-pointer">
                          Become a subject matter expert
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="leader" id="leader" />
                        <Label htmlFor="leader" className="flex-1 cursor-pointer">
                          Lead teams or departments
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="entrepreneur" id="entrepreneur" />
                        <Label htmlFor="entrepreneur" className="flex-1 cursor-pointer">
                          Start my own business
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="executive" id="executive" />
                        <Label htmlFor="executive" className="flex-1 cursor-pointer">
                          Reach executive level
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="balance" id="balance" />
                        <Label htmlFor="balance" className="flex-1 cursor-pointer">
                          Achieve good work-life balance
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="impact" id="impact" />
                        <Label htmlFor="impact" className="flex-1 cursor-pointer">
                          Make meaningful social impact
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">What's most important to you in a career?</p>
                    <RadioGroup
                      value={answers.goals.priorityFactor}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          goals: { ...prev.goals, priorityFactor: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="compensation" id="compensation" />
                        <Label htmlFor="compensation" className="flex-1 cursor-pointer">
                          Competitive compensation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="growth" id="growth-factor" />
                        <Label htmlFor="growth-factor" className="flex-1 cursor-pointer">
                          Growth and learning opportunities
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="stability" id="stability" />
                        <Label htmlFor="stability" className="flex-1 cursor-pointer">
                          Job stability and security
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="flexibility" id="flexibility-factor" />
                        <Label htmlFor="flexibility-factor" className="flex-1 cursor-pointer">
                          Flexibility and autonomy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="purpose" id="purpose" />
                        <Label htmlFor="purpose" className="flex-1 cursor-pointer">
                          Meaningful and purposeful work
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">Which industry/sector interests you most?</p>
                    <RadioGroup
                      value={answers.goals.industryPreference}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          goals: { ...prev.goals, industryPreference: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="tech" id="tech" />
                        <Label htmlFor="tech" className="flex-1 cursor-pointer">
                          Technology / Software
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="finance" id="finance-industry" />
                        <Label htmlFor="finance-industry" className="flex-1 cursor-pointer">
                          Finance / Banking
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="healthcare" id="healthcare" />
                        <Label htmlFor="healthcare" className="flex-1 cursor-pointer">
                          Healthcare / Medical
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="consulting" id="consulting" />
                        <Label htmlFor="consulting" className="flex-1 cursor-pointer">
                          Consulting / Professional Services
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="government" id="government" />
                        <Label htmlFor="government" className="flex-1 cursor-pointer">
                          Government / Public Sector
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="startup" id="startup" />
                        <Label htmlFor="startup" className="flex-1 cursor-pointer">
                          Startups / Entrepreneurship
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="nonprofit" id="nonprofit" />
                        <Label htmlFor="nonprofit" className="flex-1 cursor-pointer">
                          Non-profit / NGO
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="open" id="open" />
                        <Label htmlFor="open" className="flex-1 cursor-pointer">
                          Open to any industry
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-3 font-medium text-foreground">How do you prefer to grow professionally?</p>
                    <RadioGroup
                      value={answers.goals.growthPreference}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          goals: { ...prev.goals, growthPreference: value },
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="vertical" id="vertical" />
                        <Label htmlFor="vertical" className="flex-1 cursor-pointer">
                          Vertical growth - climb the ladder in one area
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="horizontal" id="horizontal" />
                        <Label htmlFor="horizontal" className="flex-1 cursor-pointer">
                          Horizontal growth - explore different roles/areas
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="diagonal" id="diagonal" />
                        <Label htmlFor="diagonal" className="flex-1 cursor-pointer">
                          Diagonal growth - mix of both
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50">
                        <RadioGroupItem value="depth" id="depth" />
                        <Label htmlFor="depth" className="flex-1 cursor-pointer">
                          Deep expertise - become the best at one thing
                        </Label>
                      </div>
                    </RadioGroup>
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
