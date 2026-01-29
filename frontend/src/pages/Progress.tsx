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
import { useEffect, useState } from "react";
import { careersAPI, quizAPI, onboardingAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const Progress_ = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [careerCount, setCareerCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      
      // Load onboarding status
      try {
        const onboardingResponse = await onboardingAPI.getOnboardingData();
        setProfileCompleted(!!onboardingResponse.data);
      } catch (error) {
        setProfileCompleted(false);
      }

      // Load quiz status
      try {
        const progressResponse = await quizAPI.getProgress();
        setTotalQuestions(progressResponse.data.total_questions);
        setAnsweredQuestions(progressResponse.data.answered_questions);
        setAssessmentCompleted(progressResponse.data.is_completed);
      } catch (error) {
        setAssessmentCompleted(false);
      }

      // Load career recommendations
      try {
        const careersResponse = await careersAPI.getRecommendations();
        setCareerCount(careersResponse.data.length);
      } catch (error) {
        setCareerCount(0);
      }
    } catch (error) {
      console.error("Failed to load progress data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const milestones = [
    { id: 1, title: "Complete Profile", completed: profileCompleted },
    { id: 2, title: "Take Career Assessment", completed: assessmentCompleted },
    { id: 3, title: "Review Recommendations", completed: careerCount > 0 },
    { id: 4, title: "Explore Career Paths", completed: false },
    { id: 5, title: "Build Your Skills", completed: false },
    { id: 6, title: "Track Your Growth", completed: false },
  ];

  const completedMilestones = milestones.filter(m => m.completed).length;
  const progressPercentage = Math.round((completedMilestones / milestones.length) * 100);

  const achievements = [
    {
      id: 1,
      icon: Target,
      title: "Profile Complete",
      description: "Completed your profile setup",
      earned: profileCompleted,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: 2,
      icon: Award,
      title: "First Assessment",
      description: "Completed career assessment",
      earned: assessmentCompleted,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: 3,
      icon: Flame,
      title: "Career Explorer",
      description: "Explored career options",
      earned: careerCount > 0,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      id: 4,
      icon: BookOpen,
      title: "Path Starter",
      description: "Started learning journey",
      earned: false,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      id: 5,
      icon: Code,
      title: "Skill Builder",
      description: "Working on skill development",
      earned: false,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Your Progress" subtitle="Track your career journey">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading progress...</div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout title="Your Progress" subtitle="Track your career journey">
      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Trophy, label: "Achievements", value: `${achievements.filter(a => a.earned).length}/${achievements.length}`, color: "text-warning", bg: "bg-warning/10" },
          { icon: Target, label: "Milestones Reached", value: `${completedMilestones}/${milestones.length}`, color: "text-primary", bg: "bg-primary/10" },
          { icon: Clock, label: "Assessment Progress", value: `${answeredQuestions}/${totalQuestions}`, color: "text-accent", bg: "bg-accent/10" },
          { icon: TrendingUp, label: "Career Options", value: careerCount, color: "text-success", bg: "bg-success/10" },
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
              <span className="text-muted-foreground">{completedMilestones} of {milestones.length} completed</span>
              <span className="font-medium text-foreground">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
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

        {/* Activity Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-card p-6 card-shadow"
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">Your Journey</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Assessment {assessmentCompleted ? 'Completed' : 'In Progress'}</p>
                <p className="text-xs text-muted-foreground">
                  {assessmentCompleted 
                    ? 'Great job! You\'ve completed your career assessment.'
                    : `${answeredQuestions} of ${totalQuestions} questions answered`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Career Exploration</p>
                <p className="text-xs text-muted-foreground">
                  {careerCount > 0 
                    ? `Exploring ${careerCount} personalized career path${careerCount !== 1 ? 's' : ''}`
                    : 'Complete your assessment to discover career paths'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <BookOpen className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Learning Paths</p>
                <p className="text-xs text-muted-foreground">
                  Personalized learning roadmaps ready when you are
                </p>
              </div>
            </div>
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
