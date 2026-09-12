import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TeacherLayout from "./components/layout/TeacherLayout";
import ClassesPage from "./pages/ClassesPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import ContentPage from "./pages/ContentPage";
import CreateTestPage from "./pages/CreateTestPage";
import StudentsPage from "./pages/StudentsPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/teacher/classes" replace />} />
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/:classId" element={<ClassDetailPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="content/create" element={<CreateTestPage />} />
          <Route path="students" element={<StudentsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/teacher/classes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
