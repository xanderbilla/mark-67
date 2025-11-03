import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
            Your Todo List
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
            Stay organized and get things done
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8">
            <TodoForm />
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8">
            <TodoList />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
