
import { GoogleGenAI, Type } from "@google/genai";
import { ChapterContent, Grade, Subject, Chapter, QuizSettings, QuizQuestion } from '../types';
import { SYLLABUS_YEAR } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const chapterContentSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: 'A detailed summary of the chapter.' },
        keyConcepts: {
            type: Type.ARRAY,
            description: 'A list of key concepts and their definitions.',
            items: {
                type: Type.OBJECT,
                properties: {
                    concept: { type: Type.STRING },
                    definition: { type: Type.STRING }
                },
                required: ['concept', 'definition']
            }
        },
        importantQuestions: {
            type: Type.ARRAY,
            description: 'A list of important questions with their answers.',
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ['question', 'answer']
            }
        },
        revisionNotes: {
            type: Type.ARRAY,
            description: 'A list of concise revision notes as bullet points.',
            items: { type: Type.STRING }
        }
    },
    required: ['summary', 'keyConcepts', 'importantQuestions', 'revisionNotes']
};

const quizQuestionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['Multiple Choice', 'True/False', 'Fill in the Blanks', 'Short Answer'] },
            options: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN }
                    },
                    required: ['text', 'isCorrect']
                },
                description: "Options for MCQ questions. Other types will have an empty array.",
            },
            answer: { type: Type.STRING, description: "Correct answer. For MCQ, it's the text of the correct option. For Fill-in-the-blanks, it's the missing word(s)." },
            explanation: { type: Type.STRING, description: "A brief explanation for the correct answer." }
        },
        required: ['question', 'type', 'answer', 'explanation', 'options']
    }
};

export const fetchChapterContent = async (grade: Grade, subject: Subject, chapter: Chapter): Promise<ChapterContent> => {
    const prompt = `Act as an expert NCERT Social Science teacher for the ${SYLLABUS_YEAR} syllabus. For Class ${grade} ${subject}, Chapter '${chapter.title}', provide a detailed chapter summary, key concepts with definitions, 10 important questions with answers, and concise revision notes.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: chapterContentSchema,
                temperature: 0.2
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ChapterContent;
    } catch (error) {
        console.error("Error fetching chapter content:", error);
        throw new Error("Failed to generate chapter content from AI. Please try again.");
    }
};

export const generateQuiz = async (grade: Grade, subject: Subject, settings: QuizSettings): Promise<QuizQuestion[]> => {
    const chapterTitles = settings.chapters.map(c => `'${c.title}'`).join(', ');
    const prompt = `Generate a quiz based on the NCERT ${SYLLABUS_YEAR} syllabus for Class ${grade} ${subject}.
    Chapters: ${chapterTitles}.
    Total Questions: ${settings.questionCount}.
    Difficulty: ${settings.difficulty}.
    Question Types: Include a mix of ${settings.questionTypes.join(', ')}.
    
    For each question, provide the question text, type, the correct answer, a brief explanation, and for MCQs, provide 4 options with one marked as correct. For other types, the options array can be empty.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizQuestionSchema,
                temperature: 0.7
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as QuizQuestion[];
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz from AI. Please try again.");
    }
};

export const searchTopic = async (grade: Grade, subject: Subject, topic: string): Promise<string> => {
    const prompt = `Based on the NCERT Class ${grade} ${subject} syllabus (${SYLLABUS_YEAR}), explain the topic '${topic}' in detail (around 200-300 words) and mention which chapter it belongs to. Format the response in Markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error searching topic:", error);
        throw new Error("Failed to search topic with AI. Please try again.");
    }
};
