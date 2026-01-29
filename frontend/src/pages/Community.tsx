import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  Search,
  TrendingUp,
  Clock,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

const discussions = [
  {
    id: 1,
    title: "How to transition from Backend to Full Stack?",
    author: "Alex Chen",
    avatar: "AC",
    category: "Career Advice",
    replies: 24,
    likes: 56,
    timeAgo: "2 hours ago",
    trending: true,
  },
  {
    id: 2,
    title: "Best resources for learning AWS in 2024?",
    author: "Sarah Miller",
    avatar: "SM",
    category: "Learning",
    replies: 18,
    likes: 42,
    timeAgo: "5 hours ago",
    trending: true,
  },
  {
    id: 3,
    title: "My journey from CS graduate to ML Engineer",
    author: "Raj Patel",
    avatar: "RP",
    category: "Success Stories",
    replies: 45,
    likes: 128,
    timeAgo: "1 day ago",
    trending: false,
  },
  {
    id: 4,
    title: "Tips for technical interviews at FAANG",
    author: "Emily Wong",
    avatar: "EW",
    category: "Interview Prep",
    replies: 67,
    likes: 203,
    timeAgo: "2 days ago",
    trending: false,
  },
  {
    id: 5,
    title: "Should I learn React or Vue in 2024?",
    author: "Mike Johnson",
    avatar: "MJ",
    category: "Technology",
    replies: 89,
    likes: 156,
    timeAgo: "3 days ago",
    trending: false,
  },
];

const categories = [
  "All Topics",
  "Career Advice",
  "Learning",
  "Interview Prep",
  "Success Stories",
  "Technology",
  "Networking",
];

const Community = () => {
  return (
    <DashboardLayout title="Community" subtitle="Connect with fellow career explorers">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search discussions..."
                className="pl-10"
              />
            </div>
            <Button className="gradient-cta text-primary-foreground">
              Start Discussion
            </Button>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 overflow-x-auto pb-2"
          >
            {categories.map((category, index) => (
              <button
                key={category}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Discussions */}
          <div className="space-y-4">
            {discussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="rounded-xl border border-border bg-card p-5 card-shadow hover:card-shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                    {discussion.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{discussion.author}</span>
                          <span>•</span>
                          <span className="text-primary">{discussion.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {discussion.timeAgo}
                          </span>
                        </div>
                      </div>
                      {discussion.trending && (
                        <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <MessageSquare className="h-4 w-4" />
                        {discussion.replies}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.likes}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground ml-auto">
                        <Bookmark className="h-4 w-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-5 card-shadow"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Members", value: "12.5K" },
                { label: "Discussions", value: "3.2K" },
                { label: "Online Now", value: "156" },
                { label: "This Week", value: "89" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Contributors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border bg-card p-5 card-shadow"
          >
            <h3 className="font-semibold text-foreground mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {[
                { name: "David Kim", points: 2450, avatar: "DK" },
                { name: "Lisa Chen", points: 2180, avatar: "LC" },
                { name: "John Smith", points: 1920, avatar: "JS" },
                { name: "Emily Zhang", points: 1750, avatar: "EZ" },
              ].map((user, index) => (
                <div key={user.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-4">
                    {index + 1}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-medium text-xs">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
