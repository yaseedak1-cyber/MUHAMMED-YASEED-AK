import React, { useState } from 'react';
import { Chapter, QuizSettings, Difficulty, QuestionType } from '../../types';

interface QuizSetupProps {
    chapters: Chapter[];
    onStartQuiz: (settings: QuizSettings) => void;
    isLoading: boolean;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ chapters, onStartQuiz, isLoading }) => {
    const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([chapters[0]]);
    const [questionCount, setQuestionCount] = useState<number>(10);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
    const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([QuestionType.MCQ, QuestionType.TrueFalse]);
    const [error, setError] = useState<string | null>(null);

    const handleChapterToggle = (chapter: Chapter) => {
        setSelectedChapters(prev =>
            prev.find(c => c.id === chapter.id)
                ? prev.filter(c => c.id !== chapter.id)
                : [...prev, chapter]
        );
    };
    
    const handleTypeToggle = (type: QuestionType) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedChapters.length === 0) {
            setError('Please select at least one chapter.');
            return;
        }
        if (selectedTypes.length === 0) {
            setError('Please select at least one question type.');
            return;
        }
        setError(null);
        onStartQuiz({
            chapters: selectedChapters,
            questionCount,
            difficulty,
            questionTypes: selectedTypes,
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Create Your Quiz</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Chapters Selection */}
                <div>
                    <label className="block text-lg font-semibold mb-2">1. Select Chapters</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md dark:border-slate-600">
                        {chapters.map(chapter => (
                            <label key={chapter.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <input type="checkbox" checked={selectedChapters.some(c => c.id === chapter.id)} onChange={() => handleChapterToggle(chapter)} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-500 bg-slate-200 dark:bg-slate-600"/>
                                <span>{chapter.title}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Question Count */}
                <div>
                    <label htmlFor="question-count" className="block text-lg font-semibold mb-2">2. Number of Questions: <span className="font-bold text-blue-500">{questionCount}</span></label>
                    <input id="question-count" type="range" min="5" max="20" step="1" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"/>
                </div>
                
                {/* Difficulty */}
                <div>
                     <label className="block text-lg font-semibold mb-2">3. Select Difficulty</label>
                     <div className="flex gap-2">
                        {Object.values(Difficulty).map(level => (
                            <button type="button" key={level} onClick={() => setDifficulty(level)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex-1 ${difficulty === level ? 'bg-blue-600 text-white shadow' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>{level}</button>
                        ))}
                     </div>
                </div>

                {/* Question Types */}
                <div>
                    <label className="block text-lg font-semibold mb-2">4. Question Types</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(QuestionType).map(type => (
                             <label key={type} className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => handleTypeToggle(type)} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-500 bg-slate-200 dark:bg-slate-600"/>
                                <span>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                    {isLoading ? <><Spinner/> Generating...</> : 'Start Quiz'}
                </button>
            </form>
        </div>
    );
};

const Spinner = () => <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>;

export default QuizSetup;
