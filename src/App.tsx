import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TeacherLayout from "./components/layout/TeacherLayout";
import ClassesPage from "./pages/ClassesPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import ContentPage from "./pages/ContentPage";
import CreateTestPage from "./pages/CreateTestPage";
import StudentsPage from "./pages/StudentsPage";
import LibraryLayout from "./pages/library/LibraryLayout";
import LibraryMaterialsPage from "./pages/library/LibraryMaterialsPage";
import LibraryExercisesPage from "./pages/library/LibraryExercisesPage";
import FlashcardSetEditorPage from "./pages/library/FlashcardSetEditorPage";
import ListeningMaterialEditorPage from "./pages/library/ListeningMaterialEditorPage";
import ReadingMaterialEditorPage from "./pages/library/ReadingMaterialEditorPage";
import GrammarTestEditorPage from "./pages/library/GrammarTestEditorPage";
import ListeningExerciseEditorPage from "./pages/library/ListeningExerciseEditorPage";
import ReadingExerciseEditorPage from "./pages/library/ReadingExerciseEditorPage";
import VocabularyTestEditorPage from "./pages/library/VocabularyTestEditorPage";
import HomeworkPage from "./pages/HomeworkPage";

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
          <Route path="homework" element={<HomeworkPage />} />
          <Route path="library" element={<LibraryLayout />}>
            <Route index element={<Navigate to="materials" replace />} />
            <Route path="materials" element={<LibraryMaterialsPage />} />
            <Route path="materials/flashcards/:setId" element={<FlashcardSetEditorPage />} />
            <Route path="materials/listening/:materialId" element={<ListeningMaterialEditorPage />} />
            <Route path="materials/reading/:materialId" element={<ReadingMaterialEditorPage />} />
            <Route path="exercises" element={<LibraryExercisesPage />} />
            <Route path="exercises/vocabulary/:testId" element={<VocabularyTestEditorPage />} />
            <Route path="exercises/grammar/:testId" element={<GrammarTestEditorPage />} />
            <Route path="exercises/listening/:exerciseId" element={<ListeningExerciseEditorPage />} />
            <Route path="exercises/reading/:exerciseId" element={<ReadingExerciseEditorPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/teacher/classes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
