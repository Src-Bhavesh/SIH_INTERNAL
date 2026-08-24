import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock } from 'lucide-react';

interface LearningJourneyProps {
  sections: { id: string; title: string; type: string }[];
  currentSectionId: string;
  unlockedSections: string[];
  completedSections: string[];
  onSelectSection: (id: string) => void;
}

export default function LearningJourney({
  sections,
  currentSectionId,
  unlockedSections,
  completedSections,
  onSelectSection
}: LearningJourneyProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-6 flex overflow-x-auto hide-scrollbar">
      <div className="flex items-center min-w-max mx-auto gap-2 sm:gap-4">
        {sections.map((section, idx) => {
          const isUnlocked = unlockedSections.includes(section.id);
          const isCompleted = completedSections.includes(section.id);
          const isActive = currentSectionId === section.id;
          
          return (
            <React.Fragment key={section.id}>
              {/* Step */}
              <button
                onClick={() => isUnlocked && onSelectSection(section.id)}
                disabled={!isUnlocked}
                className={`relative flex flex-col items-center group transition-all p-2 rounded-xl ${
                  isUnlocked ? 'cursor-pointer hover:bg-slate-50' : 'cursor-not-allowed opacity-60'
                }`}
              >
                {/* Icon Circle */}
                <motion.div 
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive ? '#047857' : isCompleted ? '#d1fae5' : isUnlocked ? '#f1f5f9' : '#f8fafc',
                    borderColor: isActive ? '#047857' : isCompleted ? '#34d399' : '#e2e8f0',
                  }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors shadow-sm`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  ) : !isUnlocked ? (
                    <Lock size={16} className="text-slate-400" />
                  ) : (
                    <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-600'}`}>
                      {idx + 1}
                    </span>
                  )}
                </motion.div>
                
                {/* Title */}
                <div className="mt-2 text-center w-20 sm:w-24">
                  <p className={`text-[10px] sm:text-xs font-semibold leading-tight ${isActive ? 'text-emerald-800' : 'text-slate-600'}`}>
                    {section.title}
                  </p>
                </div>

                {/* Active Indicator Glow */}
                {isActive && (
                  <motion.div 
                    layoutId="activeStep"
                    className="absolute inset-0 bg-emerald-50 rounded-xl border border-emerald-100 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              {/* Connector Line */}
              {idx < sections.length - 1 && (
                <div className="w-8 sm:w-16 h-1 bg-slate-100 rounded-full mb-6 relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    className="absolute left-0 top-0 bottom-0 bg-emerald-400"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
