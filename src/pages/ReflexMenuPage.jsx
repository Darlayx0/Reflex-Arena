import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Zap, Bot, Trophy, Settings, Sparkles, ChevronLeft, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const DIFFICULTIES = [
    { value: 1, label: "Beginner", speedDesc: "Relaxed", botTime: 15 },
    { value: 2, label: "Amateur", speedDesc: "Average", botTime: 12 },
    { value: 3, label: "Skilled", speedDesc: "Fast", botTime: 9 },
    { value: 4, label: "Expert", speedDesc: "Very Fast", botTime: 7 },
    { value: 5, label: "Master", speedDesc: "Godlike", botTime: 5 },
];

const ReflexMenuPage = () => {
    const navigate = useNavigate();
    const { playSFX } = useTheme();
    const [mode, setMode] = useState('benchmark'); // 'benchmark' or 'versus'
    const [difficulty, setDifficulty] = useState(3);

    const handleStart = () => {
        playSFX('click');
        navigate('/game', { state: { mode, difficulty } });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-violet-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[30%] -right-[20%] w-[60vw] h-[60vw] bg-fuchsia-900/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-0 left-[20%] w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-[90px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent,transparent)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(139,92,246,0.3)] border border-white/10 p-8 md:p-12 relative z-10"
            >
                {/* Header Profile glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-[50px] pointer-events-none" />

                <div className="flex flex-col items-center gap-6 mb-12 border-b border-white/5 pb-10">
                    <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
                        className="p-5 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl text-white shadow-[0_0_40px_-5px_var(--tw-shadow-color)] shadow-fuchsia-500/50 ring-1 ring-white/20 relative group cursor-pointer"
                    >
                        <Zap className="w-10 h-10 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    </motion.div>
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-fuchsia-200 to-blue-200 tracking-tighter leading-tight drop-shadow-sm mb-3">
                            Reflex Arena
                        </h1>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium tracking-wide text-fuchsia-200 shadow-inner">
                            <Target className="w-4 h-4" /> 5 Rounds • Fast Paced
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Mode Selection */}
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-2 mb-5">
                            <span className="w-8 h-[1px] bg-slate-700" />
                            Game Format
                            <span className="flex-1 h-[1px] bg-gradient-to-r from-slate-700 to-transparent" />
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <button
                                onClick={() => { setMode('benchmark'); playSFX('click'); }}
                                className={`group p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden ${mode === 'benchmark'
                                        ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-100 shadow-[0_0_30px_-5px_rgba(217,70,239,0.3)]'
                                        : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                {mode === 'benchmark' && (
                                    <motion.div layoutId="modeGlow" className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-transparent pointer-events-none" />
                                )}
                                <div className="relative z-10 flex justify-between items-center mb-3">
                                    <h3 className="text-2xl font-black tracking-tight">Benchmark</h3>
                                    <div className={`p-3 rounded-2xl ${mode === 'benchmark' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-sm font-medium leading-relaxed opacity-80 relative z-10">
                                    Test your raw reaction speed against the clock. No pressure, just you and the timer.
                                </p>
                            </button>

                            <button
                                onClick={() => { setMode('versus'); playSFX('click'); }}
                                className={`group p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden ${mode === 'versus'
                                        ? 'border-violet-500 bg-violet-500/10 text-violet-100 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]'
                                        : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                {mode === 'versus' && (
                                    <motion.div layoutId="modeGlow" className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent pointer-events-none" />
                                )}
                                <div className="relative z-10 flex justify-between items-center mb-3">
                                    <h3 className="text-2xl font-black tracking-tight">Versus AI</h3>
                                    <div className={`p-3 rounded-2xl ${mode === 'versus' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                                        <Bot className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-sm font-medium leading-relaxed opacity-80 relative z-10">
                                    Race against an AI opponent. The AI gets faster on higher difficulties.
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <AnimatePresence>
                        {mode === 'versus' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-2 mb-5">
                                        <span className="w-8 h-[1px] bg-slate-700" />
                                        Bot Difficulty
                                        <span className="flex-1 h-[1px] bg-gradient-to-r from-slate-700 to-transparent" />
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {DIFFICULTIES.map((diff) => (
                                            <button
                                                key={diff.value}
                                                onClick={() => { setDifficulty(diff.value); playSFX('click'); }}
                                                className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden ${difficulty === diff.value
                                                        ? 'bg-violet-600 text-white border-violet-400 shadow-[0_0_20px_-2px_rgba(139,92,246,0.5)] scale-105 z-10'
                                                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200 hover:border-white/20'
                                                    }`}
                                            >
                                                {difficulty === diff.value && (
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                                )}
                                                <span className="text-3xl font-black relative z-10">{diff.value}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 relative z-10">{diff.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Start Button */}
                    <div className="pt-6">
                        <motion.button
                            whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStart}
                            className="w-full p-6 rounded-3xl shadow-[0_0_40px_-10px_rgba(192,38,211,0.5)] transition-all flex items-center justify-center gap-4 group relative overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 text-white border border-white/20"
                        >
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                            <div className="flex flex-col items-center relative z-10">
                                <h3 className="text-3xl font-black tracking-tight drop-shadow-md">
                                    INITIATE ARENA
                                </h3>
                                <p className="text-[11px] font-bold uppercase tracking-[0.3em] mt-2 text-white/80 drop-shadow-sm">
                                    {mode === 'benchmark' ? 'Solo Mode • 5 Rounds' : `AI Battle • Level ${difficulty}`}
                                </p>
                            </div>
                            <Play className="w-10 h-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 fill-current relative z-10 absolute right-10 hidden md:block" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Custom Tailwind animation for shimmer */}
            <style jsx="true">{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default ReflexMenuPage;
