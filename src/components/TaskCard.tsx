import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Draggable } from "react-beautiful-dnd";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent" | null;
  due_date: string | null;
  assigned_to: string | null;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

const priorityColors = {
  low: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  medium: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

const TaskCard = ({ task, index, onClick }: TaskCardProps) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            className={`cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all border-2 ${
              snapshot.isDragging 
                ? "shadow-2xl ring-2 ring-primary rotate-2" 
                : "hover:border-primary/30"
            }`}
            onClick={onClick}
          >
            <CardHeader className="p-3 pb-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm line-clamp-2 flex-1">{task.title}</h4>
                {task.priority && (
                  <Badge
                    variant="outline"
                    className={`${priorityColors[task.priority]} font-semibold text-xs shrink-0`}
                  >
                    {task.priority}
                  </Badge>
                )}
              </div>
            </CardHeader>
            {(task.description || task.due_date) && (
              <CardContent className="p-3 pt-0 space-y-2">
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs">
                  {task.due_date && (
                    <div 
                      className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                        isOverdue 
                          ? "bg-red-500/15 text-red-600 dark:text-red-400 font-semibold" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(task.due_date), "MMM d")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;