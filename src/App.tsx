import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAppStore } from "./store/useAppStore";
import { subscribeFirestoreError, getFirestoreError } from "./lib/firestoreStatus";
import TeacherLayout from "./components/layout/TeacherLayout";
import StudentLayout from "./pages/student/StudentLayout";
import StudentClassListPage from "./pages/student/StudentClassListPage";
import StudentPickerPage from "./pages/student/StudentPickerPage";
import StudentHomeworkListPage from "./pages/student/StudentHomeworkListPage";
import StudentHomeworkDetailPage from "./pages/student/StudentHomeworkDetailPage";
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

// Data now lives in a shared Firestore document (see src/lib/firestoreStorage.ts)
// instead of this browser's localStorage, so the first render has to wait
// for that initial fetch — otherwise teacher and student alike would flash
// empty/seed data before the real content arrives.
function useHydrated() {
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated());
  useEffect(() => {
    if (hydrated) return;
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    // in case hydration finished between the initial state and this effect
    setHydrated(useAppStore.persist.hasHydrated());
    return unsub;
  }, [hydrated]);
  return hydrated;
}

export default function App() {
  const hydrated = useHydrated();
  const [fsError, setFsError] = useState(getFirestoreError());

  useEffect(() => subscribeFirestoreError(setFsError), []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink/40">
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {fsError && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-4 py-2.5 flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0" />
          <span>{fsError}</span>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/teacher/classes" replace />} />
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentClassListPage />} />
          <Route path=":classId" element={<StudentPickerPage />} />
          <Route path=":classId/:studentId" element={<StudentHomeworkListPage />} />
          <Route path=":classId/:studentId/:homeworkId" element={<StudentHomeworkDetailPage />} />
        </Route>
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
