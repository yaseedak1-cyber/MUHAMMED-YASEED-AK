
import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { SUBJECTS, SUBJECT_DESCRIPTIONS, CHAPTERS } from '../constants';
import { Subject, Grade } from '../types';

const SubjectCard: React.FC<{ subject: Subject; onClick: () => void; icon: JSX.Element, color: string }> = ({ subject, onClick, icon, color }) => (
    <div
        onClick={onClick}
        className={`
            group relative p-6 rounded-xl shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-300
            bg-white dark:bg-slate-800 hover:shadow-xl dark:hover:bg-slate-700
        `}
    >
        <div className={`absolute top-0 left-0 h-full w-1.5 ${color} rounded-l-xl`}></div>
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${color} text-white`}>
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{subject}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Social Science</p>
            </div>
        </div>
    </div>
);

const HistoryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const GeographyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l1.414-1.414a1 1 0 011.414 0l1.414 1.414M2 11h20M12 21l-1-10" /></svg>);
const CivicsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const EconomicsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>);

const ICONS: Record<Subject, {icon: JSX.Element, color: string}> = {
    [Subject.History]: { icon: <HistoryIcon/>, color: 'bg-orange-500' },
    [Subject.Geography]: { icon: <GeographyIcon/>, color: 'bg-green-500' },
    [Subject.Civics]: { icon: <CivicsIcon/>, color: 'bg-blue-500' },
    [Subject.Economics]: { icon: <EconomicsIcon/>, color: 'bg-purple-500' },
}

const SyllabusOverview: React.FC<{ grade: Grade }> = ({ grade }) => {
    const [openSubject, setOpenSubject] = useState<Subject | null>(null);

    const toggleSubject = (subject: Subject) => {
        setOpenSubject(prev => (prev === subject ? null : subject));
    };

    const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">Syllabus Overview for Class {grade}</h2>
            <div className="space-y-3">
                {SUBJECTS.map(subject => {
                    const description = SUBJECT_DESCRIPTIONS[grade][subject];
                    const chapters = CHAPTERS[grade][subject];
                    const isOpen = openSubject === subject;

                    return (
                        <div key={subject} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => toggleSubject(subject)}
                                className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                aria-expanded={isOpen}
                                aria-controls={`syllabus-${subject}`}
                            >
                                <span>{subject}</span>
                                <ChevronIcon isOpen={isOpen} />
                            </button>
                            <div
                                id={`syllabus-${subject}`}
                                className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="p-5 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-600 dark:text-slate-300 mb-4 italic">{description}</p>
                                        <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">Chapters:</h4>
                                        <ul className="list-decimal list-inside text-slate-500 dark:text-slate-400 space-y-1">
                                            {chapters.map(chapter => (
                                                <li key={chapter.id}>{chapter.title}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const SubjectSelectionScreen: React.FC = () => {
    const context = useContext(AppContext);

    if (!context || !context.appState.grade) {
        return <div>Loading...</div>;
    }
    const { appState: { grade }, selectSubject, goHome } = context;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <header className="flex items-center justify-between mb-8">
                 <button onClick={goHome} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    &larr; Change Class
                </button>
                <h1 className="text-3xl font-bold text-center">Class {grade} Subjects</h1>
                <div/>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SUBJECTS.map((subject) => (
                    <SubjectCard 
                        key={subject} 
                        subject={subject} 
                        onClick={() => selectSubject(subject)}
                        icon={ICONS[subject].icon}
                        color={ICONS[subject].color}
                    />
                ))}
            </div>
             <SyllabusOverview grade={grade} />
        </div>
    );
};

export default SubjectSelectionScreen;