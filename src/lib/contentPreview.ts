import {
  FlashcardSet,
  GrammarTest,
  HomeworkContentItem,
  HomeworkContentKind,
  Level,
  ListeningExercise,
  ListeningMaterial,
  Question,
  ReadingExercise,
  ReadingMaterial,
  VocabQuestion,
  VocabularyTest,
} from "../types";

// Uniform shape the preview UI renders from, regardless of whether the
// content is still live in the bank or has been frozen into a homework
// snapshot. Building both sides through this same shape keeps the two
// preview surfaces (Content Picker vs. an already-published BTVN) visually
// identical, which is the point: what the teacher saw when picking it is
// exactly what got frozen.
export interface ContentPreviewData {
  kind: HomeworkContentKind;
  title: string;
  level?: Level;
  count: number;
  questions?: Question[];
  vocabQuestions?: VocabQuestion[];
  cards?: FlashcardSet["cards"];
  materialTitle?: string;
  transcript?: string;
  materialText?: string;
}

interface BankSource {
  flashcardSets: FlashcardSet[];
  grammarTests: GrammarTest[];
  vocabularyTests: VocabularyTest[];
  listeningExercises: ListeningExercise[];
  readingExercises: ReadingExercise[];
  listeningMaterials: ListeningMaterial[];
  readingMaterials: ReadingMaterial[];
}

// Resolves a *live* bank row into preview data. Used by the Content Picker,
// where the teacher is looking at current, editable content.
export function getBankItemPreview(
  bank: BankSource,
  kind: HomeworkContentKind,
  id: string
): ContentPreviewData | null {
  if (kind === "flashcard") {
    const s = bank.flashcardSets.find((x) => x.id === id);
    if (!s) return null;
    return { kind, title: s.title, count: s.cards.length, cards: s.cards };
  }
  if (kind === "grammar") {
    const t = bank.grammarTests.find((x) => x.id === id);
    if (!t) return null;
    return { kind, title: t.title, level: t.level, count: t.questions.length, questions: t.questions };
  }
  if (kind === "vocabulary") {
    const t = bank.vocabularyTests.find((x) => x.id === id);
    if (!t) return null;
    return { kind, title: t.title, level: t.level, count: t.questions.length, vocabQuestions: t.questions };
  }
  if (kind === "listening") {
    const e = bank.listeningExercises.find((x) => x.id === id);
    if (!e) return null;
    const m = bank.listeningMaterials.find((x) => x.id === e.materialId);
    return {
      kind,
      title: e.title,
      level: e.level,
      count: e.questions.length,
      questions: e.questions,
      materialTitle: m?.title,
      transcript: m?.transcript,
    };
  }
  if (kind === "reading") {
    const e = bank.readingExercises.find((x) => x.id === id);
    if (!e) return null;
    const m = bank.readingMaterials.find((x) => x.id === e.materialId);
    return {
      kind,
      title: e.title,
      level: e.level,
      count: e.questions.length,
      questions: e.questions,
      materialTitle: m?.title,
      materialText: m?.text,
    };
  }
  return null;
}

// Resolves a *frozen* homework snapshot item into the same preview shape —
// no lookups into the live bank at all, by design.
export function getSnapshotPreview(item: HomeworkContentItem): ContentPreviewData {
  switch (item.sourceKind) {
    case "flashcard":
      return { kind: "flashcard", title: item.title, count: item.cards.length, cards: item.cards };
    case "grammar":
      return { kind: "grammar", title: item.title, level: item.level, count: item.questions.length, questions: item.questions };
    case "vocabulary":
      return { kind: "vocabulary", title: item.title, level: item.level, count: item.questions.length, vocabQuestions: item.questions };
    case "listening":
      return {
        kind: "listening",
        title: item.title,
        level: item.level,
        count: item.questions.length,
        questions: item.questions,
        materialTitle: item.materialTitle,
        transcript: item.transcript,
      };
    case "reading":
      return {
        kind: "reading",
        title: item.title,
        level: item.level,
        count: item.questions.length,
        questions: item.questions,
        materialTitle: item.materialTitle,
        materialText: item.materialText,
      };
  }
}
