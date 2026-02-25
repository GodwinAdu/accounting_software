"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, Trash2, Edit, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createTask, updateTask, deleteTask } from "@/lib/actions/project-task.action";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TasksTabProps {
  tasks: any[];
  projectId: string;
}

export default function TasksTab({ tasks, projectId }: TasksTabProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createTask({ ...formData, projectId }, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Task created successfully");
        setOpen(false);
        setFormData({ title: "", description: "", status: "todo", priority: "medium" });
      }
    } catch (error) {
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const result = await updateTask(taskId, { status: newStatus }, pathname);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Task moved to ${newStatus.replace("_", " ")}`);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus: string) => {
    if (!draggedTask) return;
    
    const task = tasks.find(t => t._id === draggedTask);
    if (task && task.status !== newStatus) {
      await handleStatusChange(draggedTask, newStatus);
    }
    setDraggedTask(null);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      const result = await deleteTask(taskToDelete, pathname);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Task deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const statusIcons = {
    todo: <Circle className="h-4 w-4" />,
    in_progress: <Clock className="h-4 w-4" />,
    review: <AlertCircle className="h-4 w-4" />,
    completed: <CheckCircle2 className="h-4 w-4" />,
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-700 border-gray-300",
    in_progress: "bg-blue-100 text-blue-700 border-blue-300",
    review: "bg-yellow-100 text-yellow-700 border-yellow-300",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-300",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === "todo"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    review: tasks.filter(t => t.status === "review"),
    completed: tasks.filter(t => t.status === "completed"),
  };

  return (
    <div className="space-y-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Tasks Board</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Drag tasks between columns to update status</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Task title"
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Circle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tasks created</p>
            <p className="text-sm text-muted-foreground mt-2">Add tasks to track project progress</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {/* TO DO Column */}
            <div 
              className="space-y-3"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("todo")}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-300">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-gray-600" />
                  <h3 className="font-semibold text-sm">To Do</h3>
                </div>
                <Badge variant="secondary">{tasksByStatus.todo.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {tasksByStatus.todo.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={() => handleDragStart(task._id)}
                    className={`p-3 bg-white border-2 border-gray-200 rounded-lg cursor-move hover:shadow-md transition-all ${
                      draggedTask === task._id ? "opacity-50" : ""
                    }`}
                  >
                    <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge className={priorityColors[task.priority as keyof typeof priorityColors]} variant="outline">
                        {task.priority}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setTaskToDelete(task._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IN PROGRESS Column */}
            <div 
              className="space-y-3"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("in_progress")}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-blue-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-sm">In Progress</h3>
                </div>
                <Badge variant="secondary">{tasksByStatus.in_progress.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {tasksByStatus.in_progress.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={() => handleDragStart(task._id)}
                    className={`p-3 bg-blue-50 border-2 border-blue-200 rounded-lg cursor-move hover:shadow-md transition-all ${
                      draggedTask === task._id ? "opacity-50" : ""
                    }`}
                  >
                    <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge className={priorityColors[task.priority as keyof typeof priorityColors]} variant="outline">
                        {task.priority}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setTaskToDelete(task._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REVIEW Column */}
            <div 
              className="space-y-3"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("review")}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-yellow-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <h3 className="font-semibold text-sm">Review</h3>
                </div>
                <Badge variant="secondary">{tasksByStatus.review.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {tasksByStatus.review.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={() => handleDragStart(task._id)}
                    className={`p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg cursor-move hover:shadow-md transition-all ${
                      draggedTask === task._id ? "opacity-50" : ""
                    }`}
                  >
                    <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge className={priorityColors[task.priority as keyof typeof priorityColors]} variant="outline">
                        {task.priority}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setTaskToDelete(task._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPLETED Column */}
            <div 
              className="space-y-3"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("completed")}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-semibold text-sm">Completed</h3>
                </div>
                <Badge variant="secondary">{tasksByStatus.completed.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {tasksByStatus.completed.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={() => handleDragStart(task._id)}
                    className={`p-3 bg-emerald-50 border-2 border-emerald-200 rounded-lg cursor-move hover:shadow-md transition-all ${
                      draggedTask === task._id ? "opacity-50" : ""
                    }`}
                  >
                    <h4 className="font-medium text-sm mb-1 line-through">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge className={priorityColors[task.priority as keyof typeof priorityColors]} variant="outline">
                        {task.priority}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setTaskToDelete(task._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
    </div>
  );
}
