import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type {
  ClassRecord,
  CreateClassInput,
  Question,
  Test,
  Student,
  Session,
  AttendanceStatus,
  Assignment,
  AssignmentKind,
  Message,
} from "../types";

interface Toast {
  id: string;
  message: string;
}

interface AppState {
  classes: ClassRecord[];
  students: Student[];
  tests: Test[];
  sessions: Session[];
  assignments: Assignment[];
  messages: Message[];
  toasts: Toast[];

  // classes
  createClass: (input: CreateClassInput) => ClassRecord;
  updateClassMeetingLink: (classId: string, link: string) => void;

  // students (extension beyond V1 spec)
  addStudent: (
    name: string,
    contact: string,
    classId: string | null,
    extra?: Partial<Pick<Student, "phone" | "email" | "birthYear">>
  ) => void;
  approveStudent: (studentId: string) => void;
  assignStudentToClass: (studentId: string, classId: string | null) => void;
  removeStudent: (studentId: string) => void;
  setEnrollmentStatus: (studentId: string, status: "current" | "former") => void;

  // tests / questions
  createTest: (title: string) => Test;
  saveTest: (testId: string, questions: Question[]) => void;

  // sessions & attendance (extension beyond V1 spec)
  addSession: (classId: string, date: string, durationHours: number, topic: string) => void;
  updateSession: (sessionId: string, patch: Partial<Pick<Session, "date" | "durationHours" | "topic">>) => void;
  deleteSession: (sessionId: string) => void;
  setAttendance: (sessionId: string, studentId: string, status: AttendanceStatus) => void;
  setAttendanceNote: (sessionId: string, studentId: string, note: string) => void;

  // assignments & tests assigned to a class (extension beyond V1 spec)
  addAssignment: (classId: string, title: string, kind: AssignmentKind, dueDate: string | undefined, testIds: string[]) => void;
  deleteAssignment: (assignmentId: string) => void;
  toggleSubmission: (assignmentId: string, studentId: string) => void;

  // class discussion (extension beyond V1 spec)
  addMessage: (classId: string, content: string, authorType: "teacher" | "student", authorName: string, image?: string) => void;
  deleteMessage: (messageId: string) => void;

  // toasts
  pushToast: (message: string) => void;
  dismissToast: (id: string) => void;

  // derived helpers
  classStats: (classId: string) => { studentCount: number; pendingCount: number };
}

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

