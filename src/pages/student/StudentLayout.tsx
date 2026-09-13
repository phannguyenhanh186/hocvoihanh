import { Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-2">
          <GraduationCap size={20} className="text-navy" />
          <span className="font-display font-semibold">Bài tập của tôi</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
