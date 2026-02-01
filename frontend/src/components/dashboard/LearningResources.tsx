import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Cloud, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { careersAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";

interface Resource {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  careerId?: number;
}

export function LearningResources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLearningResources();
  }, []);

  const loadLearningResources = async () => {
    try {
      setIsLoading(true);
      const { data } = await careersAPI.getRecommendations();
      
      const topCareers = data.slice(0, 3);
      const careerResources: Resource[] = topCareers.map((career, index) => ({
        icon: [Code, Database, Cloud][index] || BookOpen,
        title: career.career_title,
        description: (career.career_description || "").substring(0, 50) + "...",
        gradient: ["from-primary to-primary/70", "from-muted-foreground to-muted-foreground/70", "from-accent to-accent/70"][index],
        careerId: career.id,
      }));

      setResources(careerResources.length > 0 ? careerResources : [
        {
          icon: BookOpen,
          title: "Get Started",
          description: "Complete your assessment to discover personalized learning paths",
          gradient: "from-primary to-primary/70",
        }
      ]);
    } catch (error) {
      console.error("Failed to load learning resources:", error);
      setResources([
        {
          icon: BookOpen,
          title: "Get Started",
          description: "Complete your assessment to discover personalized learning paths",
          gradient: "from-primary to-primary/70",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceClick = (careerId?: number) => {
    if (careerId) {
      navigate(`/career-paths/${careerId}`);
    } else {
      navigate('/assessment');
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-5 card-shadow"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recommended Learning Paths</h3>
        </div>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-5 card-shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recommended Learning Paths</h3>
        <button 
          onClick={() => navigate('/career-paths')}
          className="text-sm font-medium text-primary hover:underline"
        >
          See all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => handleResourceClick(resource.careerId)}
          >
            <div
              className={cn(
                "rounded-xl p-5 mb-3 bg-gradient-to-br transition-transform group-hover:scale-[1.02]",
                resource.gradient
              )}
            >
              <resource.icon className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-foreground text-sm mb-1">
              {resource.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {resource.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Learning path</span>
              <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Explore
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

