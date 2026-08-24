import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronRight, Activity } from 'lucide-react';
import { ContentItem } from '@/lib/types';

interface InteractiveStepsProps {
  content: {
    items?: ContentItem[];
  };
  onComplete: () => void;
}

export default function InteractiveSteps({ content, onComplete }: InteractiveStepsProps) {
  const allItems = content.items?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
  
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [readSteps, setReadSteps] = useState<number[]>([0]);
  
  // Sequence Challenge State
  const [showChallenge, setShowChallenge] = useState(false);
  const [sequence, setSequence] = useState<ContentItem[]>([...allItems].sort(() => Math.random() - 0.5));
  const [challengeScore, setChallengeScore] = useState<number | null>(null);

  const handleExpand = (index: number) => {
    setExpandedStep(index);
    if (!readSteps.includes(index)) {
      setReadSteps(prev => [...prev, index]);
    }
  };

  const checkSequence = () => {
    let correctCount = 0;
    sequence.forEach((item, index) => {
      const originalIndex = allItems.findIndex(i => i.id === item.id);
      if (originalIndex === index) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / sequence.length) * 100);
    setChallengeScore(score);
  };

  const canComplete = showChallenge && challengeScore !== null && challengeScore >= 80;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {!showChallenge ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Activity className="text-emerald-600" /> Emergency Timeline
              </h3>
              <p className="text-sm text-slate-500 mt-1">Learn the exact step-by-step response.</p>
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              Read {readSteps.length} of {allItems.length}
            </span>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {allItems.map((item, index) => {
              const isExpanded = expandedStep === index;
              const isRead = readSteps.includes(index);
              
              return (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  {/* Timeline Node */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm transition-colors ${
                    isRead ? 'bg-emerald-500 border-white text-white' : 'bg-slate-200 border-white text-slate-500'
                  }`}>
                    {isRead ? <CheckCircle2 size={16} /> : <span className="text-sm font-bold">{index + 1}</span>}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:border-emerald-200 transition-colors" onClick={() => handleExpand(index)}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        {item.icon && <span className="text-lg">{item.icon}</span>} {item.text}
                      </h4>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 text-sm text-slate-600 border-t border-slate-100 pt-3">
                        <p className="font-medium text-emerald-700 mb-1">WHY?</p>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> Crucial for immediate safety.</li>
                          <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> Minimizes risk of injury from debris.</li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowChallenge(true)}
              disabled={readSteps.length < allItems.length}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                readSteps.length === allItems.length 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Start Sequence Challenge
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <h4 className="font-bold text-lg mb-2 text-center text-amber-400">Emergency Sequence Challenge</h4>
          <p className="text-sm text-slate-300 text-center mb-8">Drag to arrange the steps in the correct chronological order.</p>

          <div className="max-w-md mx-auto">
            <Reorder.Group axis="y" values={sequence} onReorder={setSequence} className="space-y-3">
              {sequence.map((item, index) => (
                <Reorder.Item key={item.id} value={item} className="relative">
                  <div className="flex items-center gap-4 bg-slate-700/80 border border-slate-600 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:bg-slate-700 transition-colors shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-medium text-sm flex items-center gap-2">
                      {item.icon} {item.text}
                    </span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={checkSequence}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-3 rounded-xl shadow-sm w-full transition-colors"
              >
                Check Sequence
              </button>

              {challengeScore !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl w-full text-center border ${
                  challengeScore >= 80 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' : 'bg-rose-500/20 border-rose-500/50 text-rose-100'
                }`}>
                  <div className="text-2xl font-bold mb-1">{challengeScore}%</div>
                  <div className="text-sm">
                    {challengeScore >= 80 ? 'Excellent! You know the drill.' : 'Not quite right. Review the steps and try again.'}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <div className="flex justify-end pt-4 border-t border-slate-200/60">
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            canComplete 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {canComplete ? 'Continue to Next Section' : 'Complete the challenge to proceed'} <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
