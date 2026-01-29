import { motion } from "framer-motion";
import { ArrowRight, Clock, HelpCircle, Zap, Brain, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";

export function CTACard() {
  const navigate = useNavigate();
  const { quizStatus } = useQuiz();

  const getContent = () => {
    switch (quizStatus) {
      case "completed":
        return {
          title: "Quiz Completed!",
          description: "View your personalized AI career recommendations and discover your perfect career path.",
          buttonText: "View AI Recommendations",
          onClick: () => navigate("/recommendations"),
          icon: CheckCircle,
        };
      case "in-progress":
        return {
          title: "Continue Your Assessment",
          description: "You're making great progress! Complete your career assessment to unlock personalized recommendations.",
          buttonText: "Continue Quiz",
          onClick: () => navigate("/assessment"),
          icon: Brain,
        };
      default:
        return {
          title: "Start Career Assessment Quiz",
          description: "Discover your ideal career path based on your skills and interests",
          buttonText: "Start Career Quiz",
          onClick: () => navigate("/assessment"),
          icon: Brain,
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl gradient-cta p-8 text-center"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur"
        >
          <Icon className="h-8 w-8 text-white" />
        </motion.div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold text-white">
          {content.title}
        </h2>

        {/* Description */}
        <p className="mx-auto mb-6 max-w-md text-white/90">
          {content.description}
        </p>

        {/* Info badges - only show for not-started */}
        {quizStatus === "not-started" && (
          <div className="mb-6 flex items-center justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>15-20 minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              <span>30 Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>Instant Results</span>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={content.onClick}
          className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
        >
          {content.buttonText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Trust text */}
        <p className="mt-4 text-xs text-white/60">
          Your responses are confidential and used only to generate your personalized report
        </p>
      </div>
    </motion.div>
  );
}
