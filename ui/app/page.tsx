import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 sm:mb-4 tracking-tight">
              Your Todo List
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium">
              Stay organized and get things done
            </p>
          </header>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8">
              <TodoForm />
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8">
              <TodoList />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
