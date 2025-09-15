import React from 'react';
import { QuizQuestion, QuestionType } from '../../types';

interface QuizResultsProps {
    questions: QuizQuestion[];
    userAnswers: string[];
    onRestart: () => void;
    onExit: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ questions, userAnswers, onRestart, onExit }) => {
    
    const calculateScore = () => {
        let correctAnswers = 0;
        questions.forEach((q, index) => {
            if (userAnswers[index]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
                correctAnswers++;
            }
        });
        return correctAnswers;
    };

    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    const getResultColor = () => {
        if (percentage >= 80) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    }

    const isCorrect = (question: QuizQuestion, userAnswer: string) => {
        return userAnswer?.toLowerCase().trim() === question.answer.toLowerCase().trim();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Quiz Complete!</h2>
            
            {/* Score Summary */}
            <div className="text-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg mb-8">
                <p className="text-lg text-slate-600 dark:text-slate-300">Your Score</p>
                <p className={`text-6xl font-bold ${getResultColor()}`}>{percentage}%</p>
                <p className="text-md text-slate-500 dark:text-slate-400">You answered {score} out of {questions.length} questions correctly.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
                <button onClick={onRestart} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Take Another Quiz</button>
                <button onClick={onExit} className="px-6 py-2 bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-400 dark:hover:bg-slate-500 transition">Back to Content</button>
            </div>

            {/* Detailed Review */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold">Review Your Answers</h3>
                {questions.map((q, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${isCorrect(q, userAnswers[index]) ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                        <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                        <div className="text-sm space-y-2">
                           <p>Your Answer: <span className={`font-medium ${isCorrect(q, userAnswers[index]) ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{userAnswers[index] || 'Not answered'}</span></p>
                           {!isCorrect(q, userAnswers[index]) && <p>Correct Answer: <span className="font-medium text-slate-800 dark:text-slate-100">{q.answer}</span></p>}
                           <p className="pt-2 mt-2 border-t border-slate-300 dark:border-slate-600"><strong className="text-blue-600 dark:text-blue-400">Explanation:</strong> {q.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default QuizResults;
