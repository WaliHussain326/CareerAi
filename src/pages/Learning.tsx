import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Play,
  Clock,
  BookOpen,
  Star,
  Filter,
  Code,
  Database,
  Cloud,
  Brain,
  Smartphone,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "web", label: "Web Dev", icon: Code },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "ai", label: "AI/ML", icon: Brain },
  { id: "cloud", label: "Cloud", icon: Cloud },
  { id: "database", label: "Database", icon: Database },
  { id: "security", label: "Security", icon: Shield },
];

const courses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    description: "Master compound components, render props, and custom hooks",
    instructor: "Sarah Chen",
    duration: "8 hours",
    rating: 4.9,
    students: 12500,
    category: "web",
    level: "Advanced",
    gradient: "from-primary to-primary/70",
    progress: 35,
  },
  {
    id: 2,
    title: "Node.js Backend Mastery",
    description: "Build scalable REST APIs with Express and MongoDB",
    instructor: "John Smith",
    duration: "12 hours",
    rating: 4.8,
    students: 9800,
    category: "web",
    level: "Intermediate",
    gradient: "from-success to-success/70",
    progress: 0,
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    description: "Learn ML algorithms and implement them with Python",
    instructor: "Dr. Emily Zhang",
    duration: "15 hours",
    rating: 4.9,
    students: 15200,
    category: "ai",
    level: "Beginner",
    gradient: "from-accent to-accent/70",
    progress: 0,
  },
  {
    id: 4,
    title: "AWS Cloud Practitioner",
    description: "Prepare for the AWS certification exam",
    instructor: "Mike Johnson",
    duration: "10 hours",
    rating: 4.7,
    students: 8500,
    category: "cloud",
    level: "Beginner",
    gradient: "from-warning to-warning/70",
    progress: 0,
  },
  {
    id: 5,
    title: "React Native Development",
    description: "Build cross-platform mobile apps with React Native",
    instructor: "Lisa Park",
    duration: "14 hours",
    rating: 4.8,
    students: 7200,
    category: "mobile",
    level: "Intermediate",
    gradient: "from-chart-5 to-chart-5/70",
    progress: 0,
  },
  {
    id: 6,
    title: "SQL Database Design",
    description: "Design efficient database schemas and write complex queries",
    instructor: "David Brown",
    duration: "6 hours",
    rating: 4.6,
    students: 5600,
    category: "database",
    level: "Intermediate",
    gradient: "from-muted-foreground to-muted-foreground/70",
    progress: 100,
  },
];

const Learning = () => {
  return (
    <DashboardLayout
      title="Learning Materials"
      subtitle="Curated courses to boost your skills"
    >
      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex gap-2 overflow-x-auto pb-2"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              category.id === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="group rounded-xl border border-border bg-card overflow-hidden card-shadow hover:card-shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div
              className={cn(
                "relative h-36 bg-gradient-to-br flex items-center justify-center",
                course.gradient
              )}
            >
              <BookOpen className="h-12 w-12 text-white/80" />
              {course.progress > 0 && course.progress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-white"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
              {course.progress === 100 && (
                <div className="absolute top-3 right-3 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
                  Completed
                </div>
              )}
              <button className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-5 w-5 text-foreground ml-0.5" />
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {course.level}
                </span>
                <span className="flex items-center gap-1 text-xs text-warning">
                  <Star className="h-3 w-3 fill-current" />
                  {course.rating}
                </span>
              </div>

              <h3 className="mb-1 font-semibold text-foreground line-clamp-1">
                {course.title}
              </h3>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{course.instructor}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration}
                </div>
              </div>

              <Button
                variant={course.progress > 0 ? "default" : "outline"}
                className="mt-4 w-full"
                size="sm"
              >
                {course.progress === 100
                  ? "Review Course"
                  : course.progress > 0
                  ? "Continue Learning"
                  : "Start Course"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Learning;
