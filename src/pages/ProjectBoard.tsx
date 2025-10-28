import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import BoardColumn from "@/components/BoardColumn";
import TaskDialog from "@/components/TaskDialog";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "done";
  board_id: string;
  position: number;
  due_date: string | null;
  assigned_to: string | null;
}

interface Board {
  id: string;
  name: string;
  position: number;
  project_id: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
}

const ProjectBoard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchProjectData();
    }
  }, [user, id]);

  const fetchProjectData = async () => {
    try {
      const projectData = await api.getProject(id!);
      setProject(projectData);
      
      // TODO: Implement boards and tasks API endpoints
      // For now, show empty state
      setBoards([]);
      setTasks([]);
    } catch (error: any) {
      toast({
        title: "Error loading project",
        description: error.message,
        variant: "destructive",
      });
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  // Task management functions - TODO: Implement backend API endpoints
  const handleDragEnd = async (result: DropResult) => {
    // TODO: Implement drag and drop API
  };

  const handleAddTask = (boardId: string) => {
    toast({
      title: "Feature Coming Soon",
      description: "Task management is being implemented!",
    });
  };

  const handleTaskClick = (task: Task) => {
    toast({
      title: "Feature Coming Soon",
      description: "Task editing is being implemented!",
    });
  };

  const handleSaveTask = async (taskData: any) => {
    // TODO: Implement task save API
  };

  const handleDeleteTask = async (taskId: string) => {
    // TODO: Implement task delete API
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-lg border shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/projects")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project?.name}</h1>
            {project?.description && (
              <p className="text-sm text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6 px-1">
            {boards.map((board) => (
              <BoardColumn
                key={board.id}
                board={board}
                tasks={tasks.filter((t) => t.board_id === board.id)}
                onAddTask={handleAddTask}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={
          selectedTask
            ? {
                id: selectedTask.id,
                title: selectedTask.title,
                description: selectedTask.description || "",
                priority: selectedTask.priority,
                due_date: selectedTask.due_date ? new Date(selectedTask.due_date) : null,
                status: selectedTask.status,
              }
            : undefined
        }
        onSave={handleSaveTask}
        onDelete={selectedTask ? handleDeleteTask : undefined}
        boardId={selectedBoardId}
      />
    </div>
  );
};

export default ProjectBoard;