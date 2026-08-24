import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { ContentItem } from '@/lib/types';

interface InteractiveOverviewProps {
  content: {
    text?: string;
    items?: ContentItem[];
  };
  onComplete: () => void;
}

export default function InteractiveOverview({ content, onComplete }: InteractiveOverviewProps) {
  // Did you know cards
  const facts = content.items?.slice(0, 4) || [];
  const [discoveredFacts, setDiscoveredFacts] = useState<string[]>([]);
  
  // Drag and drop interaction
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [droppedCorrectly, setDroppedCorrectly] = useState(false);
  const [dropFeedback, setDropFeedback] = useState<string | null>(null);

  const causes = [
    { id: 'c1', text: 'Heavy rainfall' },
    { id: 'c2', text: 'Moving tectonic plates', isCorrect: true },
    { id: 'c3', text: 'Traffic vibrations' },
  ];

  const handleRevealFact = (id: string) => {
    if (!discoveredFacts.includes(id)) {
      setDiscoveredFacts(prev => [...prev, id]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragItem === 'c2') {
      setDroppedCorrectly(true);
      setDropFeedback('✓ Correct! Movement beneath the Earth\'s crust releases energy.');
    } else {
      setDropFeedback('⚠ Try again. Think about what happens beneath the Earth\'s surface.');
      setTimeout(() => setDropFeedback(null), 2000);
    }
    setDragItem(null);
  };

  const allDiscovered = discoveredFacts.length === facts.length && facts.length > 0;
  const canComplete = allDiscovered && droppedCorrectly;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Introduction Text */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
          <Info className="text-emerald-600" /> What is an Earthquake?
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          {content.text || "An earthquake is what happens when two blocks of the earth suddenly slip past one another. The surface where they slip is called the fault or fault plane."}
        </p>
      </div>

      {/* 2. Interactive Discovery Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800">🤔 Did you know?</h4>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            Discoveries: {discoveredFacts.length} / {facts.length}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {facts.map((fact, idx) => {
            const isDiscovered = discoveredFacts.includes(fact.id);
            return (
              <motion.div 
                key={fact.id}
                layout
                onClick={() => handleRevealFact(fact.id)}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all overflow-hidden ${
                  isDiscovered 
                    ? 'border-emerald-200 bg-emerald-50/50' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {!isDiscovered ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 py-4">
                    <span className="text-2xl">❓</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">Tap to Reveal Fact #{idx + 1}</span>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <span className="text-2xl shrink-0">{fact.icon || '📌'}</span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{fact.text}</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        {allDiscovered && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mt-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full text-xs font-bold shadow-sm">
              ✨ Curious Explorer Badge Earned
            </span>
          </motion.div>
        )}
      </div>

      {/* 3. Quick Think Interactive Drag & Drop */}
      <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
          <AlertTriangle className="text-amber-400" size={20} /> Quick Think
        </h4>
        <p className="text-sm text-slate-300 mb-6">What do you think causes the ground to shake during an earthquake?</p>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          
          {/* Draggables */}
          <div className="flex flex-col gap-3 w-full md:w-1/2">
            {causes.map(cause => (
              <div 
                key={cause.id}
                draggable={!droppedCorrectly}
                onDragStart={() => setDragItem(cause.id)}
                className={`p-3 rounded-xl border border-slate-600 bg-slate-700/50 text-sm font-medium text-center transition-all ${
                  !droppedCorrectly ? 'cursor-grab hover:bg-slate-600 active:cursor-grabbing' : 'opacity-50 cursor-default'
                } ${dragItem === cause.id ? 'opacity-50 border-dashed' : ''}`}
              >
                {cause.text}
              </div>
            ))}
          </div>

          {/* Dropzone */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                droppedCorrectly 
                  ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-400' 
                  : dragItem ? 'bg-slate-700/50 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)]' 
                  : 'bg-slate-900/50 border-slate-600 text-slate-400'
              }`}
            >
              {droppedCorrectly ? (
                <>
                  <CheckCircle2 size={32} className="mb-2" />
                  <span className="font-bold text-sm">CAUSE OF EARTHQUAKE</span>
                  <span className="text-xs mt-1 text-emerald-200">Moving tectonic plates</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-sm mb-1">CAUSE OF EARTHQUAKE</span>
                  <span className="text-xs opacity-70">[ Drop Answer Here ]</span>
                </>
              )}
            </div>
            
            {/* Feedback Message */}
            <div className="mt-4 h-6 flex items-center justify-center w-full">
              {dropFeedback && (
                <motion.span 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    droppedCorrectly ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}
                >
                  {dropFeedback}
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </div>

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
          {canComplete ? 'Continue to Next Section' : 'Complete activities to proceed'} <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
