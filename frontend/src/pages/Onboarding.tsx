import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingAPI } from "@/services/api";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface OnboardingData {
  educationLevel: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  currentStatus: string;
  interests: string[];
}

const steps = [
  { id: 1, title: "Education", icon: GraduationCap },
  { id: 2, title: "Background", icon: BookOpen },
  { id: 3, title: "Status", icon: Briefcase },
  { id: 4, title: "Interests", icon: Heart },
];

const defaultInterestOptions = [
  "Problem Solving",
  "Research & Innovation",
  "Team Collaboration",
  "Leadership",
  "Public Speaking",
  "Project Management",
  "Data Analysis",
  "Design Thinking",
  "Strategy & Planning",
  "Creativity",
];

const interestOptionsByField: Record<string, string[]> = {
  "Computer Science": [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
  ],
  "Information Technology": [
    "Systems Administration",
    "Network Engineering",
    "Cloud Computing",
    "Cybersecurity",
    "IT Support",
    "DevOps",
    "Database Management",
    "IT Project Management",
  ],
  "Software Engineering": [
    "Frontend Engineering",
    "Backend Engineering",
    "Full Stack Development",
    "System Design",
    "DevOps",
    "Testing & QA",
    "Mobile Development",
    "Cloud Platforms",
  ],
  "Data Science": [
    "Data Analysis",
    "Machine Learning",
    "Data Engineering",
    "Statistics",
    "Business Intelligence",
    "AI Research",
    "Data Visualization",
    "MLOps",
  ],
  "Accounting": [
    "Financial Reporting",
    "Taxation",
    "Auditing",
    "Forensic Accounting",
    "Compliance",
    "Payroll",
    "Risk Management",
    "Budgeting",
  ],
  "Finance": [
    "Financial Analysis",
    "Investment Research",
    "Corporate Finance",
    "Risk Management",
    "Banking",
    "Portfolio Management",
    "FinTech",
    "Financial Modeling",
  ],
  "Business Administration": [
    "Operations Management",
    "Marketing Strategy",
    "Human Resources",
    "Product Management",
    "Business Analytics",
    "Entrepreneurship",
    "Sales & Growth",
    "Consulting",
  ],
  "BBA": [
    "Operations Management",
    "Marketing Strategy",
    "Human Resources",
    "Product Management",
    "Business Analytics",
    "Entrepreneurship",
    "Sales & Growth",
    "Consulting",
  ],
  "International Relations": [
    "Policy Analysis",
    "Diplomacy",
    "International Development",
    "Global Security",
    "Research",
    "Public Affairs",
    "NGO Management",
    "Negotiation",
  ],
  "Political Science": [
    "Policy Analysis",
    "Public Administration",
    "Campaign Strategy",
    "Governance",
    "Research",
    "Advocacy",
    "Legal Studies",
    "International Affairs",
  ],
  "Electrical Engineering": [
    "Power Systems",
    "Embedded Systems",
    "Control Systems",
    "Signal Processing",
    "Automation",
    "Renewable Energy",
    "IoT",
    "Circuit Design",
  ],
  "Civil Engineering": [
    "Structural Design",
    "Construction Management",
    "Transportation Planning",
    "Geotechnical Engineering",
    "Environmental Engineering",
    "Project Estimation",
    "Urban Planning",
    "Water Resources",
  ],
  "Mechanical Engineering": [
    "Product Design",
    "Manufacturing",
    "Thermodynamics",
    "Robotics",
    "Automotive Systems",
    "Aerospace Systems",
    "HVAC",
    "Materials Engineering",
  ],
  "Chemical Engineering": [
    "Process Engineering",
    "Quality Control",
    "Petrochemicals",
    "Pharmaceuticals",
    "Energy Systems",
    "Safety & Compliance",
    "Process Optimization",
    "Biochemical Engineering",
  ],
  "Economics": [
    "Economic Research",
    "Data Analysis",
    "Policy Analysis",
    "Financial Markets",
    "Development Economics",
    "Behavioral Economics",
    "Consulting",
    "Public Policy",
  ],
  "Marketing": [
    "Digital Marketing",
    "Brand Strategy",
    "Market Research",
    "Content Strategy",
    "Growth Marketing",
    "Social Media",
    "Product Marketing",
    "Analytics",
  ],
  "Management": [
    "People Management",
    "Operations",
    "Strategy",
    "Project Leadership",
    "Change Management",
    "Business Analytics",
    "Consulting",
    "Entrepreneurship",
  ],
  "Human Resources": [
    "Talent Acquisition",
    "Learning & Development",
    "Employee Relations",
    "HR Analytics",
    "Compensation & Benefits",
    "Culture Building",
    "HR Operations",
    "Compliance",
  ],
  "Psychology": [
    "Behavioral Research",
    "Counseling",
    "Organizational Psychology",
    "Clinical Practice",
    "Human Factors",
    "Assessment",
    "Mental Health",
    "User Research",
  ],
  "Mathematics": [
    "Data Analysis",
    "Quantitative Modeling",
    "Research",
    "Algorithm Design",
    "Statistics",
    "Financial Mathematics",
    "Optimization",
    "Teaching",
  ],
  "Physics": [
    "Research",
    "Data Analysis",
    "Simulation",
    "Quantum Systems",
    "Astrophysics",
    "Instrumentation",
    "Materials Science",
    "Teaching",
  ],
};

