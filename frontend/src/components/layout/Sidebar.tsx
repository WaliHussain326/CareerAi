import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  Sparkles,
  Map,
  TrendingUp,
  BookOpen,
  Users,
  HelpCircle,
  LogOut,
  Brain,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingAPI } from "@/services/api";
import { useEffect, useState } from "react";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ClipboardCheck, label: "Career Assessment", href: "/assessment" },
  { icon: Sparkles, label: "Recommendations", href: "/recommendations" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: Map, label: "Career Paths", href: "/career-paths" },
];

const resourceNavItems = [
  { icon: BookOpen, label: "Learning Materials", href: "/learning" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: HelpCircle, label: "Support", href: "/support" },
];

const adminNavItems = [
  { icon: Shield, label: "Admin Portal", href: "/admin" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [fieldOfStudy, setFieldOfStudy] = useState<string>("");

  useEffect(() => {
    const loadOnboarding = async () => {
      try {
        const { data } = await onboardingAPI.get();
        if (data?.field_of_study) {
          setFieldOfStudy(data.field_of_study);
        }
      } catch (error) {
        setFieldOfStudy("");
      }
    };
    loadOnboarding();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = (user?.full_name || user?.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <img src="/logo.jpeg" alt="NextStepAi" className="h-9 w-9 rounded-lg object-cover" />
          <span className="text-lg font-bold text-foreground">NextStepAi</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {/* Main Navigation - Hide for admin users */}
          {!user?.is_admin && (
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Resources Section - Hide for admin users */}
          {!user?.is_admin && (
            <div className="pt-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resources
              </p>
              <div className="space-y-1">
                {resourceNavItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link key={item.href} to={item.href}>
                      <motion.div
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Section - Only visible for admin users */}
          {user?.is_admin && (
            <div className="pt-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
              <div className="space-y-1">
                {adminNavItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link key={item.href} to={item.href}>
                      <motion.div
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.full_name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {fieldOfStudy || "Profile incomplete"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
