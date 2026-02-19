import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, Clock, AlertCircle, X, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const TOTAL_ROUNDS = 5;
const NUMBERS_PER_ROUND = 10;

const DIFFICULTIES = {
    1: { botTime: 15 }, // ~1.5s per number
    2: { botTime: 12 }, // ~1.2s per number
    3: { botTime: 9 },  // ~0.9s per number
    4: { botTime: 7 },  // ~0.7s per number
    5: { botTime: 5 },  // ~0.5s per number
};

const generatePositions = () => {
    const positions = [];
    const minDistance = 15; // Minimum distance %

    for (let i = 1; i <= NUMBERS_PER_ROUND; i++) {
        let attempts = 0;
        let pos;
        let valid = false;

        while (!valid && attempts < 100) {
            pos = {
                top: Math.random() * 75 + 12.5, // 12.5% to 87.5%
                left: Math.random() * 75 + 12.5, // 12.5% to 87.5%
                id: i
            };

            valid = true;
            for (let j = 0; j < positions.length; j++) {
                const dy = pos.top - positions[j].top;
                const dx = pos.left - positions[j].left;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    valid = false;
                    break;
                }
            }
            attempts++;
        }
        positions.push(pos);
    }
    return positions.sort(() => Math.random() - 0.5);
};

const ReflexGamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { playSFX } = useTheme();

    const config = location.state || { mode: 'benchmark', difficulty: 3 };
    const { mode, difficulty } = config;

    const [round, setRound] = useState(1);
    const [gameState, setGameState] = useState('countdown'); // countdown, playing, roundEnd, finished
    const [countdown, setCountdown] = useState(3);

    const [expectedNumber, setExpectedNumber] = useState(1);
    const [positions, setPositions] = useState([]);

    // Timing
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const timerRef = useRef(null);

    const [roundTimes, setRoundTimes] = useState([]);

    // Bot tracking
    const [botProgress, setBotProgress] = useState(0);
    const botIntervalRef = useRef(null);

    // Initialize Round
    useEffect(() => {
        if (gameState === 'countdown') {
            setExpectedNumber(1);
            setPositions(generatePositions());

            const countInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countInterval);
                        setGameState('playing');
                        setStartTime(Date.now());
                        playSFX('success'); // Beep
                        return 0;
                    }
                    playSFX('click');
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countInterval);
        }
    }, [gameState, round, playSFX]);

    // Timer and Bot Logic
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setCurrentTime(Date.now() - startTime);
            }, 10);

            if (mode === 'versus') {
                const totalBotMs = DIFFICULTIES[difficulty].botTime * 1000;
                const updateIntervalMs = 50;
                const progressPerUpdate = (updateIntervalMs / totalBotMs) * 100;

                botIntervalRef.current = setInterval(() => {
                    setBotProgress(prev => {
                        const next = prev + progressPerUpdate;
                        if (next >= 100) {
                            clearInterval(botIntervalRef.current);
                            handleRoundEnd(totalBotMs, true);
                            return 100;
                        }
                        return next;
                    });
                }, updateIntervalMs);
            }

            return () => {
                clearInterval(timerRef.current);
                clearInterval(botIntervalRef.current);
            };
        }
    }, [gameState, startTime, mode, difficulty]);

    const handleNumberClick = (id) => {
        if (gameState !== 'playing') return;

        if (id === expectedNumber) {
            playSFX('click');
            if (expectedNumber === NUMBERS_PER_ROUND) {
                // Round Complete
                handleRoundEnd(Date.now() - startTime, false);
            } else {
                setExpectedNumber(prev => prev + 1);
            }
        } else {
            playSFX('error');
        }
    };

    const handleRoundEnd = (timeTakenMs, botWon) => {
        clearInterval(timerRef.current);
        clearInterval(botIntervalRef.current);
        setGameState('roundEnd');
        setRoundTimes(prev => [...prev, { round, time: timeTakenMs, botWon }]);
    };

    const handleNextPhase = () => {
        if (round < TOTAL_ROUNDS) {
            setRound(prev => prev + 1);
            setCountdown(3);
            setGameState('countdown');
            setCurrentTime(0);
            setBotProgress(0);
        } else {
            playSFX('success');
            navigate('/result', { state: { config, roundTimes } });
        }
    };

    const formatTime = (ms) => (ms / 1000).toFixed(3);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans select-none text-slate-200">

            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Cyberpunk Grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none" />
            </div>

            {/* Header / HUD */}
            <div className="fixed top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-20">
                <button
                    onClick={() => { playSFX('click'); navigate('/'); }}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-sm text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md group"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="flex flex-col items-center">
                    <div className="px-6 py-2 bg-slate-900/80 border border-violet-500/30 rounded-full shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] backdrop-blur-xl font-bold text-violet-200 text-sm tracking-[0.2em] uppercase mb-3">
                        Round {round} / {TOTAL_ROUNDS}
                    </div>

                    <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-fuchsia-200 tabular-nums tracking-tighter drop-shadow-lg flex items-center gap-3">
                        <Clock className="w-6 h-6 md:w-8 md:h-8 text-fuchsia-400" />
                        {formatTime(currentTime)}<span className="text-2xl md:text-4xl text-fuchsia-400/50">s</span>
                    </div>
                </div>

                <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Next Target Indicator */}
            {gameState === 'playing' && (
                <div className="fixed top-32 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-slate-900/90 border border-fuchsia-500/50 text-white rounded-full font-bold text-lg flex items-center gap-3 shadow-[0_0_30px_rgba(217,70,239,0.3)] z-20 backdrop-blur-md">
                    <Zap className="w-5 h-5 text-fuchsia-400 animate-pulse" /> TARGET:
                    <span className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black shadow-inner border border-white/20">
                        {expectedNumber > NUMBERS_PER_ROUND ? '-' : expectedNumber}
                    </span>
                </div>
            )}

            {/* Bot Progress Header */}
            {mode === 'versus' && (
                <div className="fixed bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none flex justify-center">
                    <div className="w-full max-w-3xl bg-slate-900/60 p-4 md:p-5 rounded-3xl shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)] backdrop-blur-xl border border-white/10 pointer-events-auto">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex items-center gap-2 text-violet-400 font-bold text-sm tracking-[0.2em] uppercase">
                                <Bot className="w-5 h-5" /> AI Overlord <span className="text-white/30 text-xs">LVL {difficulty}</span>
                            </div>
                            <div className="text-xs font-black text-fuchsia-400 tracking-widest">
                                {Math.min(100, botProgress).toFixed(0)}%
                            </div>
                        </div>
                        <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                            {/* Glow beam */}
                            <div className="absolute top-0 left-0 h-full w-full bg-violet-600/20 blur-sm pointer-events-none" style={{ width: `${botProgress}%` }} />
                            <div
                                className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-75 ease-linear relative overflow-hidden"
                                style={{ width: `${botProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=')] mix-blend-overlay" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Board (Actual clickable area) */}
            <div className="relative w-[95vw] h-[65vh] md:w-[80vw] md:h-[70vh] max-w-5xl mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden group">
                {/* Board inner glow */}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(139,92,246,0.1)] pointer-events-none" />

                <AnimatePresence>
                    {gameState === 'countdown' && (
                        <motion.div
                            key="countdown"
                            initial={{ opacity: 0, scale: 0.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="absolute inset-0 flex items-center justify-center z-30"
                        >
                            <div className="text-[12rem] md:text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 drop-shadow-[0_0_50px_rgba(217,70,239,0.5)]">
                                {countdown > 0 ? countdown : 'GO!'}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {gameState !== 'countdown' && positions.map((pos) => {
                    const isClicked = pos.id < expectedNumber;
                    const isNext = pos.id === expectedNumber;

                    if (isClicked) return null; // Hide clicked numbers

                    return (
                        <motion.button
                            key={pos.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: isNext ? 1.15 : 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            onClick={() => handleNumberClick(pos.id)}
                            className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-black transition-all duration-200 z-10 ${isNext
                                    ? 'bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.6)] border-2 border-white/50 hover:scale-[1.25]'
                                    : 'bg-slate-800 text-slate-400 border border-white/10 hover:bg-slate-700 hover:text-white hover:scale-110 opacity-80'
                                }`}
                            style={{
                                top: `${pos.top}%`,
                                left: `${pos.left}%`,
                                transform: `translate(-50%, -50%)`
                            }}
                        >
                            {/* Inner ring for target */}
                            {isNext && (
                                <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 scale-125 animate-ping-slow" />
                            )}
                            {pos.id}
                        </motion.button>
                    );
                })}

                {/* Round End Overlay */}
                <AnimatePresence>
                    {gameState === 'roundEnd' && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
                            className="absolute inset-0 bg-slate-950/60 flex items-center justify-center z-40 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="bg-slate-900/90 p-10 md:p-12 rounded-[3rem] shadow-[0_0_100px_rgba(139,92,246,0.3)] max-w-md w-full text-center border border-white/10 relative overflow-hidden"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-500/10 blur-[50px] pointer-events-none" />

                                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                                    Round {round} Cleared
                                </h3>

                                {mode === 'versus' && (
                                    <div className="mb-6 relative">
                                        <div className={`text-xl font-black tracking-widest uppercase p-3 rounded-2xl border ${roundTimes[round - 1]?.botWon ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]'}`}>
                                            {roundTimes[round - 1]?.botWon ? 'AI Domination' : 'Human Victory'}
                                        </div>
                                    </div>
                                )}

                                <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Clerance Time</div>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tabular-nums mb-8 drop-shadow-md">
                                    {formatTime(currentTime)}<span className="text-2xl text-slate-500">s</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleNextPhase}
                                    className="w-full p-5 bg-white text-slate-900 hover:bg-slate-200 rounded-2xl font-black text-lg tracking-wider flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] group"
                                >
                                    {round < TOTAL_ROUNDS ? 'INITIATE NEXT' : 'VIEW ANALYSIS'}
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
};

export default ReflexGamePage;
