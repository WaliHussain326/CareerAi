import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CTACard } from "@/components/dashboard/CTACard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CareerMatches } from "@/components/dashboard/CareerMatches";
import { LearningResources } from "@/components/dashboard/LearningResources";
import { CheckCircle, Target, TrendingUp, Flame } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout
      title="Welcome Back, Adil"
      subtitle="Let's continue your career journey"
    >
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={CheckCircle}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
          value="3"
          label="Assessments Completed"
          subtext="↑ +2 this week"
          subtextColor="text-success"
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
          value="78%"
          label="Profile Completion"
          hasProgress
          progressValue={78}
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
