"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodos } from "@/hooks/useTodos";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const {
    data: todos,
    isLoading,
    error,
  } = useTodos(filter === "all" ? undefined : filter === "completed");

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading todos...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Failed to load todos. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredTodos =
    todos?.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Todos</CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({todos?.length || 0})
          </Button>
          <Button
            size="sm"
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            Active ({todos?.filter((t) => !t.completed).length || 0})
          </Button>
          <Button
            size="sm"
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
          >
            Completed ({todos?.filter((t) => t.completed).length || 0})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTodos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {filter === "all"
              ? "No todos yet. Add one above!"
              : filter === "active"
              ? "No active todos."
              : "No completed todos."}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
