import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../types';
import QuestionRenderer from './QuestionRenderer';

interface QuizViewProps {
    questions: QuizQuestion[];
    onFinishQuiz: (answers: string[]) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onFinishQuiz }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>(() => new Array(questions.length).fill(''));
    const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 60 seconds per question

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            onFinishQuiz(answers);
        }
    }, [timeLeft, onFinishQuiz, answers]);

    const handleAnswerChange = (answer: string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
    };

    const goToNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</div>
                <div className="text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-3 py-1 rounded-full">
                    Time Left: {formatTime(timeLeft)}
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Question */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg shadow-inner min-h-[300px]">
                <QuestionRenderer
                    question={currentQuestion}
                    userAnswer={answers[currentQuestionIndex]}
                    onAnswerChange={handleAnswerChange}
                />
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <button onClick={goToPrevious} disabled={currentQuestionIndex === 0} className="px-6 py-2 bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-400 dark:hover:bg-slate-500 transition disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                {currentQuestionIndex === questions.length - 1 ? (
                    <button onClick={() => onFinishQuiz(answers)} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Finish Quiz</button>
                ) : (
                    <button onClick={goToNext} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Next</button>
                )}
            </div>
        </div>
    );
};

export default QuizView;
