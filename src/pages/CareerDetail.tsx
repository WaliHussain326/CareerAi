import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  MapPin,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ExternalLink,
} from "lucide-react";

// TODO: This would come from backend
const careerData = {
  "1": {
    icon: Code2,
    title: "Full Stack Developer",
    description: "Build complete web applications from frontend to backend",
    match: 95,
    salary: "$85,000 - $150,000",
    growth: "+25%",
    demand: "Very High",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    color: "from-primary to-primary/70",
    whySuitsYou: "Your strong frontend and backend skills make you ideal for building complete web solutions. Your interest in both user experience and system design aligns perfectly with full-stack development.",
    responsibilities: [
      "Design and develop user-facing features",
      "Build reusable code and libraries",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with team members and stakeholders",
      "Implement security and data protection measures",
    ],
    skillGaps: [
      { skill: "React", current: 75, required: 80, gap: 5 },
      { skill: "Node.js", current: 70, required: 85, gap: 15 },
      { skill: "PostgreSQL", current: 60, required: 75, gap: 15 },
      { skill: "AWS", current: 45, required: 70, gap: 25 },
      { skill: "Docker", current: 50, required: 65, gap: 15 },
    ],
    learningPath: [
      {
        level: "Beginner",
        duration: "1-2 months",
        courses: [
          { title: "React - The Complete Guide", platform: "Udemy", duration: "40 hours" },
          { title: "Node.js Fundamentals", platform: "Coursera", duration: "30 hours" },
        ],
      },
      {
        level: "Intermediate",
        duration: "3-4 months",
        courses: [
          { title: "Advanced React Patterns", platform: "Frontend Masters", duration: "25 hours" },
          { title: "PostgreSQL for Developers", platform: "Pluralsight", duration: "20 hours" },
          { title: "AWS Certified Developer", platform: "A Cloud Guru", duration: "35 hours" },
        ],
      },
      {
        level: "Advanced",
        duration: "5-6 months",
        courses: [
          { title: "Microservices Architecture", platform: "Udacity", duration: "50 hours" },
          { title: "System Design Interview Prep", platform: "Educative", duration: "30 hours" },
          { title: "Production-Ready Docker", platform: "Docker", duration: "20 hours" },
        ],
      },
    ],
  },
  // Add more careers as needed
};

const CareerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const career = careerData[id as keyof typeof careerData] || careerData["1"];
  const Icon = career.icon;

  return (
    <DashboardLayout title={career.title} subtitle="Career Path Details">
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
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${career.color}`}
            >
              <Icon className="h-10 w-10 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {career.title}
                  </h1>
                  <p className="text-muted-foreground">{career.description}</p>
                </div>
                <Badge className="bg-success/10 text-success border-success/20 text-lg px-4 py-2">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  {career.match}% Match
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salary Range</p>
                    <p className="font-semibold text-foreground">{career.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Job Growth</p>
                    <p className="font-semibold text-success">{career.growth}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">Demand</p>
                    <p className="font-semibold text-foreground">{career.demand}</p>
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
                Why This Career Suits You
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {career.whySuitsYou}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Key Responsibilities
              </h3>
              <ul className="space-y-3">
                {career.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

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
                {career.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>
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
              <div className="space-y-6">
                {career.skillGaps.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{item.skill}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Current: <span className="font-semibold">{item.current}%</span>
                        </span>
                        <span className="text-muted-foreground">
                          Required: <span className="font-semibold">{item.required}%</span>
                        </span>
                        <Badge
                          variant={item.gap > 20 ? "destructive" : item.gap > 10 ? "default" : "secondary"}
                          className="ml-2"
                        >
                          Gap: {item.gap}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={item.current} className="h-3" />
                      <div
                        className="absolute top-0 h-3 border-r-2 border-dashed border-warning"
                        style={{ left: `${item.required}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Focus Areas</p>
                    <p className="text-sm text-muted-foreground">
                      Prioritize learning AWS and Node.js to close your largest skill gaps and
                      become job-ready faster.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Learning Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            {career.learningPath.map((phase, index) => (
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
                        {phase.level} Level
                      </h3>
                      <p className="text-sm text-muted-foreground">{phase.duration}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{phase.courses.length} Courses</Badge>
                </div>

                <div className="space-y-3">
                  {phase.courses.map((course, courseIndex) => (
                    <div
                      key={courseIndex}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {course.platform} • {course.duration}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow"
            >
              <h3 className="text-lg font-semibold mb-4">Suggested Courses</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Based on your skill gaps, here are the recommended courses to help you get started.
              </p>

              <div className="space-y-4">
                {career.learningPath.flatMap((phase) => phase.courses).map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.platform} • {course.duration}
                        </p>
                      </div>
                    </div>
                    <Button>
                      Enroll Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CareerDetail;
