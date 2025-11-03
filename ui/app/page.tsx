import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sticky Header */}
      <StickyHeader />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
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
