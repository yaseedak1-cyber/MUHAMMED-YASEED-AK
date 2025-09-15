import { Grade, Subject, PerformanceData, QuizRecord } from '../types';

const STORAGE_KEY = 'ncertGeniusAnalytics';

export const getPerformanceData = (): PerformanceData => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Failed to parse analytics data from localStorage", error);
    }
    // Return default structure if no data or parsing fails
    return { quizHistory: [], chapterProgress: { 9: {}, 10: {} } };
};

const savePerformanceData = (data: PerformanceData) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save analytics data to localStorage", error);
    }
};

export const recordQuizResult = (result: Omit<QuizRecord, 'date'>) => {
    const data = getPerformanceData();
    const newRecord: QuizRecord = {
        ...result,
        date: new Date().toISOString(),
    };
    data.quizHistory.unshift(newRecord); // Add to the beginning
    if (data.quizHistory.length > 50) { // Keep history to a reasonable size
        data.quizHistory.pop();
    }
    savePerformanceData(data);
};

export const markChapterAsViewed = (grade: Grade, subject: Subject, chapterId: string) => {
    const data = getPerformanceData();
    if (!data.chapterProgress[grade]) {
        data.chapterProgress[grade] = {};
    }
    if (!data.chapterProgress[grade][subject]) {
        data.chapterProgress[grade][subject] = {};
    }
    data.chapterProgress[grade]![subject]![chapterId] = {
        completed: true,
        lastViewed: new Date().toISOString(),
    };
    savePerformanceData(data);
};

export const clearPerformanceData = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear analytics data from localStorage", error);
    }
};
