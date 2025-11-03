"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdateTodo, useDeleteTodo } from "@/hooks/useTodos";
import { Todo } from "@/lib/api";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ""
  );

  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleToggleComplete = async () => {
    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        todo: {
          title: todo.title,
          description: todo.description,
          completed: !todo.completed,
        },
      });
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        todo: {
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          completed: todo.completed,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo.mutateAsync(todo.id);
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    }
  };

  return (
    <Card
      className={`transition-opacity ${todo.completed ? "opacity-60" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            disabled={updateTodo.isPending}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Todo title..."
                />
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={!editTitle.trim() || updateTodo.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3
                  className={`font-medium ${
                    todo.completed ? "line-through" : ""
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`text-sm text-gray-600 mt-1 ${
                      todo.completed ? "line-through" : ""
                    }`}
                  >
                    {todo.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Created: {new Date(todo.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={deleteTodo.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
