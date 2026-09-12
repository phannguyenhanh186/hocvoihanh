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
