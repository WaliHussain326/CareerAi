import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface LearningMaterial {
  id: number;
  title: string;
  description: string | null;
  url: string;
  category: string | null;
  field_of_study: string | null;
  resource_type: string | null;
  provider: string | null;
  level: string | null;
  duration: string | null;
  is_free: boolean;
  tags: string[] | null;
}

const categories = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "Programming", label: "Programming", icon: Code },
  { id: "Mobile", label: "Mobile", icon: Smartphone },
  { id: "AI/ML", label: "AI/ML", icon: Brain },
  { id: "Cloud", label: "Cloud", icon: Cloud },
  { id: "Database", label: "Database", icon: Database },
  { id: "Security", label: "Security", icon: Shield },
];

const Learning = () => {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/admin/public/learning-materials");
      setMaterials(data);
    } catch (error: any) {
      console.error("Error loading materials:", error);
      toast.error("Failed to load learning materials");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      material.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryGradient = (category: string | null) => {
    switch (category) {
      case "Programming": return "from-primary to-primary/70";
      case "AI/ML": return "from-accent to-accent/70";
      case "Cloud": return "from-warning to-warning/70";
      case "Mobile": return "from-chart-5 to-chart-5/70";
      case "Database": return "from-muted-foreground to-muted-foreground/70";
      case "Security": return "from-destructive to-destructive/70";
      default: return "from-success to-success/70";
    }
  };
  return (
    <DashboardLayout
      title="Learning Materials"
      subtitle="Curated courses and resources to boost your skills"
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
            placeholder="Search learning materials..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={loadMaterials}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
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
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No materials found</h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "No learning materials available yet. Check back later!"}
          </p>
        </div>
      ) : (
        /* Materials Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="group rounded-xl border border-border bg-card overflow-hidden card-shadow hover:card-shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div
                className={cn(
                  "relative h-36 bg-gradient-to-br flex items-center justify-center",
                  getCategoryGradient(material.category)
                )}
              >
                <BookOpen className="h-12 w-12 text-white/80" />
                {material.is_free && (
                  <div className="absolute top-3 right-3 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
                    Free
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  {material.level && (
                    <Badge variant="secondary" className="text-xs">
                      {material.level}
                    </Badge>
                  )}
                  {material.resource_type && (
                    <Badge variant="outline" className="text-xs">
                      {material.resource_type}
                    </Badge>
                  )}
                </div>

                <h3 className="mb-1 font-semibold text-foreground line-clamp-1">
                  {material.title}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                  {material.description || "No description available"}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{material.provider || "Unknown"}</span>
                  {material.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {material.duration}
                    </div>
                  )}
                </div>

                {material.tags && material.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {material.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  variant="default"
                  className="w-full"
                  size="sm"
                  onClick={() => window.open(material.url, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Material
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Learning;
