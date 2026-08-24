'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { disasterModules } from '@/lib/data';
import { useAuthStore, useStudentProgressStore } from '@/lib/store';
import { DisasterModule, QuizAttemptRecord } from '@/lib/types';
import {
  Lock, CheckCircle2, ArrowRight, BookOpen, Award,
  Sparkles, Check, ChevronRight, Video, FileText, CheckSquare,
  HelpCircle, RotateCcw
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LearningJourney from '@/components/learn/LearningJourney';
import InteractiveOverview from '@/components/learn/InteractiveOverview';
import InteractiveDosDonts from '@/components/learn/InteractiveDosDonts';
import InteractiveSteps from '@/components/learn/InteractiveSteps';
import InteractiveChecklist from '@/components/learn/InteractiveChecklist';
import InteractiveQuiz from '@/components/learn/InteractiveQuiz';
import MiniSimulation from '@/components/learn/MiniSimulation';

function ModuleDetail({
  module,
  onBack,
  isAlreadyCompleted,
}: {
  module: DisasterModule;
  onBack: () => void;
  isAlreadyCompleted: boolean;
}) {
  const { user } = useAuthStore();
  const { completeModule } = useStudentProgressStore();

  // The final simulation is an implicit extra section at the end
  const sections = [...module.sections, { id: 'final-sim', title: 'Simulation', type: 'simulation' }];
  
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || '');
  const [unlockedSections, setUnlockedSections] = useState<string[]>([sections[0]?.id || '']);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [xp, setXp] = useState(0);

  const activeIndex = sections.findIndex(s => s.id === activeSectionId);
  const activeSection = sections[activeIndex];

  const handleSectionComplete = () => {
    if (!completedSections.includes(activeSectionId)) {
      setCompletedSections(prev => [...prev, activeSectionId]);
      setXp(prev => prev + 25); // Award XP for completing a section
    }
    
    if (activeIndex < sections.length - 1) {
      const nextId = sections[activeIndex + 1].id;
      if (!unlockedSections.includes(nextId)) {
        setUnlockedSections(prev => [...prev, nextId]);
      }
      setActiveSectionId(nextId);
    }
  };

  const handleQuizComplete = (answers: Record<string, string>) => {
    setQuizAnswers(answers);
    handleSectionComplete();
  };

  const handleSimulationComplete = async (score: number) => {
    if (!user) return;
    setXp(prev => prev + score);
    
    // Save to backend logic (simplified for UI)
    const quizSection = module.sections.find((s: any) => s.type === 'quiz');
    let correctCount = 0;
    
    if (quizSection?.content.questions) {
      quizSection.content.questions.forEach((q: any) => {
        const selectedOption = q.options.find((o: any) => o.id === quizAnswers[q.id]);
        if (selectedOption?.isCorrect) correctCount++;
      });
    }

    const quizAttempt: QuizAttemptRecord = {
      id: `quiz-${module.id}-${Date.now()}`,
      moduleId: module.id,
      moduleTitle: `${module.title} Knowledge Assessment`,
      disasterType: module.disasterType,
      userId: user.id,
      completedAt: new Date().toISOString(),
      score: score, // Use simulation score as primary
      totalQuestions: quizSection?.content.questions?.length || 0,
      correctCount,
      mistakesCount: 0,
      status: 'completed',
    };

    await completeModule(user.id, module.id, quizAttempt, []);
    setCompletedSuccess(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          ← Back to All Modules
        </button>

        <div className="flex items-center gap-3">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-bold gap-1 shadow-sm">
            <Sparkles size={13} /> {xp} XP Earned
          </Badge>
          {isAlreadyCompleted && (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs gap-1 font-semibold">
              <CheckCircle2 size={13} /> Completed
            </Badge>
          )}
        </div>
      </div>

      {completedSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Award size={18} className="text-emerald-600" />
            Module Successfully Conquered!
          </div>
          <p className="text-xs text-emerald-700">
            Outstanding! You have mastered {module.title}. Your progress is saved.
          </p>
        </motion.div>
      )}

      {/* Module Banner */}
      <Card className="border-slate-200/80 bg-white shadow-2xs rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-3xl shadow-2xs shrink-0">
              {module.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">{module.title}</h1>
                <Badge variant="outline" className="text-[10px] capitalize bg-white text-slate-600">
                  {module.disasterType}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">{module.description}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Timeline */}
      <LearningJourney 
        sections={sections}
        currentSectionId={activeSectionId}
        unlockedSections={unlockedSections}
        completedSections={completedSections}
        onSelectSection={setActiveSectionId}
      />

      {/* Dynamic Section Content */}
      <div className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection.type === 'overview' && (
              <InteractiveOverview content={(activeSection as any).content} onComplete={handleSectionComplete} />
            )}
            
            {activeSection.type === 'dos_donts' && (
              <InteractiveDosDonts content={(activeSection as any).content} onComplete={handleSectionComplete} />
            )}
            
            {activeSection.type === 'steps' && (
              <InteractiveSteps content={(activeSection as any).content} onComplete={handleSectionComplete} />
            )}
            
            {activeSection.type === 'checklist' && (
              <InteractiveChecklist content={(activeSection as any).content} onComplete={handleSectionComplete} />
            )}
            
            {activeSection.type === 'quiz' && (
              <InteractiveQuiz content={(activeSection as any).content} onComplete={handleQuizComplete} />
            )}
            
            {activeSection.type === 'simulation' && (
              <MiniSimulation onComplete={handleSimulationComplete} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LearnContent() {
  const { user } = useAuthStore();
  const { getStudentPrep, fetchStudentData } = useStudentProgressStore();

  React.useEffect(() => {
    if (user?.id) {
      fetchStudentData(user.id);
    }
  }, [user?.id, fetchStudentData]);

  const prep = user ? getStudentPrep(user.id) : undefined;
  const [selectedModule, setSelectedModule] = useState<DisasterModule | null>(null);

  if (selectedModule) {
    const isCompleted = prep?.completedModules.includes(selectedModule.id) || false;
    return (
      <ModuleDetail
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
        isAlreadyCompleted={isCompleted}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Disaster Learning Modules</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Interactive curriculum, lectures, guidelines, and safety drills.
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold px-3 py-1">
              🎓 Student: {user.name} • {prep?.completedModules.length || 0}/3 Modules Completed
            </Badge>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {disasterModules.map(module => {
          const isCompleted = prep?.completedModules.includes(module.id);

          return (
            <Card
              key={module.id}
              className={`border-slate-200/80 bg-white/90 shadow-2xs rounded-2xl flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all ${
                !module.isAvailable ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shrink-0">
                      {module.icon}
                    </div>
                    {isCompleted && (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-semibold">
                        <CheckCircle2 size={11} className="mr-1" /> Completed
                      </Badge>
                    )}
                    {!module.isAvailable && (
                      <Badge variant="outline" className="text-[10px] text-slate-400">
                        <Lock size={10} className="mr-1" /> Coming Soon
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm">{module.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{module.sections.length} Lessons &amp; Quizzes</span>
                    <span>~{module.estimatedMinutes} mins</span>
                  </div>

                  {module.isAvailable && (
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'default'}
                      className={`w-full text-xs font-semibold gap-1.5 cursor-pointer ${
                        isCompleted
                          ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                      onClick={() => setSelectedModule(module)}
                    >
                      {isCompleted ? 'Review Lectures' : 'Start Learning'} <ArrowRight size={13} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <DashboardLayout requiredRole="student">
      <LearnContent />
    </DashboardLayout>
  );
}
