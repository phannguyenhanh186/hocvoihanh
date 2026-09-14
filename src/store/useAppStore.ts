import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import { firestoreStorage } from "../lib/firestoreStorage";
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
  AudioAsset,
  Flashcard,
  FlashcardSet,
  ListeningMaterial,
  ReadingMaterial,
  GrammarTest,
  ListeningExercise,
  ReadingExercise,
  VocabularyTest,
  VocabQuestion,
  VocabQuestionType,
  ExerciseSummary,
  Level,
  HomeworkPackage,
  BankPickerRow,
  CreateHomeworkInput,
  HomeworkContentItem,
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

  // ---- Content & Exercise Bank (extension beyond V1 spec) ----
  audioAssets: AudioAsset[];
  flashcardSets: FlashcardSet[];
  listeningMaterials: ListeningMaterial[];
  readingMaterials: ReadingMaterial[];
  grammarTests: GrammarTest[];
  listeningExercises: ListeningExercise[];
  readingExercises: ReadingExercise[];
  vocabularyTests: VocabularyTest[];

  // ---- Giao BTVN / Homework packages (Task 2) ----
  homeworkPackages: HomeworkPackage[];

  // classes
  createClass: (input: CreateClassInput) => ClassRecord;
  deleteClass: (id: string) => void;
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

  // ---- Content & Exercise Bank actions (extension beyond V1 spec) ----
  addAudioAsset: (name: string, dataUrl: string) => AudioAsset;

  createFlashcardSet: (title: string) => FlashcardSet;
  updateFlashcardSet: (setId: string, title: string) => void;
  deleteFlashcardSet: (setId: string) => void;
  duplicateFlashcardSet: (setId: string) => void;
  addFlashcard: (setId: string) => void;
  updateFlashcard: (setId: string, cardId: string, patch: Partial<Flashcard>) => void;
  deleteFlashcard: (setId: string, cardId: string) => void;

  createListeningMaterial: (title: string) => ListeningMaterial;
  updateListeningMaterial: (id: string, patch: Partial<ListeningMaterial>) => void;
  deleteListeningMaterial: (id: string) => void;

  createReadingMaterial: (title: string) => ReadingMaterial;
  updateReadingMaterial: (id: string, patch: Partial<ReadingMaterial>) => void;
  deleteReadingMaterial: (id: string) => void;

  createGrammarTest: (title: string, level?: Level) => GrammarTest;
  saveGrammarTest: (id: string, questions: Question[], title?: string, level?: Level) => void;
  deleteGrammarTest: (id: string) => void;
  duplicateGrammarTest: (id: string) => void;

  createListeningExercise: (title: string, materialId: string, level?: Level) => ListeningExercise;
  saveListeningExercise: (id: string, questions: Question[], title?: string) => void;
  deleteListeningExercise: (id: string) => void;
  duplicateListeningExercise: (id: string) => void;

  createReadingExercise: (title: string, materialId: string, level?: Level) => ReadingExercise;
  saveReadingExercise: (id: string, questions: Question[], title?: string) => void;
  deleteReadingExercise: (id: string) => void;
  duplicateReadingExercise: (id: string) => void;

  createVocabularyTest: (title: string, flashcardSetIds: string[], level?: Level) => VocabularyTest;
  generateVocabQuestions: (testId: string, types: VocabQuestionType[]) => void;
  saveVocabularyTest: (id: string, questions: VocabQuestion[], title?: string) => void;
  deleteVocabularyTest: (id: string) => void;
  duplicateVocabularyTest: (id: string) => void;

  exerciseBank: () => ExerciseSummary[];

  // ---- Giao BTVN / Homework packages (Task 2) ----
  // Rows shown in the Content Picker — live pointers into the bank
  // (Flashcard Sets + everything exerciseBank() already covers).
  bankPickerRows: () => BankPickerRow[];
  // Snapshots every selected item and creates the homework package.
  // This is the one moment content gets frozen — nothing before or after
  // this call re-reads from the live bank.
  createHomework: (input: CreateHomeworkInput) => HomeworkPackage;
  deleteHomework: (id: string) => void;

  // derived helpers
  classStats: (classId: string) => { studentCount: number; pendingCount: number };
}

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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

  audioAssets: [],
  flashcardSets: [],
  listeningMaterials: [],
  readingMaterials: [],
  grammarTests: [],
  listeningExercises: [],
  readingExercises: [],
  vocabularyTests: [],
  homeworkPackages: [],

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

  deleteClass: (id) => {
    // Unassign (not delete) students — the roster is still useful in
    // "Quản lý học viên" even once their class is gone. Everything else
    // that's scoped to this class (sessions, assignments, discussion,
    // homework already sent) is removed with it.
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
      students: state.students.map((st) => (st.classId === id ? { ...st, classId: null } : st)),
      sessions: state.sessions.filter((s) => s.classId !== id),
      assignments: state.assignments.filter((a) => a.classId !== id),
      messages: state.messages.filter((m) => m.classId !== id),
      homeworkPackages: state.homeworkPackages.filter((h) => h.classId !== id),
    }));
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

  // ---- Content & Exercise Bank implementations ----

  addAudioAsset: (name, dataUrl) => {
    const asset: AudioAsset = { id: uuid(), name, dataUrl, createdAt: now() };
    set((state) => ({ audioAssets: [asset, ...state.audioAssets] }));
    return asset;
  },

  createFlashcardSet: (title) => {
    const set_: FlashcardSet = { id: uuid(), title, cards: [], createdAt: now() };
    set((state) => ({ flashcardSets: [set_, ...state.flashcardSets] }));
    return set_;
  },

  updateFlashcardSet: (setId, title) => {
    set((state) => ({
      flashcardSets: state.flashcardSets.map((s) => (s.id === setId ? { ...s, title } : s)),
    }));
  },

  deleteFlashcardSet: (setId) => {
    set((state) => ({ flashcardSets: state.flashcardSets.filter((s) => s.id !== setId) }));
  },

  duplicateFlashcardSet: (setId) => {
    const original = get().flashcardSets.find((s) => s.id === setId);
    if (!original) return;
    const copy: FlashcardSet = {
      id: uuid(),
      title: `${original.title} (bản sao)`,
      cards: original.cards.map((c) => ({ ...c, id: uuid() })),
      createdAt: now(),
    };
    set((state) => ({ flashcardSets: [copy, ...state.flashcardSets] }));
  },

  addFlashcard: (setId) => {
    set((state) => ({
      flashcardSets: state.flashcardSets.map((s) =>
        s.id === setId
          ? {
              ...s,
              cards: [
                ...s.cards,
                { id: uuid(), word: "", meaning: "", order: s.cards.length },
              ],
            }
          : s
      ),
    }));
  },

  updateFlashcard: (setId, cardId, patch) => {
    set((state) => ({
      flashcardSets: state.flashcardSets.map((s) =>
        s.id === setId
          ? { ...s, cards: s.cards.map((c) => (c.id === cardId ? { ...c, ...patch } : c)) }
          : s
      ),
    }));
  },

  deleteFlashcard: (setId, cardId) => {
    set((state) => ({
      flashcardSets: state.flashcardSets.map((s) =>
        s.id === setId
          ? { ...s, cards: s.cards.filter((c) => c.id !== cardId).map((c, idx) => ({ ...c, order: idx })) }
          : s
      ),
    }));
  },

  createListeningMaterial: (title) => {
    const material: ListeningMaterial = { id: uuid(), title, createdAt: now() };
    set((state) => ({ listeningMaterials: [material, ...state.listeningMaterials] }));
    return material;
  },

  updateListeningMaterial: (id, patch) => {
    set((state) => ({
      listeningMaterials: state.listeningMaterials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  },

  deleteListeningMaterial: (id) => {
    set((state) => ({ listeningMaterials: state.listeningMaterials.filter((m) => m.id !== id) }));
  },

  createReadingMaterial: (title) => {
    const material: ReadingMaterial = { id: uuid(), title, text: "", createdAt: now() };
    set((state) => ({ readingMaterials: [material, ...state.readingMaterials] }));
    return material;
  },

  updateReadingMaterial: (id, patch) => {
    set((state) => ({
      readingMaterials: state.readingMaterials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  },

  deleteReadingMaterial: (id) => {
    set((state) => ({ readingMaterials: state.readingMaterials.filter((m) => m.id !== id) }));
  },

  createGrammarTest: (title, level) => {
    const test: GrammarTest = {
      id: uuid(),
      title,
      level,
      questions: [
        { id: uuid(), type: "multiple_choice", content: "", options: makeDefaultOptions(), order: 0 },
      ],
      createdAt: now(),
    };
    set((state) => ({ grammarTests: [test, ...state.grammarTests] }));
    return test;
  },

  saveGrammarTest: (id, questions, title, level) => {
    set((state) => ({
      grammarTests: state.grammarTests.map((t) =>
        t.id === id ? { ...t, questions, ...(title ? { title } : {}), ...(level ? { level } : {}) } : t
      ),
    }));
  },

  deleteGrammarTest: (id) => {
    set((state) => ({ grammarTests: state.grammarTests.filter((t) => t.id !== id) }));
  },

  duplicateGrammarTest: (id) => {
    const original = get().grammarTests.find((t) => t.id === id);
    if (!original) return;
    const copy: GrammarTest = {
      ...original,
      id: uuid(),
      title: `${original.title} (bản sao)`,
      questions: original.questions.map((q) => ({ ...q, id: uuid() })),
      createdAt: now(),
    };
    set((state) => ({ grammarTests: [copy, ...state.grammarTests] }));
  },

  createListeningExercise: (title, materialId, level) => {
    const exercise: ListeningExercise = {
      id: uuid(),
      title,
      materialId,
      level,
      questions: [
        { id: uuid(), type: "multiple_choice", content: "", options: makeDefaultOptions(), order: 0 },
      ],
      createdAt: now(),
    };
    set((state) => ({ listeningExercises: [exercise, ...state.listeningExercises] }));
    return exercise;
  },

  saveListeningExercise: (id, questions, title) => {
    set((state) => ({
      listeningExercises: state.listeningExercises.map((e) =>
        e.id === id ? { ...e, questions, ...(title ? { title } : {}) } : e
      ),
    }));
  },

  deleteListeningExercise: (id) => {
    set((state) => ({ listeningExercises: state.listeningExercises.filter((e) => e.id !== id) }));
  },

  duplicateListeningExercise: (id) => {
    const original = get().listeningExercises.find((e) => e.id === id);
    if (!original) return;
    const copy: ListeningExercise = {
      ...original,
      id: uuid(),
      title: `${original.title} (bản sao)`,
      questions: original.questions.map((q) => ({ ...q, id: uuid() })),
      createdAt: now(),
    };
    set((state) => ({ listeningExercises: [copy, ...state.listeningExercises] }));
  },

  createReadingExercise: (title, materialId, level) => {
    const exercise: ReadingExercise = {
      id: uuid(),
      title,
      materialId,
      level,
      questions: [
        { id: uuid(), type: "multiple_choice", content: "", options: makeDefaultOptions(), order: 0 },
      ],
      createdAt: now(),
    };
    set((state) => ({ readingExercises: [exercise, ...state.readingExercises] }));
    return exercise;
  },

  saveReadingExercise: (id, questions, title) => {
    set((state) => ({
      readingExercises: state.readingExercises.map((e) =>
        e.id === id ? { ...e, questions, ...(title ? { title } : {}) } : e
      ),
    }));
  },

  deleteReadingExercise: (id) => {
    set((state) => ({ readingExercises: state.readingExercises.filter((e) => e.id !== id) }));
  },

  duplicateReadingExercise: (id) => {
    const original = get().readingExercises.find((e) => e.id === id);
    if (!original) return;
    const copy: ReadingExercise = {
      ...original,
      id: uuid(),
      title: `${original.title} (bản sao)`,
      questions: original.questions.map((q) => ({ ...q, id: uuid() })),
      createdAt: now(),
    };
    set((state) => ({ readingExercises: [copy, ...state.readingExercises] }));
  },

  createVocabularyTest: (title, flashcardSetIds, level) => {
    const test: VocabularyTest = {
      id: uuid(),
      title,
      level,
      flashcardSetIds,
      questions: [],
      createdAt: now(),
    };
    set((state) => ({ vocabularyTests: [test, ...state.vocabularyTests] }));
    return test;
  },

  generateVocabQuestions: (testId, types) => {
    const test = get().vocabularyTests.find((t) => t.id === testId);
    if (!test) return;
    const sets = get().flashcardSets.filter((s) => test.flashcardSetIds.includes(s.id));
    const allCards = sets.flatMap((s) => s.cards).filter((c) => c.word.trim());
    if (allCards.length === 0) return;

    function distractors(correct: string, pool: string[], count = 3): string[] {
      const options = pool.filter((p) => p !== correct);
      const shuffled = [...options].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    }

    const newQuestions: VocabQuestion[] = [];
    let order = test.questions.length;

    for (const card of allCards) {
      for (const type of types) {
        if (type === "listen_choose_word" || type === "see_word_choose_meaning" || type === "listen_choose_meaning") {
          const isWordAnswer = type === "listen_choose_word";
          const correct = isWordAnswer ? card.word : card.meaning;
          const pool = allCards.map((c) => (isWordAnswer ? c.word : c.meaning));
          const choices = [...distractors(correct, pool), correct].sort(() => Math.random() - 0.5);
          newQuestions.push({
            id: uuid(),
            type,
            flashcardId: card.id,
            prompt:
              type === "see_word_choose_meaning"
                ? card.word
                : "(Nghe audio và chọn đáp án đúng)",
            choices,
            correctAnswer: correct,
            order: order++,
          });
        } else if (type === "listen_type_word") {
          newQuestions.push({
            id: uuid(),
            type,
            flashcardId: card.id,
            prompt: "(Nghe audio và gõ lại từ)",
            correctAnswer: card.word,
            order: order++,
          });
        } else if (type === "fill_blank") {
          const blanked = card.example
            ? card.example.replace(new RegExp(card.word, "i"), "____")
            : `____ nghĩa là "${card.meaning}"`;
          newQuestions.push({
            id: uuid(),
            type,
            flashcardId: card.id,
            prompt: blanked,
            correctAnswer: card.word,
            order: order++,
          });
        }
      }
    }

    set((state) => ({
      vocabularyTests: state.vocabularyTests.map((t) =>
        t.id === testId ? { ...t, questions: [...t.questions, ...newQuestions] } : t
      ),
    }));
  },

  saveVocabularyTest: (id, questions, title) => {
    set((state) => ({
      vocabularyTests: state.vocabularyTests.map((t) =>
        t.id === id ? { ...t, questions, ...(title ? { title } : {}) } : t
      ),
    }));
  },

  deleteVocabularyTest: (id) => {
    set((state) => ({ vocabularyTests: state.vocabularyTests.filter((t) => t.id !== id) }));
  },

  duplicateVocabularyTest: (id) => {
    const original = get().vocabularyTests.find((t) => t.id === id);
    if (!original) return;
    const copy: VocabularyTest = {
      ...original,
      id: uuid(),
      title: `${original.title} (bản sao)`,
      questions: original.questions.map((q) => ({ ...q, id: uuid() })),
      createdAt: now(),
    };
    set((state) => ({ vocabularyTests: [copy, ...state.vocabularyTests] }));
  },

  exerciseBank: () => {
    const state = get();
    const rows: ExerciseSummary[] = [
      ...state.vocabularyTests.map((t) => ({
        id: t.id,
        kind: "vocabulary" as const,
        title: t.title,
        level: t.level,
        questionCount: t.questions.length,
        createdAt: t.createdAt,
      })),
      ...state.grammarTests.map((t) => ({
        id: t.id,
        kind: "grammar" as const,
        title: t.title,
        level: t.level,
        questionCount: t.questions.length,
        createdAt: t.createdAt,
      })),
      ...state.listeningExercises.map((e) => ({
        id: e.id,
        kind: "listening" as const,
        title: e.title,
        level: e.level,
        questionCount: e.questions.length,
        createdAt: e.createdAt,
      })),
      ...state.readingExercises.map((e) => ({
        id: e.id,
        kind: "reading" as const,
        title: e.title,
        level: e.level,
        questionCount: e.questions.length,
        createdAt: e.createdAt,
      })),
    ];
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  bankPickerRows: () => {
    const state = get();
    const rows: BankPickerRow[] = [
      ...state.flashcardSets.map((s) => ({
        kind: "flashcard" as const,
        id: s.id,
        title: s.title,
        count: s.cards.length,
        createdAt: s.createdAt,
      })),
      ...state.exerciseBank().map((e) => ({
        kind: e.kind,
        id: e.id,
        title: e.title,
        level: e.level,
        count: e.questionCount,
        createdAt: e.createdAt,
      })),
    ];
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  createHomework: (input) => {
    const state = get();

    // --- Publish Snapshot ---
    // Deep-copy each selected item's *current* content into a frozen
    // snapshot. From this point on, editing the source in the bank must
    // never change what's inside this homework package.
    const items: HomeworkContentItem[] = input.items.reduce<HomeworkContentItem[]>((acc, ref, index) => {
      const order = index;
      if (ref.kind === "flashcard") {
        const s = state.flashcardSets.find((x) => x.id === ref.sourceId);
        if (!s) return acc;
        acc.push({
          id: uuid(),
          order,
          sourceKind: "flashcard",
          sourceId: s.id,
          title: s.title,
          cards: s.cards.map((c) => ({ ...c })),
        });
      } else if (ref.kind === "grammar") {
        const t = state.grammarTests.find((x) => x.id === ref.sourceId);
        if (!t) return acc;
        acc.push({
          id: uuid(),
          order,
          sourceKind: "grammar",
          sourceId: t.id,
          title: t.title,
          level: t.level,
          questions: t.questions.map((q) => ({ ...q, options: q.options?.map((o) => ({ ...o })) })),
        });
      } else if (ref.kind === "vocabulary") {
        const t = state.vocabularyTests.find((x) => x.id === ref.sourceId);
        if (!t) return acc;
        acc.push({
          id: uuid(),
          order,
          sourceKind: "vocabulary",
          sourceId: t.id,
          title: t.title,
          level: t.level,
          questions: t.questions.map((q) => ({ ...q, choices: q.choices ? [...q.choices] : undefined })),
          audioId: t.audioId,
        });
      } else if (ref.kind === "listening") {
        const e = state.listeningExercises.find((x) => x.id === ref.sourceId);
        if (!e) return acc;
        const m = state.listeningMaterials.find((x) => x.id === e.materialId);
        acc.push({
          id: uuid(),
          order,
          sourceKind: "listening",
          sourceId: e.id,
          title: e.title,
          level: e.level,
          questions: e.questions.map((q) => ({ ...q, options: q.options?.map((o) => ({ ...o })) })),
          materialTitle: m?.title,
          transcript: m?.transcript,
          audioId: m?.audioId,
        });
      } else if (ref.kind === "reading") {
        const e = state.readingExercises.find((x) => x.id === ref.sourceId);
        if (!e) return acc;
        const m = state.readingMaterials.find((x) => x.id === e.materialId);
        acc.push({
          id: uuid(),
          order,
          sourceKind: "reading",
          sourceId: e.id,
          title: e.title,
          level: e.level,
          questions: e.questions.map((q) => ({ ...q, options: q.options?.map((o) => ({ ...o })) })),
          materialTitle: m?.title,
          materialText: m?.text,
          audioId: m?.audioId,
        });
      }
      return acc;
    }, []);

    const pkg: HomeworkPackage = {
      id: uuid(),
      title: input.title,
      classId: input.classId,
      recipientType: input.recipientType,
      studentIds: input.recipientType === "students" ? input.studentIds : [],
      items,
      assignedDate: input.assignedDate,
      dueDate: input.dueDate,
      createdAt: now(),
    };

    set((state) => ({ homeworkPackages: [pkg, ...state.homeworkPackages] }));
    return pkg;
  },

  deleteHomework: (id) => {
    set((state) => ({ homeworkPackages: state.homeworkPackages.filter((h) => h.id !== id) }));
  },
}),
    {
      name: "hocvoihanh-teacher-dashboard",
      version: 1,
      // Shared Firestore document instead of this browser's localStorage —
      // see src/lib/firestoreStorage.ts for why.
      storage: createJSONStorage(() => firestoreStorage),
      // Only persist actual data — never the derived/selector or action
      // functions (they aren't serializable anyway, and re-attaching the
      // freshest function bodies on every load is what lets us ship code
      // updates without wiping what teachers already uploaded).
      partialize: (state) => ({
        classes: state.classes,
        students: state.students,
        tests: state.tests,
        sessions: state.sessions,
        assignments: state.assignments,
        messages: state.messages,
        audioAssets: state.audioAssets,
        flashcardSets: state.flashcardSets,
        listeningMaterials: state.listeningMaterials,
        readingMaterials: state.readingMaterials,
        grammarTests: state.grammarTests,
        listeningExercises: state.listeningExercises,
        readingExercises: state.readingExercises,
        vocabularyTests: state.vocabularyTests,
        homeworkPackages: state.homeworkPackages,
      }),
    }
  )
);

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
