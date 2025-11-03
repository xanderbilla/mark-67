import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <TodoForm />
          </div>
          <div>
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}
