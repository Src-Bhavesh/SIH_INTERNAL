import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldAlert, ChevronRight } from 'lucide-react';
import { ContentItem } from '@/lib/types';

interface InteractiveDosDontsProps {
  content: {
    items?: ContentItem[];
  };
  onComplete: () => void;
}

export default function InteractiveDosDonts({ content, onComplete }: InteractiveDosDontsProps) {
  const allItems = content.items || [];
  
  // Scenarios Game State
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarioFeedback, setScenarioFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [scenariosCompleted, setScenariosCompleted] = useState(false);

  // Sorting Game State
  const [draggedItem, setDraggedItem] = useState<ContentItem | null>(null);
  const [sortedDos, setSortedDos] = useState<ContentItem[]>([]);
  const [sortedDonts, setSortedDonts] = useState<ContentItem[]>([]);
  const [unsortedItems, setUnsortedItems] = useState<ContentItem[]>([...allItems].sort(() => Math.random() - 0.5));
  const [sortFeedback, setSortFeedback] = useState<string | null>(null);

  const activeScenario = allItems[currentScenarioIndex];

  const handleScenarioAnswer = (isSafe: boolean) => {
    if (!activeScenario) return;
    
    const isCorrect = (isSafe && activeScenario.type === 'do') || (!isSafe && activeScenario.type === 'dont');
    
    setScenarioFeedback({
      isCorrect,
      text: isCorrect 
        ? `✓ Good decision! ${activeScenario.text} is the right approach.`
        : `⚠ Let's rethink that. ${activeScenario.text} is considered ${activeScenario.type === 'do' ? 'safe' : 'unsafe'}.`
    });

    if (isCorrect) {
      setTimeout(() => {
        setScenarioFeedback(null);
        if (currentScenarioIndex < allItems.length - 1) {
          setCurrentScenarioIndex(prev => prev + 1);
        } else {
          setScenariosCompleted(true);
        }
      }, 2000);
    } else {
      setTimeout(() => setScenarioFeedback(null), 3000);
    }
  };

  const handleSortDrop = (e: React.DragEvent, zoneType: 'do' | 'dont') => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === zoneType) {
      setSortFeedback('✓ Perfect!');
      setUnsortedItems(prev => prev.filter(i => i.id !== draggedItem.id));
      if (zoneType === 'do') {
        setSortedDos(prev => [...prev, draggedItem]);
      } else {
        setSortedDonts(prev => [...prev, draggedItem]);
      }
    } else {
      setSortFeedback('⚠ Incorrect zone. Try again!');
    }
    
    setDraggedItem(null);
    setTimeout(() => setSortFeedback(null), 1500);
  };

  const sortingComplete = unsortedItems.length === 0 && allItems.length > 0;
  const canComplete = scenariosCompleted && sortingComplete;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Safe or Unsafe Scenarios */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <ShieldAlert className="text-emerald-600" /> Safe or Unsafe?
          </h3>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            Scenario {Math.min(currentScenarioIndex + 1, allItems.length)} of {allItems.length}
          </span>
        </div>

        {!scenariosCompleted ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center mb-6">
              <span className="text-4xl mb-4 block">{activeScenario?.icon || '🏃'}</span>
              <p className="text-lg font-medium text-slate-700">A student decides to...</p>
              <p className="text-xl font-bold text-slate-900 mt-2">"{activeScenario?.text}"</p>
              <p className="text-sm text-slate-500 mt-4">What should they do?</p>
            </div>

            {scenarioFeedback ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-center font-medium ${
                  scenarioFeedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {scenarioFeedback.text}
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleScenarioAnswer(true)}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold transition-all shadow-sm"
                >
                  <Check size={20} /> Safe
                </button>
                <button
                  onClick={() => handleScenarioAnswer(false)}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-rose-500 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold transition-all shadow-sm"
                >
                  <X size={20} /> Unsafe
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h4 className="text-lg font-bold text-emerald-800 mb-1">Scenario Mastery Achieved!</h4>
            <p className="text-sm text-emerald-600">You correctly identified safe behaviors.</p>
          </div>
        )}
      </div>

      {/* 2. Drag and Drop Sorting */}
      {scenariosCompleted && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <h4 className="font-bold text-lg mb-2 text-center">Safety Sorting Challenge</h4>
          <p className="text-sm text-slate-300 text-center mb-8">Drag the actions into the correct DO or DON'T zones.</p>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* DO Zone */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleSortDrop(e, 'do')}
              className="flex-1 bg-emerald-900/20 border-2 border-dashed border-emerald-500/30 rounded-2xl p-4 min-h-[200px]"
            >
              <h5 className="font-bold text-emerald-400 mb-4 text-center flex items-center justify-center gap-2">
                <Check size={18} /> DO ZONE
              </h5>
              <div className="space-y-2">
                {sortedDos.map(item => (
                  <div key={item.id} className="bg-emerald-900/40 border border-emerald-500/50 p-2.5 rounded-lg text-sm text-emerald-100 flex items-center gap-2">
                    <span className="shrink-0">{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Unsorted Items */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2 shrink-0">
              {unsortedItems.map(item => (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedItem(item)}
                  className="bg-slate-700 border border-slate-600 p-3 rounded-xl text-sm cursor-grab active:cursor-grabbing hover:bg-slate-600 transition-colors shadow-sm text-center flex items-center justify-center gap-2"
                >
                  <span>{item.icon}</span> <span className="line-clamp-2">{item.text}</span>
                </div>
              ))}
              
              {unsortedItems.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <span className="text-3xl mb-2">🎯</span>
                  <span className="text-sm font-bold text-emerald-400">Perfect Sorting!</span>
                </div>
              )}
            </div>

            {/* DONT Zone */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleSortDrop(e, 'dont')}
              className="flex-1 bg-rose-900/20 border-2 border-dashed border-rose-500/30 rounded-2xl p-4 min-h-[200px]"
            >
              <h5 className="font-bold text-rose-400 mb-4 text-center flex items-center justify-center gap-2">
                <X size={18} /> DON'T ZONE
              </h5>
              <div className="space-y-2">
                {sortedDonts.map(item => (
                  <div key={item.id} className="bg-rose-900/40 border border-rose-500/50 p-2.5 rounded-lg text-sm text-rose-100 flex items-center gap-2">
                    <span className="shrink-0">{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>

          </div>
          
          {/* Feedback */}
          <div className="h-6 mt-4 flex justify-center">
            <AnimatePresence>
              {sortFeedback && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                    sortFeedback.includes('Perfect') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {sortFeedback}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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
          {canComplete ? 'Continue to Next Section' : 'Complete all activities to proceed'} <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
