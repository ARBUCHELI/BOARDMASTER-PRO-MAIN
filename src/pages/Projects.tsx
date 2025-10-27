import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, FolderKanban, Loader2, Calendar, MoreVertical, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  owner_id: string;
}

const Projects = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  // Helper function to ensure user profile exists
  const ensureUserProfile = async (user: any) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        return; // Profile exists, we're good
      }

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, try to create it
        console.log("Creating user profile...");
        const { error: createProfileError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
          });

        if (createProfileError) {
          console.warn("Could not create profile:", createProfileError.message);
          // Don't throw error, continue anyway
        }
      }
    } catch (error) {
      console.warn("Profile check failed:", error);
      // Don't throw error, continue anyway
    }
  };

  // Helper function to create project with multiple fallback methods
  const createProjectWithFallback = async (projectData: any, user: any) => {
    console.log("🔍 Attempting to create project with fallback methods...");
    
    // Method 1: Direct insert
    try {
      console.log("Method 1: Direct insert");
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: projectData.name,
            description: projectData.description,
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (data && !error) {
        console.log("✅ Project created successfully via direct insert");
        return data;
      } else {
        console.log("❌ Direct insert failed:", error?.message);
      }
    } catch (error) {
      console.log("❌ Direct insert exception:", error);
    }

    // Method 2: Try with different owner_id format
    try {
      console.log("Method 2: String owner_id");
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: projectData.name,
            description: projectData.description,
            owner_id: user.id.toString(),
          },
        ])
        .select()
        .single();

      if (data && !error) {
        console.log("✅ Project created successfully with string owner_id");
        return data;
      } else {
        console.log("❌ String owner_id failed:", error?.message);
      }
    } catch (error) {
      console.log("❌ String owner_id exception:", error);
    }

    // Method 3: Try using RPC if available
    try {
      console.log("Method 3: RPC function");
      const { data, error } = await supabase.rpc('create_project_with_profile', {
        project_name: projectData.name,
        project_description: projectData.description,
        user_email: user.email,
        user_full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User"
      });

      if (data && !error) {
        console.log("✅ Project created successfully via RPC");
        return data;
      } else {
        console.log("❌ RPC method failed:", error?.message);
      }
    } catch (error) {
      console.log("❌ RPC method exception:", error);
    }

    // Method 4: Try with minimal data
    try {
      console.log("Method 4: Minimal data");
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: projectData.name,
            description: projectData.description || "",
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (data && !error) {
        console.log("✅ Project created successfully with minimal data");
        return data;
      } else {
        console.log("❌ Minimal data failed:", error?.message);
      }
    } catch (error) {
      console.log("❌ Minimal data exception:", error);
    }

    console.log("❌ All methods failed");
    return null;
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    try {
      // Verify we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session. Please log in again.");
      }

      // Step 1: Ensure user profile exists
      await ensureUserProfile(session.user);

      // Step 2: Try to create project with multiple fallback methods
      const data = await createProjectWithFallback(newProject, session.user);

      if (!data) {
        throw new Error("Failed to create project. Please try again or contact support.");
      }

      const defaultBoards = [
        { name: "To Do", position: 0, project_id: data.id },
        { name: "In Progress", position: 1, project_id: data.id },
        { name: "Done", position: 2, project_id: data.id },
      ];

      const { error: boardsError } = await supabase
        .from("boards")
        .insert(defaultBoards);

      if (boardsError) throw boardsError;

      toast({
        title: "Project created!",
        description: "Your new project is ready.",
      });

      setDialogOpen(false);
      setNewProject({ name: "", description: "" });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "The project has been removed.",
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your project boards
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to organize your tasks
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Project"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What is this project about?"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create your first project to start organizing your tasks
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] animate-slide-in-up group"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="bg-primary/10 rounded-lg p-2 mb-3">
                    <FolderKanban className="h-6 w-6 text-primary" />
                  </div>
                  {user?.id === project.owner_id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                  {project.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(project.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;