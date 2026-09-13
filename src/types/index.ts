// ---------- Class management ----------

export type ProductType = "general_communication" | "work_communication";

export type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";

export const PRODUCT_LABELS: Record<ProductType, string> = {
  general_communication: "Giao tiếp chung",
  work_communication: "Đi làm chung",
};

export const LEVEL_LABELS: Record<Level, string> = {
  A0: "Hạt (A0)",
  A1: "Mầm (A1)",
  A2: "Chồi (A2)",
  B1: "Cành (B1)",
  B2: "Lá (B2)",
  C1: "Hoa (C1)",
};

export const WEEKDAYS = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
] as const;

export interface ClassSchedule {
  days: string[];
  startTime?: string;
  endTime?: string;
}

export interface ClassRecord {
  id: string;
  name: string;
  product: ProductType;
  level: Level;
  schedule?: ClassSchedule;
  studentCount: number;
  pendingStudentCount?: number;
  status: "active" | "inactive";
  meetingLink?: string;
}

export interface CreateClassInput {
  name: string;
  product: ProductType | null;
  level: Level | null;
  schedule?: ClassSchedule;
}

// ---------- Question / content editor ----------

export type QuestionType = "multiple_choice" | "short_answer" | "essay";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Trắc nghiệm",
  short_answer: "Trả lời ngắn",
  essay: "Tự luận — cô chấm",
};

export interface Option {
  id: string;
  label: string; // A, B, C, D, E, ...
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  image?: string;
  options?: Option[];
  correctOptionId?: string;
  expectedAnswer?: string;
  explanation?: string;
  order: number;
}

export interface Test {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

// ---------- Student management (extension beyond V1 spec) ----------

export type StudentStatus = "active" | "pending";

// Enrollment lifecycle within a class, independent of the approval status
// above. "current" = đang học, "former" = học viên cũ (kept for history,
// doesn't count toward the class's active headcount).
export type EnrollmentStatus = "current" | "former";

export interface Student {
  id: string;
  name: string;
  contact: string; // email or phone, used on the global "Quản lý học viên" page
  phone?: string;
  email?: string;
  birthYear?: number;
  classId: string | null;
  status: StudentStatus;
  enrollmentStatus?: EnrollmentStatus;
  joinedAt: string;
  // Per-class performance snapshot (mock/manually-entered in V1, no grading engine yet)
  attendanceRate?: number; // % chuyên cần
  submittedRate?: number; // % đã nộp bài
  correctRate?: number; // % đúng
  score?: number; // điểm đạt được
  totalScore?: number; // tổng điểm (thang điểm của bài thi gần nhất)
}

// ---------- Sessions & attendance (extension beyond V1 spec) ----------

export type AttendanceStatus = "present" | "late" | "absent";

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: "Có",
  late: "Muộn",
  absent: "Vắng",
};

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface Session {
  id: string;
  classId: string;
  date: string; // yyyy-mm-dd
  durationHours: number;
  topic: string;
  attendance: AttendanceEntry[];
}

// ---------- Assignments & tests assigned to a class (extension) ----------

export type AssignmentKind = "homework" | "test";

export interface AssignmentSubmission {
  studentId: string;
  submittedAt?: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  kind: AssignmentKind;
  dueDate?: string;
  testIds: string[]; // references Test.id from the content library
  submissions: AssignmentSubmission[];
  createdAt: string;
}

// ---------- Class discussion / announcements (extension) ----------

export interface Message {
  id: string;
  classId: string;
  authorType: "teacher" | "student";
  authorName: string;
  content: string;
  image?: string;
  createdAt: string;
}

// ---------- Content & Exercise Bank (Kho nội dung & Bài tập) ----------

// Reusable audio library: an audio file is uploaded once and referenced
// by id everywhere else (flashcards, listening/reading materials).
export interface AudioAsset {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  word: string;
  meaning: string;
  wordAudioId?: string;
  example?: string;
  exampleAudioId?: string;
  order: number;
}

