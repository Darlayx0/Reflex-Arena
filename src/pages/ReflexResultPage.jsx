import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, RefreshCw, Home, Zap, Target, Skull, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ReflexResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { playSFX } = useTheme();

    // Fallback if accessed without state
    const { config, roundTimes } = location.state || {
        config: { mode: 'benchmark', difficulty: 3 },
        roundTimes: Array(5).fill({ time: 5000, botWon: false })
    };

    const { mode, difficulty } = config;

    // Calculations
    const totalTimeMs = roundTimes.reduce((acc, curr) => acc + curr.time, 0);
    const avgTimeMs = totalTimeMs / roundTimes.length;

    // Versus Mode specific
    let botWins = 0;
    let playerWins = 0;
    if (mode === 'versus') {
        roundTimes.forEach(rt => {
            if (rt.botWon) botWins++;
            else playerWins++;
        });
    }

    const playerWonOverall = playerWins > botWins;
    const isVersus = mode === 'versus';

    const formatTime = (ms) => (ms / 1000).toFixed(3);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" } }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
            {/* Ambient Background */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 ${isVersus ? (playerWonOverall ? 'bg-emerald-950/20' : 'bg-rose-950/20') : 'bg-slate-950'
                }`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full blur-[150px] opacity-20 ${isVersus ? (playerWonOverall ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-fuchsia-500'
                    }`} />
                {/* Cyber grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/10 p-8 md:p-14 relative z-10 overflow-hidden"
            >
                {/* Decorative glow over card */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-[50px] pointer-events-none" />

                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center mb-12 relative z-10">
                    <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] shadow-xl border border-white/5 mb-8 relative group">
                        <div className={`absolute inset-0 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity ${isVersus ? (playerWonOverall ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-fuchsia-500'
                            }`} />
                        {isVersus ? (
                            playerWonOverall
                                ? <Crown className="w-16 h-16 text-emerald-400 relative z-10" />
                                : <Skull className="w-16 h-16 text-rose-400 relative z-10" />
                        ) : (
                            <Target className="w-16 h-16 text-fuchsia-400 relative z-10" />
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-lg">
                        {isVersus
                            ? (playerWonOverall ? 'MISSION SUCCESS' : 'SYSTEM FAILURE')
                            : 'BENCHMARK COMPLETE'}
                    </h1>
                    <p className="text-slate-400 font-medium tracking-[0.2em] uppercase text-sm md:text-base">
                        {isVersus
                            ? `Human vs Bot LVL ${difficulty} • Core Score: ${playerWins}-${botWins}`
                            : 'Analysis of 5 Reaction Tests'}
                    </p>
                </motion.div>

                {/* Main Stats */}
                <motion.div variants={itemVariants} className="bg-white/5 rounded-[2rem] border border-white/10 p-8 mb-12 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <div className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-3 relative z-10">Mean Reaction Time</div>
                    <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tabular-nums drop-shadow-2xl relative z-10">
                        {formatTime(avgTimeMs)}<span className="text-3xl md:text-5xl text-slate-600">s</span>
                    </div>
                </motion.div>

                {/* Detailed Logs */}
                <motion.div variants={itemVariants} className="space-y-4 mb-12">
                    <h3 className="text-sm font-black text-slate-500 tracking-[0.3em] uppercase mb-4 px-4 border-l-2 border-slate-700">Detailed Logs</h3>
                    <div className="grid gap-3">
                        {roundTimes.map((rt, index) => (
                            <div key={index} className="flex justify-between items-center p-5 bg-slate-950/50 hover:bg-slate-800/50 transition-colors border border-white/5 rounded-2xl group">
                                <span className="font-bold text-slate-400 uppercase tracking-widest text-sm">Round 0{index + 1}</span>

                                <div className="flex items-center gap-6">
                                    {isVersus && (
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${rt.botWon
                                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                            }`}>
                                            {rt.botWon ? 'BOT WINS' : 'PLAYER WINS'}
                                        </span>
                                    )}
                                    <span className="text-2xl font-black font-mono text-white tracking-tight">
                                        {formatTime(rt.time)}<span className="text-slate-500 text-lg">s</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex gap-5 flex-col md:flex-row">
                    <button
                        onClick={() => { playSFX('click'); navigate('/'); }}
                        className="flex-1 flex items-center justify-center gap-3 p-5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-2xl font-black tracking-widest text-white transition-all shadow-lg"
                    >
                        <Home className="w-5 h-5" /> TERMINAL
                    </button>
                    <button
                        onClick={() => { playSFX('click'); navigate('/game', { state: config }); }}
                        className="flex-[2] flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-black tracking-widest transition-all shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_40px_rgba(217,70,239,0.5)] border border-white/20"
                    >
                        <RefreshCw className="w-5 h-5" /> RUN AGAIN
                    </button>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default ReflexResultPage;
