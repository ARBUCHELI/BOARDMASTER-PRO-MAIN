import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent" | null;
  due_date: string | null;
  assigned_to: string | null;
}

interface Board {
  id: string;
  name: string;
  position: number;
}

interface BoardColumnProps {
  board: Board;
  tasks: Task[];
  onAddTask: (boardId: string) => void;
  onTaskClick: (task: Task) => void;
}

const BoardColumn = ({ board, tasks, onAddTask, onTaskClick }: BoardColumnProps) => {
  return (
    <div className="flex-shrink-0 w-80">
      <Card className="h-full border-2 bg-card/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              {board.name}
              <span className="text-xs font-semibold bg-primary/20 px-2.5 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/20"
              onClick={() => onAddTask(board.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <Droppable droppableId={board.id}>
          {(provided, snapshot) => (
            <CardContent
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-3 min-h-[500px] p-3 transition-colors ${
                snapshot.isDraggingOver ? "bg-primary/5 rounded-lg" : ""
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={() => onTaskClick(task)}
                />
              ))}
              {provided.placeholder}
            </CardContent>
          )}
        </Droppable>
      </Card>
    </div>
  );
};

export default BoardColumn;