export const useAppStore = create<AppState>((set, get) => ({
  classes: [
    {
      id: "c1",
      name: "Giao Tiếp — Tối 2-4-6",
      product: "general_communication",
      level: "A1",
      schedule: { days: ["Thứ 2", "Thứ 4", "Thứ 6"], startTime: "19:30", endTime: "21:00" },
      studentCount: 5,
      pendingStudentCount: 1,
      status: "active",
      meetingLink: "",
    },
    {
      id: "c2",
      name: "Đi Làm — Sáng 3-5-7",
      product: "work_communication",
      level: "B1",
      schedule: { days: ["Thứ 3", "Thứ 5", "Thứ 7"], startTime: "08:00", endTime: "09:30" },
      studentCount: 8,
      status: "active",
      meetingLink: "",
    },
    {
      id: "c3",
      name: "Giao Tiếp — Chồi Cuối Tuần",
      product: "general_communication",
      level: "A2",
      studentCount: 3,
      status: "active",
      meetingLink: "",
    },
  ],

  students: [
    { id: "s1", name: "Nguyễn Thu Hà", contact: "ha.nguyen@gmail.com", email: "ha.nguyen@gmail.com", phone: "0903 111 222", birthYear: 2009, classId: "c1", status: "active", enrollmentStatus: "current", joinedAt: now(), attendanceRate: 100, submittedRate: 100, correctRate: 79, score: 1280, totalScore: 1600 },
    { id: "s2", name: "Trần Minh Khang", contact: "0987 123 456", phone: "0987 123 456", birthYear: 2009, classId: "c1", status: "active", enrollmentStatus: "current", joinedAt: now(), attendanceRate: 100, submittedRate: 50, correctRate: 65, score: undefined, totalScore: 1600 },
    { id: "s3", name: "Lê Bảo Ngọc", contact: "ngoc.le@gmail.com", email: "ngoc.le@gmail.com", birthYear: 2010, classId: "c1", status: "active", enrollmentStatus: "current", joinedAt: now(), attendanceRate: 0, submittedRate: 0, correctRate: undefined, score: undefined, totalScore: 1600 },
    { id: "s4", name: "Phạm Anh Tuấn", contact: "0912 345 678", phone: "0912 345 678", birthYear: 2009, classId: "c1", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s5", name: "Vũ Thảo My", contact: "thaomy.vu@gmail.com", email: "thaomy.vu@gmail.com", classId: "c1", status: "pending", enrollmentStatus: "current", joinedAt: now() },
    { id: "s6", name: "Đỗ Gia Hưng", contact: "0901 222 333", phone: "0901 222 333", classId: "c2", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s7", name: "Hoàng Diệu Linh", contact: "linh.hoang@gmail.com", email: "linh.hoang@gmail.com", classId: "c2", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s8", name: "Bùi Nhật Nam", contact: "0933 444 555", phone: "0933 444 555", classId: "c2", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s9", name: "Ngô Khánh Vy", contact: "vy.ngo@gmail.com", email: "vy.ngo@gmail.com", classId: "c2", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s10", name: "Cao Đức Anh", contact: "0977 888 999", phone: "0977 888 999", classId: "c2", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s11", name: "Trịnh Bích Ngân", contact: "ngan.trinh@gmail.com", email: "ngan.trinh@gmail.com", classId: "c2", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s12", name: "Lý Thành Đạt", contact: "0966 111 222", phone: "0966 111 222", classId: "c2", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s13", name: "Đặng Yến Nhi", contact: "nhi.dang@gmail.com", email: "nhi.dang@gmail.com", classId: "c2", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s14", name: "Phan Quốc Huy", contact: "huy.phan@gmail.com", email: "huy.phan@gmail.com", classId: "c3", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s15", name: "Vương Kim Chi", contact: "0955 666 777", phone: "0955 666 777", classId: "c3", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s16", name: "Mai Xuân Sơn", contact: "son.mai@gmail.com", email: "son.mai@gmail.com", classId: "c3", status: "active", enrollmentStatus: "current", joinedAt: now() },
    { id: "s17", name: "Đinh Thùy Trang", contact: "0944 555 666", phone: "0944 555 666", classId: null, status: "pending", enrollmentStatus: "current", joinedAt: now() },
  ],

  tests: [],

  sessions: [
    {
      id: "sess1",
      classId: "c1",
      date: today(),
      durationHours: 1.5,
      topic: "Advanced Math — hàm bậc hai",
      attendance: [
        { studentId: "s1", status: "present" },
        { studentId: "s2", status: "present" },
        { studentId: "s3", status: "absent" },
      ],
    },
  ],

  assignments: [
    {
      id: "as1",
      classId: "c1",
      title: "Bài tập tuần 1 — Math + Verbal",
      kind: "homework",
      dueDate: today(),
      testIds: [],
      submissions: [{ studentId: "s1", submittedAt: now() }, { studentId: "s2", submittedAt: now() }],
      createdAt: now(),
    },
    {
      id: "as2",
      classId: "c1",
      title: "Thi thử đầu vào (đề 05)",
      kind: "test",
      dueDate: today(),
      testIds: [],
      submissions: [{ studentId: "s1", submittedAt: now() }],
      createdAt: now(),
    },
  ],

  messages: [
    {
      id: "m1",
      classId: "c1",
      authorType: "teacher",
      authorName: "Giáo viên",
      content: "Cả lớp nhớ nộp bài tuần 1 trước tối thứ 6 nhé. Buổi tới chữa Advanced Math.",
      createdAt: now(),
    },
    {
      id: "m2",
      classId: "c1",
      authorType: "student",
      authorName: "Trần Minh Khang",
      content: "Thầy ơi bài B-M01 câu 4 em ra k = -8 mà đáp án là -6, thầy giải thích giúp em với ạ.",
      createdAt: now(),
    },
  ],

  toasts: [],

  createClass: (input) => {
    const newClass: ClassRecord = {
      id: uuid(),
      name: input.name,
      product: input.product!,
      level: input.level!,
      schedule:
        input.schedule && input.schedule.days.length > 0
          ? input.schedule
          : undefined,
      studentCount: 0,
      status: "active",
      meetingLink: "",
    };
    set((state) => ({ classes: [newClass, ...state.classes] }));
    return newClass;
  },

  updateClassMeetingLink: (classId, link) => {
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classId ? { ...c, meetingLink: link } : c
      ),
    }));
  },

  addStudent: (name, contact, classId, extra) => {
    const student: Student = {
      id: uuid(),
      name,
      contact,
      classId,
      status: "active",
      enrollmentStatus: "current",
      joinedAt: now(),
      ...extra,
    };
    set((state) => ({ students: [student, ...state.students] }));
  },

  approveStudent: (studentId) => {
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId ? { ...s, status: "active" } : s
      ),
    }));
  },

  assignStudentToClass: (studentId, classId) => {
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId ? { ...s, classId } : s
      ),
    }));
  },

  removeStudent: (studentId) => {
    set((state) => ({
      students: state.students.filter((s) => s.id !== studentId),
    }));
  },

  setEnrollmentStatus: (studentId, status) => {
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId ? { ...s, enrollmentStatus: status } : s
      ),
    }));
  },

  createTest: (title) => {
    const firstQuestion: Question = {
      id: uuid(),
      type: "multiple_choice",
      content: "",
      options: makeDefaultOptions(),
      order: 0,
    };
    const test: Test = {
      id: uuid(),
      title,
      questions: [firstQuestion],
      createdAt: now(),
    };
    set((state) => ({ tests: [test, ...state.tests] }));
    return test;
  },

  saveTest: (testId, questions) => {
    set((state) => ({
      tests: state.tests.map((t) =>
        t.id === testId ? { ...t, questions } : t
      ),
    }));
  },

  addSession: (classId, date, durationHours, topic) => {
    const roster = get().students.filter((s) => s.classId === classId && s.enrollmentStatus !== "former");
    const session: Session = {
      id: uuid(),
      classId,
      date,
      durationHours,
      topic,
      attendance: roster.map((s) => ({ studentId: s.id, status: "present" as AttendanceStatus })),
    };
    set((state) => ({ sessions: [session, ...state.sessions] }));
  },

  updateSession: (sessionId, patch) => {
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === sessionId ? { ...s, ...patch } : s)),
    }));
  },

  deleteSession: (sessionId) => {
    set((state) => ({ sessions: state.sessions.filter((s) => s.id !== sessionId) }));
  },

  setAttendance: (sessionId, studentId, status) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              attendance: s.attendance.map((a) =>
                a.studentId === studentId ? { ...a, status } : a
              ),
            }
          : s
      ),
    }));
  },

  setAttendanceNote: (sessionId, studentId, note) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              attendance: s.attendance.map((a) =>
                a.studentId === studentId ? { ...a, note } : a
              ),
            }
          : s
      ),
    }));
  },

  addAssignment: (classId, title, kind, dueDate, testIds) => {
    const assignment: Assignment = {
      id: uuid(),
      classId,
      title,
      kind,
      dueDate,
      testIds,
      submissions: [],
      createdAt: now(),
    };
    set((state) => ({ assignments: [assignment, ...state.assignments] }));
  },

  deleteAssignment: (assignmentId) => {
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== assignmentId),
    }));
  },

  toggleSubmission: (assignmentId, studentId) => {
    set((state) => ({
      assignments: state.assignments.map((a) => {
        if (a.id !== assignmentId) return a;
        const alreadySubmitted = a.submissions.some((sub) => sub.studentId === studentId);
        return {
          ...a,
          submissions: alreadySubmitted
            ? a.submissions.filter((sub) => sub.studentId !== studentId)
            : [...a.submissions, { studentId, submittedAt: now() }],
        };
      }),
    }));
  },

  addMessage: (classId, content, authorType, authorName, image) => {
    const message: Message = {
      id: uuid(),
      classId,
      authorType,
      authorName,
      content,
      image,
      createdAt: now(),
    };
    set((state) => ({ messages: [...state.messages, message] }));
  },

  deleteMessage: (messageId) => {
    set((state) => ({ messages: state.messages.filter((m) => m.id !== messageId) }));
  },

  pushToast: (message) => {
    const id = uuid();
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => get().dismissToast(id), 3200);
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  classStats: (classId) => {
    const students = get().students.filter((s) => s.classId === classId);
    return {
      studentCount: students.filter((s) => s.status === "active" && s.enrollmentStatus !== "former").length,
      pendingCount: students.filter((s) => s.status === "pending").length,
    };
  },
}));

export function makeDefaultOptions() {
  return ["A", "B", "C", "D"].map((label) => ({
    id: uuid(),
    label,
    text: "",
  }));
}

export function nextOptionLabel(existing: { label: string }[]): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[existing.length] ?? `#${existing.length + 1}`;
}
