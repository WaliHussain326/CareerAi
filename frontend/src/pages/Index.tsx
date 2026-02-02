import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CTACard } from "@/components/dashboard/CTACard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CareerMatches } from "@/components/dashboard/CareerMatches";
import { LearningResources } from "@/components/dashboard/LearningResources";
import { CheckCircle, Target, TrendingUp, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { useEffect, useState } from "react";
import { careersAPI } from "@/services/api";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  
  // Redirect admin users to admin portal
  if (user?.is_admin) {
    return <Navigate to="/admin" replace />;
  }
  const { quizStatus, profileCompleteness, calculateProfileCompleteness } = useQuiz();
  const [careerMatchCount, setCareerMatchCount] = useState(0);

  useEffect(() => {
    calculateProfileCompleteness();
    loadCareerCount();
  }, []);

  const loadCareerCount = async () => {
    try {
      const { data } = await careersAPI.getRecommendations();
      setCareerMatchCount(data.length);
    } catch (error) {
      setCareerMatchCount(0);
    }
  };

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
      title={`Welcome Back, ${user?.full_name || "User"}`}
      subtitle="Let's continue your career journey"
    >
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={CheckCircle}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
          value={getQuizStatusText()}
          label="Assessment Status"
          subtext={quizStatus === "completed" ? "View recommendations" : quizStatus === "in-progress" ? "Continue assessment" : "Start now"}
          subtextColor={quizStatus === "completed" ? "text-success" : "text-muted-foreground"}
        />
        <StatsCard
          icon={Target}
          iconBgColor="bg-warning/10"
          iconColor="text-warning"
          value={careerMatchCount.toString()}
          label="Career Options"
          subtext="Explore paths"
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
          value="New"
          label="Career Explorer"
          subtext="🎯 Start exploring!"
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
