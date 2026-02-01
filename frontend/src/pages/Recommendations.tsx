import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { careersAPI, CareerRecommendation } from "@/services/api";
import { toast } from "sonner";
import {
  Code2,
  Brain,
  Smartphone,
  Shield,
  Cloud,
  Server,
  ChevronRight,
  Star,
  TrendingUp,
  BookOpen,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getMatchColor(match: number) {
  if (match >= 85) return "text-success";
  if (match >= 70) return "text-warning";
  return "text-destructive";
}

const getCareerIcon = (title: string) => {
  const normalized = title.toLowerCase();
  if (normalized.includes("data") || normalized.includes("analytics")) return Brain;
  if (normalized.includes("ai") || normalized.includes("ml") || normalized.includes("machine")) return Brain;
  if (normalized.includes("cloud")) return Cloud;
  if (normalized.includes("security") || normalized.includes("cyber")) return Shield;
  if (normalized.includes("mobile") || normalized.includes("app")) return Smartphone;
  if (normalized.includes("devops") || normalized.includes("infrastructure")) return Server;
  return Code2;
};

const Recommendations = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data } = await careersAPI.getRecommendations();
      
      // If no recommendations exist, generate them
      if (!data || data.length === 0) {
        await generateRecommendations(true);
      } else {
        setCareers(data);
      }
    } catch (error: any) {
      console.error("Failed to load recommendations:", error);
      // If error is 404, try to generate new recommendations
      if (error.response?.status === 404) {
        await generateRecommendations(true);
      } else {
        toast.error("Failed to load career recommendations");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async (forceRegenerate = false) => {
    setIsGenerating(true);
    try {
      toast.info("Generating AI-powered career recommendations...");
      const { data } = await careersAPI.generateRecommendations({ force_regenerate: forceRegenerate });
      setCareers(data);
      toast.success("Recommendations generated successfully!");
    } catch (error: any) {
      console.error("Failed to generate recommendations:", error);
      toast.error(error.response?.data?.detail || "Failed to generate recommendations");
    } finally {
      setIsGenerating(false);
    }
  };

  const averageMatchScore = careers.length > 0 
    ? Math.round(careers.reduce((acc, c) => acc + (c.match_score || 0), 0) / careers.length)
    : 0;

  if (isLoading || isGenerating) {
    return (
      <DashboardLayout
        title="AI Recommendations"
        subtitle="Career paths tailored to your profile"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {isGenerating ? "Analyzing your profile with AI..." : "Loading recommendations..."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="AI Recommendations"
      subtitle="Career paths tailored to your profile"
    >
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-xl gradient-cta p-6 text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Career Exploration Results! 🎯</h2>
            <p className="text-primary-foreground/80">
              Based on your interests and skills, we've identified {careers.length} career paths that align with your profile.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{averageMatchScore}%</p>
              <p className="text-xs text-primary-foreground/70">Avg Compatibility</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{careers.length}</p>
              <p className="text-xs text-primary-foreground/70">Career Options</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => generateRecommendations(true)}
              className="bg-white/10 text-primary-foreground hover:bg-white/20"
            >
              Regenerate with AI
            </Button>
          </div>
        </div>
      </motion.div>

      {careers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No recommendations yet. Complete your assessment first!</p>
          <Button onClick={() => navigate("/assessment")}>Take Assessment</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {careers.map((career, index) => {
            const CareerIcon = getCareerIcon(career.career_title);
            const requiredSkills = career.required_skills || [];
            const description = career.career_description || "";
            const reasoning = career.reasoning || "";
            const matchScore = career.match_score || 0;

            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-xl border border-border bg-card overflow-hidden card-shadow hover:card-shadow-lg transition-shadow"
              >
                {/* Match Badge */}
                <div className="absolute right-4 top-4 z-10">
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-3 py-1",
                      getMatchColor(matchScore)
                    )}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-sm font-bold">{matchScore}%</span>
                  </div>
                </div>

                {/* Icon Header */}
                <div className="h-24 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <CareerIcon className="h-12 w-12 text-white" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {career.career_title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {description}
                  </p>

                  {reasoning && (
                    <div className="mb-4 rounded-lg border border-border bg-muted/40 p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">AI Review</p>
                      <p className="text-xs text-muted-foreground line-clamp-3">{reasoning}</p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-xs">
                    <div className="flex items-center gap-1 text-success">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>{career.growth_potential} growth</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Target className="h-3.5 w-3.5" />
                      <span>High demand</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Key Skills to Learn
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {requiredSkills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/career-paths/${career.id}`)}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Explore This Path
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Recommendations;
