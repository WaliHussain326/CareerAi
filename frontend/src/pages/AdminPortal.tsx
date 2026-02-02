import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Users,
  BookOpen,
  BarChart3,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  GraduationCap,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import api from "@/lib/axios";

interface AdminStats {
  total_users: number;
  active_users: number;
  completed_onboarding: number;
  completed_quiz: number;
  total_learning_materials: number;
  users_by_field: Record<string, number>;
}

interface AdminUser {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  field_of_study: string | null;
  education_level: string | null;
  institution: string | null;
  interests: string[] | null;
  technical_skills: string[] | null;
  soft_skills: string[] | null;
  career_goals: string | null;
  onboarding_completed: boolean;
  quiz_completed: boolean;
}

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
  is_active: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

const fieldOptions = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
  "Accounting",
  "Finance",
  "Business Administration",
  "Marketing",
  "Human Resources",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Psychology",
  "Economics",
];

const categoryOptions = [
  "Web Development",
  "Mobile Development",
  "AI/ML",
  "Cloud Computing",
  "Database",
  "Security",
  "Finance",
  "Business",
  "Design",
  "Soft Skills",
];

const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const resourceTypes = ["course", "article", "video", "book", "certification"];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldFilter, setFieldFilter] = useState<string>("all");
  
  // Material form state
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    url: "",
    category: "",
    field_of_study: "",
    resource_type: "",
    provider: "",
    level: "",
    duration: "",
    is_free: false,
    tags: "",
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log("Loading admin data for tab:", activeTab);
      if (activeTab === "dashboard") {
        const { data } = await api.get("/admin/stats");
        console.log("Dashboard stats:", data);
        setStats(data);
      } else if (activeTab === "users") {
        const { data } = await api.get("/admin/users/detailed", {
          params: { search: searchTerm, field_of_study: fieldFilter !== "all" ? fieldFilter : undefined }
        });
        console.log("Users data:", data);
        setUsers(data.users || []);
      } else if (activeTab === "materials") {
        const { data } = await api.get("/admin/learning-materials", {
          params: { field_of_study: fieldFilter !== "all" ? fieldFilter : undefined }
        });
        console.log("Materials data:", data);
        setMaterials(data.materials || []);
      }
    } catch (error: any) {
      console.error("Error loading admin data:", error);
      console.error("Error details:", error.response?.data);
      if (error.response?.status === 403) {
        toast.error("Admin access required");
      } else {
        toast.error("Failed to load data: " + (error.response?.data?.detail || error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMaterial = async () => {
    try {
      const payload = {
        ...materialForm,
        tags: materialForm.tags ? materialForm.tags.split(",").map(t => t.trim()) : null,
        field_of_study: materialForm.field_of_study || null,
        category: materialForm.category || null,
        resource_type: materialForm.resource_type || null,
        provider: materialForm.provider || null,
        level: materialForm.level || null,
      };

      if (editingMaterial) {
        await api.put(`/admin/learning-materials/${editingMaterial.id}`, payload);
        toast.success("Material updated successfully");
      } else {
        await api.post("/admin/learning-materials", payload);
        toast.success("Material created successfully");
      }
      
      setMaterialDialogOpen(false);
      resetMaterialForm();
      loadData();
    } catch (error) {
      console.error("Error saving material:", error);
      toast.error("Failed to save material");
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    
    try {
      await api.delete(`/admin/learning-materials/${id}`);
      toast.success("Material deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete material");
    }
  };

  const resetMaterialForm = () => {
    setMaterialForm({
      title: "",
      description: "",
      url: "",
      category: "",
      field_of_study: "",
      resource_type: "",
      provider: "",
      level: "",
      duration: "",
      is_free: false,
      tags: "",
    });
    setEditingMaterial(null);
  };

  const openEditDialog = (material: LearningMaterial) => {
    setEditingMaterial(material);
    setMaterialForm({
      title: material.title,
      description: material.description || "",
      url: material.url,
      category: material.category || "",
      field_of_study: material.field_of_study || "",
      resource_type: material.resource_type || "",
      provider: material.provider || "",
      level: material.level || "",
      duration: material.duration || "",
      is_free: material.is_free,
      tags: material.tags?.join(", ") || "",
    });
    setMaterialDialogOpen(true);
  };

  return (
    <DashboardLayout title="Admin Portal" subtitle="Manage users and learning materials">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Materials
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card p-6 card-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_users}</p>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 card-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.completed_onboarding}</p>
                      <p className="text-sm text-muted-foreground">Completed Onboarding</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-border bg-card p-6 card-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-warning/10">
                      <GraduationCap className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.completed_quiz}</p>
                      <p className="text-sm text-muted-foreground">Completed Quiz</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl border border-border bg-card p-6 card-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <BookOpen className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_learning_materials}</p>
                      <p className="text-sm text-muted-foreground">Learning Materials</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Users by Field Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl border border-border bg-card p-6 card-shadow"
              >
                <h3 className="text-lg font-semibold mb-4">Users by Field of Study</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats.users_by_field).map(([field, count]) => (
                    <div key={field} className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground truncate">{field}</p>
                      <p className="text-xl font-bold text-foreground">{count}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                {fieldOptions.map((field) => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Field of Study</TableHead>
                    <TableHead>Interests</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{user.full_name || "No name"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.field_of_study ? (
                          <Badge variant="secondary">{user.field_of_study}</Badge>
                        ) : (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.interests?.slice(0, 3).map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-xs bg-primary/20 text-primary border border-primary/30">
                              {interest}
                            </Badge>
                          ))}
                          {user.interests && user.interests.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border border-primary/30">
                              +{user.interests.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.onboarding_completed ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">Onboarding</span>
                          {user.quiz_completed ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">Quiz</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "destructive"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                {fieldOptions.map((field) => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={materialDialogOpen} onOpenChange={(open) => {
              setMaterialDialogOpen(open);
              if (!open) resetMaterialForm();
            }}>
              <DialogTrigger asChild>
                <Button className="ml-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingMaterial ? "Edit" : "Add"} Learning Material</DialogTitle>
                  <DialogDescription>
                    Add a new learning resource that will appear in the Learning Materials section.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={materialForm.title}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Advanced React Patterns"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={materialForm.description}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the resource"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      value={materialForm.url}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Select
                        value={materialForm.category}
                        onValueChange={(value) => setMaterialForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Field of Study</Label>
                      <Select
                        value={materialForm.field_of_study}
                        onValueChange={(value) => setMaterialForm(prev => ({ ...prev, field_of_study: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All fields" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Fields</SelectItem>
                          {fieldOptions.map((field) => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Resource Type</Label>
                      <Select
                        value={materialForm.resource_type}
                        onValueChange={(value) => setMaterialForm(prev => ({ ...prev, resource_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Level</Label>
                      <Select
                        value={materialForm.level}
                        onValueChange={(value) => setMaterialForm(prev => ({ ...prev, level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="provider">Provider</Label>
                      <Input
                        id="provider"
                        value={materialForm.provider}
                        onChange={(e) => setMaterialForm(prev => ({ ...prev, provider: e.target.value }))}
                        placeholder="e.g., Coursera, Udemy"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={materialForm.duration}
                        onChange={(e) => setMaterialForm(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 8 hours"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={materialForm.tags}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="react, javascript, frontend"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_free"
                      checked={materialForm.is_free}
                      onCheckedChange={(checked) => setMaterialForm(prev => ({ ...prev, is_free: checked }))}
                    />
                    <Label htmlFor="is_free">Free resource</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setMaterialDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveMaterial} disabled={!materialForm.title || !materialForm.url}>
                    {editingMaterial ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{material.title}</p>
                          <a 
                            href={material.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        {material.category && <Badge variant="secondary">{material.category}</Badge>}
                      </TableCell>
                      <TableCell>
                        {material.field_of_study ? (
                          <Badge variant="outline">{material.field_of_study}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">All</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {material.level && <Badge variant="outline">{material.level}</Badge>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {material.provider || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={material.is_active ? "default" : "destructive"}>
                          {material.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(material)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {materials.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No learning materials found. Add one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminPortal;