export interface FlashcardSet {
  id: string;
  title: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface ListeningMaterial {
  id: string;
  title: string;
  audioId?: string;
  transcript?: string;
  createdAt: string;
}

export interface ReadingMaterial {
  id: string;
  title: string;
  text: string;
  audioId?: string;
  createdAt: string;
}

// Grammar Test reuses the existing Test/Question engine (MC + Short Answer),
// just tagged so it shows up in the Exercise Bank. No Lesson relationship.
export interface GrammarTest {
  id: string;
  title: string;
  level?: Level;
  questions: Question[];
  createdAt: string;
}

// Listening / Reading exercises: a material plus MC/Short-Answer questions.
export interface ListeningExercise {
  id: string;
  title: string;
  materialId: string;
  level?: Level;
  questions: Question[];
  createdAt: string;
}

export interface ReadingExercise {
  id: string;
  title: string;
  materialId: string;
  level?: Level;
  questions: Question[];
  createdAt: string;
}

// Vocabulary Test: generated from flashcards, with its own question shape.
export type VocabQuestionType =
  | "listen_choose_word"
  | "see_word_choose_meaning"
  | "listen_choose_meaning"
  | "listen_type_word"
  | "fill_blank";

export const VOCAB_QUESTION_TYPE_LABELS: Record<VocabQuestionType, string> = {
  listen_choose_word: "Nghe → chọn từ",
  see_word_choose_meaning: "Xem từ → chọn nghĩa",
  listen_choose_meaning: "Nghe → chọn nghĩa",
  listen_type_word: "Nghe → gõ lại từ",
  fill_blank: "Điền vào chỗ trống",
};

export interface VocabQuestion {
  id: string;
  type: VocabQuestionType;
  flashcardId: string;
  prompt: string; // display text (word, meaning, or example with blank)
  choices?: string[]; // for choose-type questions
  correctAnswer: string;
  order: number;
}

export interface VocabularyTest {
  id: string;
  title: string;
  level?: Level;
  flashcardSetIds: string[];
  questions: VocabQuestion[];
  createdAt: string;
}

export type ExerciseKind = "vocabulary" | "grammar" | "listening" | "reading";

export const EXERCISE_KIND_LABELS: Record<ExerciseKind, string> = {
  vocabulary: "Vocabulary Test",
  grammar: "Grammar Test",
  listening: "Listening Exercise",
  reading: "Reading Exercise",
};

// Lightweight summary row used by the Exercise Bank list (search/filter view)
export interface ExerciseSummary {
  id: string;
  kind: ExerciseKind;
  title: string;
  level?: Level;
  questionCount: number;
  createdAt: string;
}

// ---------- Giao BTVN (Homework Builder + Assignment) ----------
// Task 2: packages up reusable assets created in Task 1 (the Content &
// Exercise Bank) and assigns them to a class or specific students.
// Nothing here re-creates content — it only references and, on publish,
// snapshots what already exists in the bank.

// A homework package can include any bank exercise kind, plus Flashcard
// Sets (which sit outside ExerciseKind since they have no questions).
export type HomeworkContentKind = ExerciseKind | "flashcard";

export const HOMEWORK_CONTENT_KIND_LABELS: Record<HomeworkContentKind, string> = {
  flashcard: "Flashcard Set",
  vocabulary: "Vocabulary Test",
  grammar: "Grammar Test",
  listening: "Listening Exercise",
  reading: "Reading Exercise",
};

// A row in the Content Picker: a lightweight, kind-tagged pointer at
// something *live* in the bank (source of truth still lives there).
export interface BankPickerRow {
  kind: HomeworkContentKind;
  id: string;
  title: string;
  level?: Level;
  count: number; // question count, or card count for flashcard sets
  createdAt: string;
}

// ---- Homework Snapshot ----
// Frozen, self-contained copies of bank content, captured at the moment
// "Giao BTVN" is clicked. `sourceId`/`sourceKind` are kept only for
// provenance (e.g. "originally made from Grammar Test X") — they are never
// used to re-fetch live data. Editing the original bank item afterwards
// must NOT change these.
interface HomeworkContentItemBase {
  id: string; // snapshot item id (stable within this package)
  order: number;
  sourceKind: HomeworkContentKind;
  sourceId: string; // provenance only
  title: string;
  level?: Level;
}

export interface HomeworkFlashcardSnapshot extends HomeworkContentItemBase {
  sourceKind: "flashcard";
  cards: Flashcard[];
}

export interface HomeworkGrammarSnapshot extends HomeworkContentItemBase {
  sourceKind: "grammar";
  questions: Question[];
}

export interface HomeworkVocabularySnapshot extends HomeworkContentItemBase {
  sourceKind: "vocabulary";
  questions: VocabQuestion[];
}

export interface HomeworkListeningSnapshot extends HomeworkContentItemBase {
  sourceKind: "listening";
  questions: Question[];
  materialTitle?: string;
  transcript?: string;
  audioId?: string;
}

export interface HomeworkReadingSnapshot extends HomeworkContentItemBase {
  sourceKind: "reading";
  questions: Question[];
  materialTitle?: string;
  materialText?: string;
  audioId?: string;
}

export type HomeworkContentItem =
  | HomeworkFlashcardSnapshot
  | HomeworkGrammarSnapshot
  | HomeworkVocabularySnapshot
  | HomeworkListeningSnapshot
  | HomeworkReadingSnapshot;

export type HomeworkRecipientType = "class" | "students";

export interface HomeworkPackage {
  id: string;
  title: string;
  classId: string;
  recipientType: HomeworkRecipientType;
  studentIds: string[]; // only meaningful when recipientType === "students"
  items: HomeworkContentItem[]; // snapshot, in assigned order
  assignedDate: string; // "Ngày giao", yyyy-mm-dd
  dueDate?: string; // "Hạn nộp", yyyy-mm-dd
  createdAt: string;
}

// Draft pointer used while the teacher is still building a homework
// package in the UI — a live reference, not yet snapshotted.
export interface HomeworkDraftItem {
  draftId: string;
  kind: HomeworkContentKind;
  sourceId: string;
}

export interface CreateHomeworkInput {
  title: string;
  classId: string;
  recipientType: HomeworkRecipientType;
  studentIds: string[];
  items: { kind: HomeworkContentKind; sourceId: string }[];
  assignedDate: string;
  dueDate?: string;
}
