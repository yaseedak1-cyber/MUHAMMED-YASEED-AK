import { PerformanceData } from "./services/analyticsService";

export type Grade = 9 | 10;

export enum Subject {
    Geography = 'Geography',
    Civics = 'Civics (Political Science)',
    History = 'History',
    Economics = 'Economics',
}

export interface Chapter {
  id: string;
  title: string;
}

export type View = 'home' | 'subjectSelection' | 'content' | 'analytics';

export interface AppState {
    currentView: View;
    grade?: Grade;
    subject?: Subject;
}

export interface ChapterContent {
    summary: string;
    keyConcepts: { concept: string; definition: string; }[];
    importantQuestions: { question: string; answer: string; }[];
    revisionNotes: string[];
}

export enum QuestionType {
    MCQ = 'Multiple Choice',
    TrueFalse = 'True/False',
    FillInBlanks = 'Fill in the Blanks',
    ShortAnswer = 'Short Answer',
}

export enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export interface MCQOption {
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    question: string;
    type: QuestionType;
    options?: MCQOption[];
    answer: string;
    explanation: string;
}

export interface QuizSettings {
    chapters: Chapter[];
    questionCount: number;
    difficulty: Difficulty;
    questionTypes: QuestionType[];
}

export interface QuizRecord {
    date: string; // ISO string
    grade: Grade;
    subject: Subject;
    chapters: string[]; // chapter titles
    score: number;
    totalQuestions: number;
    percentage: number;
}

export interface ChapterProgress {
    [chapterId: string]: {
        completed: boolean;
        lastViewed: string; // ISO string
    };
}

export interface PerformanceData {
    quizHistory: QuizRecord[];
    chapterProgress: Record<Grade, Partial<Record<Subject, ChapterProgress>>>;
}


export interface AppContextType {
    appState: AppState;
    selectGrade: (grade: Grade) => void;
    selectSubject: (subject: Subject) => void;
    goHome: () => void;
    goToSubjectSelection: () => void;
    goToAnalytics: () => void;
    isOnline: boolean;
    userEmail?: string | null;
}