import React from 'react';
import { QuizQuestion, QuestionType, MCQOption } from '../../types';

interface QuestionRendererProps {
    question: QuizQuestion;
    userAnswer: string;
    onAnswerChange: (answer: string) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, userAnswer, onAnswerChange }) => {
    
    const renderMCQ = (options: MCQOption[]) => (
        <div className="space-y-3">
            {options.map((option, index) => (
                <label key={index} className="flex items-center p-3 rounded-lg border dark:border-slate-700 has-[:checked]:bg-blue-100 dark:has-[:checked]:bg-blue-900/50 has-[:checked]:border-blue-500 cursor-pointer transition-colors">
                    <input type="radio" name={question.question} value={option.text} checked={userAnswer === option.text} onChange={(e) => onAnswerChange(e.target.value)} className="h-5 w-5 mr-3 text-blue-600 focus:ring-blue-500 border-slate-400"/>
                    <span>{option.text}</span>
                </label>
            ))}
        </div>
    );

    const renderTrueFalse = () => renderMCQ([{text: 'True', isCorrect: question.answer === 'True'}, {text: 'False', isCorrect: question.answer === 'False'}]);

    const renderFillInBlanks = () => (
        <div>
            <p className="mb-4 text-slate-500 dark:text-slate-400">Type your answer in the box below.</p>
            <input type="text" value={userAnswer} onChange={(e) => onAnswerChange(e.target.value)} placeholder="Your answer..." className="w-full p-3 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
        </div>
    );
    
    const renderShortAnswer = () => (
         <div>
            <p className="mb-4 text-slate-500 dark:text-slate-400">Provide a brief answer in the text area below.</p>
            <textarea value={userAnswer} onChange={(e) => onAnswerChange(e.target.value)} placeholder="Your answer..." rows={4} className="w-full p-3 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
        </div>
    );

    const renderContent = () => {
        switch (question.type) {
            case QuestionType.MCQ:
                return renderMCQ(question.options || []);
            case QuestionType.TrueFalse:
                return renderTrueFalse();
            case QuestionType.FillInBlanks:
                return renderFillInBlanks();
            case QuestionType.ShortAnswer:
                return renderShortAnswer();
            default:
                return <p>Unsupported question type.</p>;
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-1">{question.question}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Type: {question.type}</p>
            {renderContent()}
        </div>
    );
};

export default QuestionRenderer;
