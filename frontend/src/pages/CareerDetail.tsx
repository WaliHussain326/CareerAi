import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { careersAPI, CareerRecommendation, SkillGap, LearningRoadmapStep } from "@/services/api";
import { toast } from "sonner";
import {
  Code2,
  Brain,
  Smartphone,
  Shield,
  Cloud,
  Server,
  ArrowLeft,
  Star,
  TrendingUp,
  Briefcase,
  Award,
  Target,
  AlertCircle,
  BookOpen,
  ExternalLink,
} from "lucide-react";

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

const CareerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState<CareerRecommendation | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [roadmap, setRoadmap] = useState<LearningRoadmapStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCareerDetails();
  }, [id]);

  const loadCareerDetails = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Load career recommendation
      const { data: careerData } = await careersAPI.getRecommendation(parseInt(id));
      setCareer(careerData);

      // Load skill gaps
      const { data: gaps } = await careersAPI.getSkillGaps(parseInt(id));
      setSkillGaps(gaps);

      // Load learning roadmap
      const { data: roadmapData } = await careersAPI.getLearningRoadmap(parseInt(id));
      setRoadmap(roadmapData);
    } catch (error: any) {
      console.error("Failed to load career details:", error);
      toast.error("Failed to load career details");
      navigate("/recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !career) {
    return (
      <DashboardLayout title="Loading..." subtitle="Career Path Details">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading career details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const Icon = getCareerIcon(career.career_title);
  const description = career.career_description || "";
  const requiredSkills = career.required_skills || [];
  const matchScore = career.match_score || 0;

  return (
    <DashboardLayout title={career.career_title} subtitle="Career Path Details">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/recommendations")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recommendations
        </Button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-border bg-card p-8 card-shadow"
        >
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70">
              <Icon className="h-10 w-10 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {career.career_title}
                  </h1>
                  <p className="text-muted-foreground">{description}</p>
                </div>
                <Badge className="bg-success/10 text-success border-success/20 text-lg px-4 py-2">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  {matchScore}% Match
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Growth Potential</p>
                    <p className="font-semibold text-success">{career.growth_potential}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                    <p className="font-semibold text-foreground">{matchScore}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">Skills Required</p>
                    <p className="font-semibold text-foreground">{requiredSkills.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skill Gap</TabsTrigger>
            <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Career Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </motion.div>

            {career.reasoning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-border bg-card p-6 card-shadow"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Review
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {career.reasoning}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {(career.salary_range || career.work_environment) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-border bg-card p-6 card-shadow"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Role Details
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {career.salary_range && (
                    <p><span className="font-medium text-foreground">Salary Range:</span> {career.salary_range}</p>
                  )}
                  {career.work_environment && (
                    <p><span className="font-medium text-foreground">Work Environment:</span> {career.work_environment}</p>
                  )}
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Skill Gap Tab */}
          <TabsContent value="skills" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Skill Gap Analysis
              </h3>
              {skillGaps.length > 0 ? (
                <div className="space-y-6">
                  {skillGaps.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{item.skill_name}</span>
                        {item.priority && (
                          <Badge
                            variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"}
                            className="ml-2"
                          >
                            {item.priority} priority
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.current_level && (
                          <span>Current: {item.current_level}</span>
                        )}
                        {item.current_level && item.required_level && <span className="mx-2">•</span>}
                        {item.required_level && (
                          <span>Required: {item.required_level}</span>
                        )}
                        {item.estimated_time && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Est. {item.estimated_time}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No skill gap data available
                </p>
              )}

              {skillGaps.length > 0 && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">Focus Areas</p>
                      <p className="text-sm text-muted-foreground">
                        Prioritize high-priority skills to close your largest skill gaps and
                        become job-ready faster.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Learning Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            {roadmap.length > 0 ? (
              roadmap.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 card-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          index === 0
                            ? "bg-success/10 text-success"
                            : index === 1
                            ? "bg-warning/10 text-warning"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {phase.phase}
                        </h3>
                        <p className="text-sm text-muted-foreground">{phase.duration}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{phase.objectives?.length || 0} Objectives</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-foreground mb-2">Topics to Learn:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(phase.objectives || []).map((topic, idx) => (
                          <Badge key={idx} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {phase.resources && phase.resources.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Resources:</h4>
                        <div className="space-y-2">
                          {phase.resources.map((resource, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-foreground">{resource.name || resource.type || "Resource"}</p>
                                  {resource.provider && (
                                    <p className="text-xs text-muted-foreground">{resource.provider}</p>
                                  )}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 rounded-xl border border-border bg-card p-6">
                <p className="text-muted-foreground">No learning roadmap available</p>
              </div>
            )}
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow"
            >
              <h3 className="text-lg font-semibold mb-4">Suggested Resources</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Based on your skill gaps, here are the recommended resources to help you get started.
              </p>

              {roadmap.length > 0 ? (
                <div className="space-y-4">
                  {roadmap.flatMap((phase) => 
                    (phase.resources || []).map((resource, index) => (
                      <div
                        key={`${phase.id}-${index}`}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {resource.name || resource.type || "Learning Resource"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {phase.phase} • {phase.duration}
                            </p>
                          </div>
                        </div>
                        <Button>
                          Learn More
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No resources available yet
                </p>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CareerDetail;
