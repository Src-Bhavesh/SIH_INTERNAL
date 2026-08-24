import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, AlertTriangle, ShieldCheck, Play, CheckCircle2, RefreshCcw } from 'lucide-react';

interface MiniSimulationProps {
  onComplete: (score: number) => void;
}

export default function MiniSimulation({ onComplete }: MiniSimulationProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const scenes = [
    {
      title: "SCENE 1: THE SHAKING BEGINS",
      context: "You are sitting in your classroom. Suddenly, the projector starts swaying, and a loud rumbling sound echoes. The ground shakes violently.",
      question: "WHAT IS YOUR IMMEDIATE REACTION?",
      options: [
        { text: "Run out into the hallway", isCorrect: false, feedback: "Running during strong shaking is very dangerous. You could fall or get hit by debris." },
        { text: "Drop, Cover, and Hold On under your desk", isCorrect: true, feedback: "Perfect. This protects you from falling objects like lights or ceiling tiles." },
        { text: "Stand in the doorway", isCorrect: false, feedback: "Modern doorways are not stronger than the rest of the building. You are exposed to flying objects." }
      ]
    },
    {
      title: "SCENE 2: DURING THE QUAKE",
      context: "You are under the desk. The shaking intensifies. A bookshelf nearby looks like it might tip over.",
      question: "WHAT DO YOU DO NEXT?",
      options: [
        { text: "Leave the desk and run to the other side of the room", isCorrect: false, feedback: "Do not move while the ground is shaking." },
        { text: "Close your eyes and wait", isCorrect: false, feedback: "You need to secure your position and protect your head." },
        { text: "Hold tightly to the desk legs and cover your neck", isCorrect: true, feedback: "Excellent. Holding on ensures your cover moves with you if it shifts." }
      ]
    },
    {
      title: "SCENE 3: AFTERMATH",
      context: "The shaking has stopped. The alarms are blaring, but the room is mostly intact.",
      question: "WHAT IS YOUR NEXT STEP?",
      options: [
        { text: "Quickly pack your bag and run home", isCorrect: false, feedback: "Never leave the school grounds without authorization. Follow the school evacuation plan." },
        { text: "Check yourself for injuries, then follow the teacher to the evacuation route", isCorrect: true, feedback: "Correct! Stay calm, evaluate safely, and evacuate to the designated assembly point." },
        { text: "Call your parents immediately", isCorrect: false, feedback: "Lines will be jammed. Evacuate safely first." }
      ]
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      setIsFinished(true);
      setMistakes(prev => prev + 1); // Penalty for running out of time
    }
    return () => clearInterval(timer);
  }, [hasStarted, isFinished, timeLeft]);

  const handleSelectOption = (isCorrect: boolean) => {
    if (!isCorrect) {
      setMistakes(prev => prev + 1);
      // We could show immediate feedback, but in a timed sim it's better to push through or show a quick flash
    }
    
    if (sceneIndex < scenes.length - 1) {
      setSceneIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    let base = 100;
    // Penalty for mistakes
    base -= (mistakes * 20);
    // Time bonus
    if (timeLeft > 40) base += 10;
    return Math.max(0, Math.min(100, base));
  };

  if (isFinished) {
    const finalScore = calculateScore();
    const isSuccess = finalScore >= 70;

    return (
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl text-center border border-slate-700 animate-in zoom-in-95 duration-500">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
          {isSuccess ? <ShieldCheck size={40} /> : <AlertTriangle size={40} />}
        </div>
        <h3 className="text-2xl font-bold mb-2">SIMULATION COMPLETE</h3>
        <p className="text-slate-400 mb-8">
          {isSuccess ? 'Excellent response. You survived and responded according to protocol.' : 'You made critical errors during the response. Review the procedures.'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className={`text-3xl font-black ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>{finalScore}%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-1">Response Score</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-3xl font-black text-amber-400">{60 - timeLeft}s</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-1">Response Time</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-3xl font-black text-blue-400">{scenes.length - mistakes}/{scenes.length}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-1">Safe Decisions</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
            <div className="text-lg font-bold text-emerald-400">+50 XP</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-1">Bonus</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              setHasStarted(false);
              setTimeLeft(60);
              setSceneIndex(0);
              setIsFinished(false);
              setMistakes(0);
            }}
            className="px-6 py-3 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} /> Retry Simulation
          </button>
          <button
            onClick={() => onComplete(finalScore)}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} /> Complete Module
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">60-SECOND EARTHQUAKE SIMULATION</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          Put your knowledge to the test. You have 60 seconds to make the right decisions during an active earthquake.
        </p>

        <button
          onClick={() => setHasStarted(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
        >
          <Play size={20} fill="currentColor" /> START SIMULATION
        </button>
      </div>
    );
  }

  const scene = scenes[sceneIndex];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white min-h-[400px] flex flex-col animate-in fade-in">
      
      {/* Header with Timer */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-emerald-400 border border-slate-600">
            {sceneIndex + 1}/{scenes.length}
          </div>
          <span className="font-bold text-slate-300 tracking-wider">{scene.title}</span>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg border ${
          timeLeft <= 10 ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse' : 'bg-slate-800 text-slate-300 border-slate-600'
        }`}>
          <Timer size={20} /> 00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">
            {scene.context}
          </p>
          <h4 className="text-xl font-bold text-white mb-8 border-l-4 border-emerald-500 pl-4">
            {scene.question}
          </h4>

          <div className="space-y-3 mt-auto">
            {scene.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt.isCorrect)}
                className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-emerald-500 transition-all font-medium flex items-center justify-between group"
              >
                <span>{opt.text}</span>
                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
