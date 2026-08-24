import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MapPin, ChevronRight, ListChecks } from 'lucide-react';
import { ContentItem } from '@/lib/types';

interface InteractiveChecklistProps {
  content: {
    items?: ContentItem[];
  };
  onComplete: () => void;
}

export default function InteractiveChecklist({ content, onComplete }: InteractiveChecklistProps) {
  const allItems = content.items || [];
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [showLocationMock, setShowLocationMock] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const percentage = Math.round((checkedIds.length / allItems.length) * 100) || 0;
  const isComplete = checkedIds.length === allItems.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Preparedness Score Card */}
      <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h4 className="font-bold text-xl mb-1 text-slate-100 flex items-center gap-2">
              <ListChecks className="text-emerald-400" /> Your Readiness Score
            </h4>
            <p className="text-sm text-slate-400">Complete the checklist to ensure you are fully prepared.</p>
          </div>
          
          <div className="text-center shrink-0">
            <div className="text-4xl font-black text-emerald-400 font-mono tracking-tighter">
              {percentage}%
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              {checkedIds.length} / {allItems.length} Prepared
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-700 rounded-full mt-6 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          />
        </div>
      </div>

      {/* 2. Interactive Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-3">
          {allItems.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            const needsLocation = item.text.toLowerCase().includes('where') || item.text.toLowerCase().includes('location') || item.text.toLowerCase().includes('route') || item.text.toLowerCase().includes('exit');

            return (
              <div key={item.id} className="relative">
                <div 
                  onClick={() => toggleCheck(item.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isChecked 
                      ? 'bg-emerald-50/50 border-emerald-200' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300'
                    }`}>
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {item.text}
                    </span>
                  </div>

                  {needsLocation && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowLocationMock(item.id); }}
                      className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors self-start sm:self-auto"
                    >
                      <MapPin size={14} /> Find it
                    </button>
                  )}
                </div>

                {/* Location Mock Expandable */}
                {showLocationMock === item.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">Location Integration (Demo)</h5>
                        <p className="text-xs text-slate-500 mt-1 mb-3">
                          In a real school environment, this would display the campus map highlighting the nearest emergency exits, assembly points, or first aid kits based on your current classroom.
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => { toggleCheck(item.id); setShowLocationMock(null); }} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md font-semibold">I Know Where It Is</button>
                          <button onClick={() => setShowLocationMock(null)} className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-semibold">Close</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-end pt-4 border-t border-slate-200/60">
        <button
          onClick={onComplete}
          disabled={!isComplete}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            isComplete 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isComplete ? 'Continue to Next Section' : 'Check all items to proceed'} <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
