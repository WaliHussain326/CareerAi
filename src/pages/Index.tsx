import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CTACard } from "@/components/dashboard/CTACard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CareerMatches } from "@/components/dashboard/CareerMatches";
import { LearningResources } from "@/components/dashboard/LearningResources";
import { CheckCircle, Target, TrendingUp, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const { quizStatus, profileCompleteness, calculateProfileCompleteness } = useQuiz();

  useEffect(() => {
    calculateProfileCompleteness();
  }, []);

  const getQuizStatusText = () => {
    switch (quizStatus) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "Not Started";
    }
  };
  return (
    <DashboardLayout
      title={`Welcome Back, ${user?.name || "User"}`}
      subtitle="Let's continue your career journey"
    >
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={CheckCircle}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
          value={getQuizStatusText()}
          label="Quiz Status"
          subtext={quizStatus === "completed" ? "View recommendations" : quizStatus === "in-progress" ? "Continue quiz" : "Start now"}
          subtextColor={quizStatus === "completed" ? "text-success" : "text-muted-foreground"}
        />
        <StatsCard
          icon={Target}
          iconBgColor="bg-warning/10"
          iconColor="text-warning"
          value="12"
          label="Career Matches"
          subtext="View all"
          subtextColor="text-muted-foreground"
        />
        <StatsCard
          icon={TrendingUp}
          iconBgColor="bg-success/10"
          iconColor="text-success"
          value={`${profileCompleteness}%`}
          label="Profile Completion"
          hasProgress
          progressValue={profileCompleteness}
        />
        <StatsCard
          icon={Flame}
          iconBgColor="bg-accent/10"
          iconColor="text-accent"
          value="7 Days"
          label="Learning Streak"
          subtext="🔥 Keep it up!"
          subtextColor="text-warning"
        />
      </div>

      {/* CTA Card */}
      <div className="mb-6">
        <CTACard />
      </div>

      {/* Activity and Matches */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity />
        <CareerMatches />
      </div>

      {/* Learning Resources */}
      <LearningResources />
    </DashboardLayout>
  );
};

export default Index;
