import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, ChevronRight, AlertCircle, RefreshCcw } from 'lucide-react';
import { QuizQuestion } from '@/lib/types';

interface InteractiveQuizProps {
  content: {
    questions?: QuizQuestion[];
  };
  onComplete: (answers: Record<string, string>) => void;
}

export default function InteractiveQuiz({ content, onComplete }: InteractiveQuizProps) {
  const questions = content.questions || [];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = Math.round((currentQuestionIndex / questions.length) * 100);

  const handleSelectOption = (optionId: string, isCorrect: boolean, text: string) => {
    if (feedback) return; // Prevent double clicks
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    
    // Show conversational feedback
    setFeedback({
      isCorrect,
      text: isCorrect 
        ? `✓ Excellent! ${currentQuestion.explanation || 'That is the correct and safest choice.'}`
        : `⚠ Not quite. ${currentQuestion.explanation || 'Review the safety guidelines and remember this for next time.'}`
    });
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Determine question type playfully based on options length or content
  // E.g., 2 options = True/False, 3+ options = MCQ/Scenario
  const isTrueFalse = currentQuestion?.options.length === 2 && currentQuestion.options.some(o => o.text.toLowerCase() === 'true');

  if (quizCompleted) {
    const correctCount = questions.filter(q => {
      const selectedId = answers[q.id];
      return q.options.find(o => o.id === selectedId)?.isCorrect;
    }).length;

    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="bg-slate-800 rounded-2xl p-8 text-white shadow-md text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Challenge Complete!</h3>
        <p className="text-slate-300 mb-8">You have completed the Knowledge Assessment.</p>
        
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
            <div className="text-3xl font-black text-emerald-400">{score}%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-1">Final Score</div>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
            <div className="text-3xl font-black text-blue-400">{correctCount}/{questions.length}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-1">Correct Answers</div>
          </div>
        </div>

        <button
          onClick={() => onComplete(answers)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-8 py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <CheckCircle2 size={18} /> Submit Results & Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Brain className="text-emerald-600" size={20} /> Safety Challenge
        </h3>
        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>
      
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-8 leading-snug">
            {currentQuestion.question}
          </h4>

          <div className={`grid gap-3 ${isTrueFalse ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {currentQuestion.options.map(opt => {
              const isSelected = answers[currentQuestion.id] === opt.id;
              
              let buttonStyle = "border-slate-200 bg-white hover:border-slate-300 text-slate-700";
              if (feedback && isSelected) {
                buttonStyle = feedback.isCorrect 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]" 
                  : "border-rose-500 bg-rose-50 text-rose-900 shadow-[0_0_0_2px_rgba(244,63,94,0.2)]";
              } else if (feedback && opt.isCorrect) {
                // Highlight correct answer if user got it wrong
                buttonStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-800";
              }

              return (
                <button
                  key={opt.id}
                  disabled={feedback !== null}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect, opt.text)}
                  className={`relative p-4 rounded-xl border-2 text-left font-medium transition-all ${buttonStyle} ${
                    !feedback ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected && feedback?.isCorrect ? 'border-emerald-500 bg-emerald-500' :
                      isSelected && !feedback?.isCorrect ? 'border-rose-500 bg-rose-500' :
                      feedback && opt.isCorrect ? 'border-emerald-500 bg-emerald-500' :
                      'border-slate-300'
                    }`}>
                      {(isSelected || (feedback && opt.isCorrect)) && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                className={`overflow-hidden rounded-xl p-4 border ${
                  feedback.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 ${feedback.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {feedback.isCorrect ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div>
                    <h5 className={`font-bold text-sm ${feedback.isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {feedback.isCorrect ? 'Correct Decision' : 'Incorrect'}
                    </h5>
                    <p className={`text-sm mt-1 leading-relaxed ${feedback.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {feedback.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {feedback && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors shadow-sm"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Challenge'} <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
