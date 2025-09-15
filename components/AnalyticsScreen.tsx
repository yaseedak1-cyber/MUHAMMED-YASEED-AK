import React, { useState, useEffect, useContext, useMemo } from 'react';
import { getPerformanceData, clearPerformanceData } from '../services/analyticsService';
import { PerformanceData, Grade, Subject, QuizRecord } from '../types';
import { AppContext } from '../contexts/AppContext';
import { CHAPTERS, SUBJECTS } from '../constants';

const TrophyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>);
const QuizIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const BookOpenIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);

const StatCard: React.FC<{ title: string, value: string, icon: JSX.Element, color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const AnalyticsScreen: React.FC = () => {
    const context = useContext(AppContext);
    const [data, setData] = useState<PerformanceData | null>(null);

    useEffect(() => {
        setData(getPerformanceData());
    }, []);

    const handleClearData = () => {
        if (window.confirm("Are you sure you want to delete all your performance data? This action cannot be undone.")) {
            clearPerformanceData();
            setData(getPerformanceData());
        }
    };

    const stats = useMemo(() => {
        if (!data) return { avgScore: 0, totalQuizzes: 0, chaptersCompleted: 0, totalChapters: 0 };
        
        const { quizHistory, chapterProgress } = data;
        
        const totalQuizzes = quizHistory.length;
        const avgScore = totalQuizzes > 0 ? Math.round(quizHistory.reduce((sum, q) => sum + q.percentage, 0) / totalQuizzes) : 0;
        
        let chaptersCompleted = 0;
        let totalChapters = 0;
        (Object.keys(CHAPTERS) as any[] as Grade[]).forEach(grade => {
            SUBJECTS.forEach(subject => {
                const subjectChapters = CHAPTERS[grade][subject];
                totalChapters += subjectChapters.length;
                const progress = chapterProgress?.[grade]?.[subject];
                if (progress) {
                    chaptersCompleted += Object.keys(progress).length;
                }
            });
        });

        return { avgScore, totalQuizzes, chaptersCompleted, totalChapters };
    }, [data]);

    if (!context) return <div>Loading...</div>;
    if (!data) return <div className="text-center p-8">Loading analytics...</div>;
    
    const { quizHistory } = data;
    const hasData = stats.totalQuizzes > 0 || stats.chaptersCompleted > 0;

    return (
        <div className="max-w-5xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                 <button onClick={context.goHome} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    &larr; Back to Home
                </button>
                <h1 className="text-3xl font-bold text-center">Performance Analytics</h1>
                <div/>
            </header>

            {hasData ? (
                <div className="space-y-12">
                    {/* Stats Summary */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Overall Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Average Quiz Score" value={`${stats.avgScore}%`} icon={<TrophyIcon/>} color="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" />
                            <StatCard title="Total Quizzes Taken" value={String(stats.totalQuizzes)} icon={<QuizIcon/>} color="bg-blue-500/20 text-blue-600 dark:text-blue-400" />
                            <StatCard title="Chapters Completed" value={`${stats.chaptersCompleted} / ${stats.totalChapters}`} icon={<BookOpenIcon/>} color="bg-green-500/20 text-green-600 dark:text-green-400" />
                        </div>
                    </section>
                    
                    {/* Quiz History */}
                    {quizHistory.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Recent Quizzes</h2>
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 space-y-3 max-h-96 overflow-y-auto">
                                {quizHistory.map((quiz: QuizRecord, index) => (
                                    <div key={index} className="p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{quiz.subject} - Class {quiz.grade}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(quiz.date).toLocaleDateString()} - {quiz.chapters.join(', ').substring(0, 50)}...
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${quiz.percentage >= 80 ? 'text-green-500' : quiz.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{quiz.percentage}%</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{quiz.score}/{quiz.totalQuestions}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Chapter Progress */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Chapter Progress</h2>
                        <div className="space-y-6">
                           {(Object.keys(CHAPTERS) as any[] as Grade[]).map(grade => (
                               <div key={grade} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                                   <h3 className="text-xl font-bold mb-4">Class {grade}</h3>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       {SUBJECTS.map(subject => {
                                           const total = CHAPTERS[grade][subject].length;
                                           const completed = Object.keys(data.chapterProgress?.[grade]?.[subject] || {}).length;
                                           const percentage = total > 0 ? (completed / total) * 100 : 0;
                                           return (
                                                <div key={subject}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-semibold">{subject}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{completed}/{total}</p>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           ))}
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="text-center pt-8">
                        <button onClick={handleClearData} className="px-6 py-2 bg-red-600/10 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-600/20 transition">
                            Clear All Analytics Data
                        </button>
                    </section>
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <BookOpenIcon />
                    <h2 className="mt-4 text-2xl font-bold">No Data Yet!</h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Start reading chapters and taking quizzes to see your progress here.</p>
                    <button onClick={context.goHome} className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Get Started</button>
                </div>
            )}
        </div>
    );
};

export default AnalyticsScreen;
