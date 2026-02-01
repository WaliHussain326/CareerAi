import { motion } from "framer-motion";
import { Code2, Brain, Smartphone, Shield, Cloud, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { careersAPI, CareerRecommendation } from "@/services/api";
import { useNavigate } from "react-router-dom";

function getMatchColor(match: number) {
  if (match >= 85) return "text-match-high";
  if (match >= 70) return "text-match-medium";
  return "text-match-low";
}

function getMatchBg(match: number) {
  if (match >= 85) return "bg-success/10";
  if (match >= 70) return "bg-warning/10";
  return "bg-destructive/10";
}

function getCareerIcon(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes("data") || normalized.includes("analytics")) return Brain;
  if (normalized.includes("ai") || normalized.includes("ml") || normalized.includes("machine")) return Brain;
  if (normalized.includes("cloud")) return Cloud;
  if (normalized.includes("security") || normalized.includes("cyber")) return Shield;
  if (normalized.includes("mobile") || normalized.includes("app")) return Smartphone;
  if (normalized.includes("devops") || normalized.includes("infrastructure")) return Server;
  return Code2;
}

export function CareerMatches() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCareerMatches();
  }, []);

  const loadCareerMatches = async () => {
    try {
      const { data } = await careersAPI.getRecommendations();
      setCareers(data.slice(0, 4)); // Top 4 matches
    } catch (error) {
      console.error("Failed to load career matches:", error);
      setCareers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-xl border border-border bg-card p-5 card-shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Top Career Matches</h3>
        <button 
          onClick={() => navigate("/recommendations")}
          className="text-sm font-medium text-primary hover:underline"
        >
          Explore more
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : careers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-2">No career matches yet</p>
          <button
            onClick={() => navigate("/assessment")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Take the assessment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {careers.map((career, index) => {
            const Icon = getCareerIcon(career.career_title);
            const matchScore = career.match_score || 0;
            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.1 }}
                onClick={() => navigate(`/career-paths/${career.id}`)}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="rounded-lg p-2 bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{career.career_title}</p>
                  <p className="text-xs text-muted-foreground">{matchScore}% Match</p>
                </div>
                <div
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-bold",
                    getMatchBg(matchScore),
                    getMatchColor(matchScore)
                  )}
                >
                  {matchScore}%
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
