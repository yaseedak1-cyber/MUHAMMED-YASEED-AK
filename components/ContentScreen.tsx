import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { CHAPTERS } from '../constants';
import { Chapter, ChapterContent, QuizSettings, QuizQuestion, PerformanceData } from '../types';
import { fetchChapterContent, generateQuiz } from '../services/geminiService';
import { markChapterAsViewed, getPerformanceData } from '../services/analyticsService';
import Spinner from './shared/Spinner';
import QuizSetup from './quiz/QuizSetup';
import QuizView from './quiz/QuizView';
import QuizResults from './quiz/QuizResults';

type Tab = 'summary' | 'concepts' | 'questions' | 'notes' | 'quiz';

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


const ContentScreen: React.FC = () => {
    const context = useContext(AppContext);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [content, setContent] = useState<ChapterContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('summary');
    const [performanceData, setPerformanceData] = useState<PerformanceData>(() => getPerformanceData());

    // Quiz State
    const [quizState, setQuizState] = useState<'setup' | 'active' | 'results'>('setup');
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
    const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [isQuizLoading, setIsQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState<string | null>(null);

    useEffect(() => {
        if (!context || !context.appState.grade || !context.appState.subject) return;
        const chapters = CHAPTERS[context.appState.grade][context.appState.subject];
        if (chapters.length > 0) {
            handleChapterSelect(chapters[0]);
        } else {
            setSelectedChapter(null);
            setContent(null);
        }
        // Reset quiz state when subject changes
        handleExitQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context?.appState.grade, context?.appState.subject]);

    const handleChapterSelect = useCallback(async (chapter: Chapter) => {
        if (!context || !context.appState.grade || !context.appState.subject) return;
        if (selectedChapter?.id === chapter.id && content) return; // Don't reload if already selected and has content
        
        setSelectedChapter(chapter);
        setIsLoading(true);
        setError(null);
        setContent(null);
        try {
            const fetchedContent = await fetchChapterContent(context.appState.grade, context.appState.subject, chapter);
            setContent(fetchedContent);
            markChapterAsViewed(context.appState.grade, context.appState.subject, chapter.id);
            setPerformanceData(getPerformanceData()); // Refresh performance data to show checkmark
        } catch (err: any) {
            if (!navigator.onLine) {
                setError("You are currently offline. AI-generated chapter summaries, Q&As, and other content cannot be loaded. Please connect to the internet to access this feature.");
            } else {
                setError(err.message || 'An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
            setActiveTab('summary');
        }
    }, [context, selectedChapter, content]);

    const handleStartQuiz = useCallback(async (settings: QuizSettings) => {
        if (!context || !context.appState.grade || !context.appState.subject) return;
        setIsQuizLoading(true);
        setQuizError(null);
        setQuizSettings(settings);
        try {
            const questions = await generateQuiz(context.appState.grade, context.appState.subject, settings);
            if (questions.length === 0) {
                throw new Error("The AI failed to generate questions. Please try adjusting your settings.");
            }
            setQuizQuestions(questions);
            setUserAnswers(new Array(questions.length).fill(''));
            setQuizState('active');
        } catch (err: any) {
            if (!navigator.onLine) {
                setQuizError("You are currently offline. AI-powered quizzes cannot be generated. Please connect to the internet to create a quiz.");
            } else {
                setQuizError(err.message || "An error occurred while generating the quiz.");
            }
        } finally {
            setIsQuizLoading(false);
        }
    }, [context]);

    const handleFinishQuiz = (finalAnswers: string[]) => {
        setUserAnswers(finalAnswers);
        setQuizState('results');
    };

    const handleRestartQuiz = () => {
        setQuizState('setup');
        setQuizQuestions(null);
        setUserAnswers([]);
        setQuizError(null);
        setQuizSettings(null);
    };
    
    const handleExitQuiz = () => {
        handleRestartQuiz(); // Resets all quiz state
        // Optionally switch back to the summary tab
        if(selectedChapter) {
            setActiveTab('summary');
        }
    };


    if (!context || !context.appState.grade || !context.appState.subject) {
        return <div>Loading application state...</div>;
    }

    const { appState: { grade, subject }, goToSubjectSelection } = context;
    const chapters = CHAPTERS[grade][subject];

    const TabButton: React.FC<{ tab: Tab, label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === tab 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-96">
                    <Spinner />
                    <p className="mt-4 text-slate-500">Generating AI-powered content for '{selectedChapter?.title}'...</p>
                </div>
            );
        }
        if (error) {
            return <div className="text-center text-red-500 p-8 bg-red-100 dark:bg-red-900/20 rounded-lg">{error}</div>;
        }
        if (!content && activeTab !== 'quiz') {
            return <div className="text-center text-slate-500 p-8">Select a chapter to begin.</div>;
        }

        switch(activeTab) {
            case 'summary':
                return <p className="prose dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap">{content!.summary}</p>;
            case 'concepts':
                return (
                    <dl className="space-y-4">
                        {content!.keyConcepts.map((item, i) => (
                            <div key={i} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <dt className="font-semibold text-blue-600 dark:text-blue-400">{item.concept}</dt>
                                <dd className="mt-1 text-slate-700 dark:text-slate-300">{item.definition}</dd>
                            </div>
                        ))}
                    </dl>
                );
            case 'questions':
                 return (
                    <div className="space-y-4">
                        {content!.importantQuestions.map((item, i) => (
                            <details key={i} className="group p-4 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer">
                                <summary className="font-semibold text-slate-800 dark:text-slate-200 list-none flex justify-between items-center">
                                    {item.question}
                                    <span className="text-blue-500 transition-transform duration-300 group-open:rotate-90">&gt;</span>
                                </summary>
                                <p className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{item.answer}</p>
                            </details>
                        ))}
                    </div>
                 );
            case 'notes':
                return (
                    <ul className="list-disc list-inside space-y-2 prose dark:prose-invert max-w-none">
                        {content!.revisionNotes.map((note, i) => <li key={i}>{note}</li>)}
                    </ul>
                );
            case 'quiz':
                if (isQuizLoading) {
                    return (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Spinner />
                            <p className="mt-4 text-slate-500">Generating your custom AI-powered quiz...</p>
                        </div>
                    );
                }
                if (quizError) {
                    return (
                        <div className="text-center p-8">
                             <div className="text-red-500 p-4 mb-4 bg-red-100 dark:bg-red-900/20 rounded-lg">{quizError}</div>
                             <button onClick={handleRestartQuiz} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Try Again</button>
                        </div>
                    );
                }
                switch (quizState) {
                    case 'setup':
                        return <QuizSetup chapters={chapters} onStartQuiz={handleStartQuiz} isLoading={isQuizLoading} />;
                    case 'active':
                        return <QuizView questions={quizQuestions!} onFinishQuiz={handleFinishQuiz} />;
                    case 'results':
                        return <QuizResults questions={quizQuestions!} userAnswers={userAnswers} quizSettings={quizSettings!} onRestart={handleRestartQuiz} onExit={handleExitQuiz} />;
                }
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <div className="sticky top-8">
                    <button onClick={goToSubjectSelection} className="text-sm mb-4 font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        &larr; Back to Subjects
                    </button>
                    <h2 className="text-xl font-bold mb-1">Class {grade} {subject}</h2>
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-4">Chapters</h3>
                    <nav className="space-y-2">
                        {chapters.map(chapter => {
                            const isCompleted = performanceData?.chapterProgress?.[grade]?.[subject]?.[chapter.id]?.completed;
                            return (
                                <a
                                    key={chapter.id}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleChapterSelect(chapter); }}
                                    className={`
                                        block w-full text-left p-3 rounded-md text-sm transition-colors duration-200
                                        flex items-center justify-between gap-2
                                        ${selectedChapter?.id === chapter.id
                                            ? 'bg-blue-600 text-white font-semibold shadow'
                                            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }
                                    `}
                                >
                                    <span className="flex-grow">{chapter.title}</span>
                                    {isCompleted && <CheckCircleIcon />}
                                </a>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-full md:w-3/4 lg:w-4/5 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-2">{activeTab === 'quiz' ? `${subject} Quiz` : selectedChapter?.title}</h1>
                <div className="flex items-center flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                   <TabButton tab="summary" label="Summary" />
                   <TabButton tab="concepts" label="Key Concepts" />
                   <TabButton tab="questions" label="Q&A" />
                   <TabButton tab="notes" label="Revision Notes" />
                   <TabButton tab="quiz" label="Quiz" />
                </div>
                <div className="min-h-[400px]">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ContentScreen;