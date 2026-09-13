import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import ToastStack from "../ui/ToastStack";

export default function TeacherLayout() {
  return (
    <div className="h-screen w-full flex bg-paper">
      <TeacherSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
      <ToastStack />
    </div>
  );
}
