import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Settings } from "lucide-react";
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
  const [members, setMembers] = useState<any[]>([]);

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
      const [projectData, boardsData, tasksData, membersData] = await Promise.all([
        api.getProject(id!),
        api.getBoards(id!),
        api.getTasks(id!),
        api.getProjectMembers(id!),
      ]);

      setProject(projectData);
      setBoards(boardsData);
      setTasks(tasksData);
      setMembers(membersData);
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

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Optimistic update
    const newTasks = Array.from(tasks);
    const taskIndex = newTasks.findIndex((t) => t.id === draggableId);
    newTasks.splice(taskIndex, 1);

    const updatedTask = {
      ...task,
      board_id: destination.droppableId,
      position: destination.index,
    };

    newTasks.splice(destination.index, 0, updatedTask);
    setTasks(newTasks);

    try {
      await api.updateTask(draggableId, {
        boardId: destination.droppableId,
        position: destination.index,
      });
    } catch (error: any) {
      toast({
        title: "Error moving task",
        description: error.message,
        variant: "destructive",
      });
      fetchProjectData();
    }
  };

  const handleAddTask = (boardId: string) => {
    setSelectedBoardId(boardId);
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setSelectedBoardId(task.board_id);
    setDialogOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    if (!user) return;

    try {
      if (selectedTask) {
        await api.updateTask(selectedTask.id, {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          dueDate: taskData.due_date?.toISOString() || null,
          status: taskData.status,
          assignedTo: taskData.assigned_to,
        });

        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
      } else {
        await api.createTask(
          selectedBoardId,
          taskData.title,
          taskData.description,
          taskData.priority
        );

        toast({
          title: "Task created",
          description: "Your new task has been added.",
        });
      }

      setDialogOpen(false);
      await fetchProjectData();
    } catch (error: any) {
      toast({
        title: "Error saving task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);

      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });

      await fetchProjectData();
    } catch (error: any) {
      toast({
        title: "Error deleting task",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-4">
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
          <Button
            variant="outline"
            onClick={() => navigate(`/project/${id}/settings`)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Team & Settings
          </Button>
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
                assigned_to: selectedTask.assigned_to,
              }
            : undefined
        }
        onSave={handleSaveTask}
        onDelete={selectedTask ? handleDeleteTask : undefined}
        boardId={selectedBoardId}
        projectMembers={members}
      />
    </div>
  );
};

export default ProjectBoard;
