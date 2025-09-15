
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Grade } from '../types';

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);


const HomeScreen: React.FC = () => {
    const context = useContext(AppContext);
    
    if (!context) {
        return <div>Loading...</div>;
    }

    const { selectGrade } = context;

    const GradeButton: React.FC<{ grade: Grade, color: string }> = ({ grade, color }) => (
        <button
            onClick={() => selectGrade(grade)}
            className={`
                group w-full md:w-64 h-64 p-8 flex flex-col items-center justify-center 
                ${color} text-white rounded-2xl shadow-lg hover:shadow-2xl 
                transform hover:-translate-y-2 transition-all duration-300 ease-in-out
            `}
        >
            <BookIcon />
            <span className="text-2xl font-bold">Class {grade}</span>
            <span className="text-sm font-medium opacity-80">NCERT Syllabus</span>
        </button>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <header className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                    NCERT Genius AI
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                    Your AI-powered guide to mastering the {new Date().getFullYear()}-{new Date().getFullYear() + 1} NCERT Social Science syllabus.
                </p>
            </header>
            
            <main className="flex flex-col md:flex-row gap-8 md:gap-12">
                <GradeButton grade={9} color="bg-gradient-to-br from-purple-500 to-indigo-600" />
                <GradeButton grade={10} color="bg-gradient-to-br from-sky-500 to-cyan-500" />
            </main>
        </div>
    );
};

export default HomeScreen;
