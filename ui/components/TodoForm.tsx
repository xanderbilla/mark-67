"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTodo } from "@/hooks/useTodos";
import { TodoRequest } from "@/lib/api";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createTodo = useCreateTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const todoData: TodoRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
    };

    try {
      await createTodo.mutateAsync(todoData);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Todo title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            type="submit"
            disabled={!title.trim() || createTodo.isPending}
            className="w-full"
          >
            {createTodo.isPending ? "Adding..." : "Add Todo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
