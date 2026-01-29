import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Check,
  Circle,
  BookOpen,
  Code,
  Database,
  Cloud,
  Lock,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { careersAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import type { CareerRecommendation } from "@/services/api";

const CareerPaths = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      setIsLoading(true);
      const { data } = await careersAPI.getRecommendations();
      setCareers(data);
    } catch (error) {
      console.error("Failed to load careers:", error);
      setCareers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExploreCareer = (careerId: number) => {
    navigate(`/career-paths/${careerId}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Career Paths" subtitle="Explore your personalized career options">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading career paths...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (careers.length === 0) {
    return (
      <DashboardLayout title="Career Paths" subtitle="Explore your personalized career options">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Briefcase className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No career recommendations yet</p>
          <Button onClick={() => navigate('/assessment')}>
            Take Assessment
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Career Paths"
      subtitle={`${careers.length} personalized career recommendation${careers.length !== 1 ? 's' : ''}`}
    >
      {/* Career Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {careers.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 card-shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleExploreCareer(career.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                <Code className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{career.match_score}%</div>
                <div className="text-xs text-muted-foreground">Match</div>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-2">{career.career_title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {career.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <BookOpen className="h-4 w-4" />
              <span>Learning path available</span>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleExploreCareer(career.id);
              }}
            >
              Explore This Path
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default CareerPaths;
