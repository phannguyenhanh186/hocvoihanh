# Teacher Dashboard

A Vietnamese teacher dashboard built with React + TypeScript + Vite + Tailwind CSS.

## Scope

**From the V1 spec (implemented as written):**
- **Lớp học** (`/teacher/classes`) — class list, summary cards, create-class modal (product, name, level, optional schedule)
- **Kho bài của tôi** (`/teacher/content`, `/teacher/content/create`) — content library and a full question editor: multiple choice / short answer / essay, image upload + paste (Ctrl+V), auto-numbered and auto-renumbered questions, correct-answer validation, optional explanation field

**Extension beyond the V1 spec, added on request:**
- **Quản lý học viên** (`/teacher/students`) — student list, search/filter, approve pending students, assign/reassign a student to a class, add/remove students

Revenue and tuition management were **not** built — nothing in the request asked for them, and the source spec explicitly excludes them.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build
```

## Notes on architecture

- State lives in a single Zustand store (`src/store/useAppStore.ts`) seeded with mock classes/students so the app is usable immediately — swap the store's actions for real API calls when a backend exists.
- Images are stored as base64 data URLs in memory (no backend), per the "simplest implementation" guidance in the spec.
- Question numbering is derived from array order, never stored as a persistent field, so delete/renumber is automatic.
- Toasts are a minimal custom implementation (array in the store, auto-dismiss timers) since no existing toast system was present to reuse.