const getInterestOptions = (fieldOfStudy: string) =>
  interestOptionsByField[fieldOfStudy] || defaultInterestOptions;

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    educationLevel: "",
    fieldOfStudy: "",
    institution: "",
    graduationYear: "",
    currentStatus: "",
    interests: [],
  });

  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const progress = (currentStep / steps.length) * 100;

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!formData.fieldOfStudy) return;
    setFormData((prev) => ({ ...prev, interests: [] }));
  }, [formData.fieldOfStudy]);

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleNext = () => {
    // Basic validation
    if (currentStep === 1 && !formData.educationLevel) {
      toast.error("Please select your education level");
      return;
    }
    if (currentStep === 2 && (!formData.fieldOfStudy || !formData.institution)) {
      toast.error("Please complete all fields");
      return;
    }
    if (currentStep === 3 && !formData.currentStatus) {
      toast.error("Please select your current status");
      return;
    }
    if (currentStep === 4 && formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Map frontend data to backend schema
      const onboardingData = {
        education_level: formData.educationLevel,
        field_of_study: formData.fieldOfStudy,
        institution: formData.institution,
        graduation_year: formData.graduationYear ? parseInt(formData.graduationYear, 10) : undefined,
        interests: formData.interests,
        current_role: formData.currentStatus,
        step_completed: 4,
      };

      // Submit to backend
      await onboardingAPI.submit(onboardingData);
      
      completeOnboarding();
      toast.success("Welcome! Your profile is all set.");
      navigate("/");
    } catch (error: any) {
      console.error('Onboarding submission failed:', error);
      toast.error("Failed to save your profile. Please try again.");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome! Let's get you started
          </h1>
          <p className="text-muted-foreground">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    isCurrent || isCompleted ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card rounded-xl border border-border p-8 card-shadow"
        >
          {/* Step 1: Education Level */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Education Level</h2>
                <p className="text-sm text-muted-foreground">
                  What's your current education level?
                </p>
              </div>

              <RadioGroup
                value={formData.educationLevel}
                onValueChange={(value) => updateField("educationLevel", value)}
              >
                {[
                  "High School",
                  "Undergraduate",
                  "Bachelor's Degree",
                  "Master's Degree",
                  "PhD",
                ].map((level) => (
                  <Label
                    key={level}
                    htmlFor={level}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.educationLevel === level
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent/50"
                    }`}
                  >
                    <RadioGroupItem value={level} id={level} />
                    <span className="flex-1">{level}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Field & Institution */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Academic Background</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us about your field of study
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Select
                    value={formData.fieldOfStudy}
                    onValueChange={(value) => updateField("fieldOfStudy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Accounting">Accounting</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Business Administration">Business Administration</SelectItem>
                      <SelectItem value="BBA">BBA (Bachelor of Business Administration)</SelectItem>
                      <SelectItem value="International Relations">International Relations</SelectItem>
                      <SelectItem value="Political Science">Political Science</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                      <SelectItem value="Economics">Economics</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    placeholder="Your university or institution"
                    value={formData.institution}
                    onChange={(e) => updateField("institution", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Graduation Year</Label>
                  <Input
                    type="number"
                    placeholder="2024"
                    min="2000"
                    max="2035"
                    value={formData.graduationYear}
                    onChange={(e) => updateField("graduationYear", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Current Status */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Current Status</h2>
                <p className="text-sm text-muted-foreground">
                  What best describes your current situation?
                </p>
              </div>

              <RadioGroup
                value={formData.currentStatus}
                onValueChange={(value) => updateField("currentStatus", value)}
              >
                {[
                  { value: "student", label: "Student", desc: "Currently pursuing studies" },
                  {
                    value: "graduate",
                    label: "Recent Graduate",
                    desc: "Graduated within the last year",
                  },
                  {
                    value: "employed",
                    label: "Employed",
                    desc: "Currently working in the field",
                  },
                  {
                    value: "seeking",
                    label: "Job Seeking",
                    desc: "Actively looking for opportunities",
                  },
                ].map((status) => (
                  <Label
                    key={status.value}
                    htmlFor={status.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.currentStatus === status.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent/50"
                    }`}
                  >
                    <RadioGroupItem value={status.value} id={status.value} />
                    <div className="flex-1">
                      <div className="font-medium">
                        {status.label}
                      </div>
                      <p className="text-sm text-muted-foreground">{status.desc}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 4: Interests */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Interests</h2>
                <p className="text-sm text-muted-foreground">
                  Select areas that interest you (choose at least one)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {getInterestOptions(formData.fieldOfStudy).map((interest) => (
                  <div
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      formData.interests.includes(interest)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent/50"
                    }`}
                  >
                    <Checkbox
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={() => toggleInterest(interest)}
                    />
                    <span className="text-sm">{interest}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 gradient-cta text-primary-foreground">
            {currentStep === steps.length ? "Complete" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
