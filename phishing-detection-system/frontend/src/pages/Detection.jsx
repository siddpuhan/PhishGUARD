import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
<<<<<<< Updated upstream
import { Shield, Mail, Globe, AlertTriangle, CheckCircle, Terminal, Cpu } from 'lucide-react';
=======
import { Button } from '../components/ui/button';
import { Shield, Mail, Globe, AlertTriangle, ShieldAlert, ShieldCheck, Loader2, ArrowRight, Activity, Terminal } from 'lucide-react';
>>>>>>> Stashed changes
import { motion, AnimatePresence } from 'framer-motion';

const TerminalLine = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.2 }}
        className="font-mono text-sm text-lime-400 mb-1 flex items-start"
    >
        <span className="mr-2 opacity-50">{'>'}</span>
        {children}
    </motion.div>
);

const Detection = () => {
    const [text, setText] = useState('');
    const [type, setType] = useState('url');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    const handleScan = async (e) => {
        e.preventDefault();
        if (!text) return;
        setLoading(true);
        setResult(null);
        setLogs([]);

        // Simulate terminal logs
        const logMessages = [
            "INITIALIZING_SCAN_SEQUENCE...",
            "CONNECTING_TO_NEURAL_ENGINE...",
            `ANALYZING_${type.toUpperCase()}_PAYLOAD...`,
            "EXTRACTING_FEATURES...",
            "CALCULATING_RISK_VECTORS...",
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < logMessages.length) {
                setLogs(prev => [...prev, logMessages[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 300);

        try {
            const { data } = await api.post('/scan/predict', { text, type });
<<<<<<< Updated upstream
            await new Promise(resolve => setTimeout(resolve, 2000)); // Ensure logs finish
            setResult(data.result);
        } catch (error) {
            console.error(error);
            setLogs(prev => [...prev, "ERROR: CONNECTION_FAILED"]);
            alert('Analysis failed. Please try again.');
=======
            // Artificial delay for technical feel
            await new Promise(resolve => setTimeout(resolve, 1200)); 
            setResult(data.result);
        } catch (error) {
            console.error("Inference failure", error);
            alert('Security engine communication failure. Verify system connection.');
>>>>>>> Stashed changes
        } finally {
            clearInterval(interval);
            setLoading(false);
        }
    };

    const resetScan = () => {
        setResult(null);
        setText('');
        setLogs([]);
    };

    return (
        <Layout>
<<<<<<< Updated upstream
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="border-b border-[#333] pb-6">
                    <h1 className="text-5xl font-display text-white mb-2">THREAT_DETECTION</h1>
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                        Enter target for deep heuristic analysis
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Input Controls */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Toggle Cards */}
                        <div className="flex space-x-4">
                            <button
                                onClick={() => { setType('url'); setResult(null); }}
                                className={`flex-1 p-6 border transition-all duration-200 group text-left ${type === 'url' ? 'border-lime-400 bg-lime-400/5' : 'border-[#333] bg-[#0a0a0a] hover:border-gray-600'}`}
                            >
                                <Globe className={`h-6 w-6 mb-3 ${type === 'url' ? 'text-lime-400' : 'text-gray-500'}`} />
                                <div className={`font-mono text-sm uppercase tracking-widest ${type === 'url' ? 'text-lime-400' : 'text-gray-400'}`}>Target: URL</div>
                            </button>
                            <button
                                onClick={() => { setType('email'); setResult(null); }}
                                className={`flex-1 p-6 border transition-all duration-200 group text-left ${type === 'email' ? 'border-lime-400 bg-lime-400/5' : 'border-[#333] bg-[#0a0a0a] hover:border-gray-600'}`}
                            >
                                <Mail className={`h-6 w-6 mb-3 ${type === 'email' ? 'text-lime-400' : 'text-gray-500'}`} />
                                <div className={`font-mono text-sm uppercase tracking-widest ${type === 'email' ? 'text-lime-400' : 'text-gray-400'}`}>Target: EMAIL</div>
                            </button>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleScan} className="space-y-6">
                            <div className="relative group">
                                <div className="absolute top-0 left-0 text-[10px] bg-[#121212] px-2 -translate-y-1/2 translate-x-4 text-gray-500 font-mono uppercase tracking-widest group-focus-within:text-lime-400 transition-colors">
                                    INPUT_PAYLOAD
                                </div>
                                {type === 'url' ? (
                                    <input
                                        type="text"
                                        placeholder="ENTER_TARGET_URL"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-[#333] p-6 text-lg font-mono text-white placeholder-gray-700 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_20px_rgba(163,230,53,0.1)] transition-all duration-300"
                                        autoFocus
                                    />
                                ) : (
                                    <textarea
                                        placeholder="PASTE_EMAIL_CONTENT_BLOCK"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full min-h-[200px] bg-[#0a0a0a] border border-[#333] p-6 text-lg font-mono text-white placeholder-gray-700 focus:outline-none focus:border-lime-400 focus:shadow-[0_0_20px_rgba(163,230,53,0.1)] transition-all duration-300 resize-none"
                                    />
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !text}
                                className="w-full py-5 bg-lime-400 text-black font-mono text-sm font-bold uppercase tracking-[0.2em] hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'SCANNING_IN_PROGRESS...' : 'INITIATE_SCAN_SEQUENCE'}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Results Terminal */}
                    <div className="md:col-span-1">
                        <div className="h-full border border-[#333] bg-black p-4 flex flex-col relative overflow-hidden min-h-[400px]">
                            {/* CRT Scanline Effect */}
                            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20"></div>
                            
                            <div className="flex items-center justify-between mb-4 border-b border-[#333] pb-2 z-10">
                                <span className="text-xs font-mono text-gray-500 uppercase">TERMINAL_OUTPUT</span>
                                <Cpu className="h-4 w-4 text-gray-700" />
                            </div>

                            <div className="flex-1 font-mono text-sm space-y-1 relative z-10">
                                {!loading && !result && logs.length === 0 && (
                                    <div className="text-gray-700 mt-10 text-center">
                                        [AWAITING_INPUT]
                                        <div className="mt-2 text-[10px] animate-pulse">_</div>
                                    </div>
                                )}

                                {logs.map((log, i) => (
                                    <TerminalLine key={i} delay={i * 0.1}>{log}</TerminalLine>
                                ))}

                                {loading && (
                                    <div className="mt-4">
                                        <div className="h-1 w-full bg-[#111] overflow-hidden">
                                            <motion.div
                                                initial={{ x: "-100%" }}
                                                animate={{ x: "100%" }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="h-full w-1/2 bg-lime-400"
                                            />
                                        </div>
                                    </div>
                                )}

                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-8 pt-4 border-t border-[#333] space-y-4"
                                    >
                                        <div className="mb-6">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">THREAT_ASSESSMENT</div>
                                            <div className={`text-3xl font-display ${result.isPhishing ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {result.isPhishing ? 'CRITICAL_THREAT' : 'VERIFIED_SAFE'}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                                                <span>CONFIDENCE_SCORE</span>
                                                <span>{(result.confidence * 10).toFixed(1)} / 10.0</span>
                                            </div>
                                            <div className="h-2 w-full bg-[#111]">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.confidence * 100}%` }}
                                                    transition={{ delay: 0.8, duration: 1 }}
                                                    className={`h-full ${result.isPhishing ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">VECTOR_ANALYSIS</div>
                                            {result.features.suspicious_keywords?.length > 0 ? (
                                                result.features.suspicious_keywords.map((kw, i) => (
                                                    <div key={i} className="flex items-center text-red-400 text-xs">
                                                        <AlertTriangle className="h-3 w-3 mr-2" />
                                                        DETECTED: {kw.toUpperCase()}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex items-center text-emerald-500 text-xs">
                                                    <CheckCircle className="h-3 w-3 mr-2" />
                                                    NO_SIGNATURES_FOUND
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            onClick={resetScan}
                                            className="w-full mt-6 py-2 border border-[#333] text-gray-400 text-xs font-mono hover:text-white hover:border-white transition-colors uppercase tracking-widest"
                                        >
                                            RESET_TERMINAL
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
=======
            <div className="max-w-4xl mx-auto space-y-8">
                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="input-stage"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center space-x-3 text-cyan-500">
                                <Terminal className="h-5 w-5" />
                                <h1 className="text-xl font-bold tracking-tight uppercase italic">Active Threat Scanner</h1>
                            </div>

                            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20" />
                                
                                <div className="flex space-x-2 mb-10">
                                    <TabButton active={type === 'url'} onClick={() => setType('url')} icon={<Globe className="w-4 h-4" />} label="Network URL" />
                                    <TabButton active={type === 'email'} onClick={() => setType('email')} icon={<Mail className="w-4 h-4" />} label="Email Payload" />
                                </div>

                                <form onSubmit={handleScan} className="space-y-8">
                                    <div className="relative group">
                                        {type === 'url' ? (
                                            <div className="relative">
                                                <input
                                                    placeholder="Enter URL for analysis (e.g. https://secure-gate.net/verify)"
                                                    value={text}
                                                    onChange={(e) => setText(e.target.value)}
                                                    className="w-full h-16 bg-slate-950/50 border border-cyan-500/10 rounded-xl px-6 font-mono text-lg focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-700"
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <textarea
                                                placeholder="Paste full email content for linguistic scrutiny..."
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                className="w-full min-h-[200px] bg-slate-950/50 border border-cyan-500/10 rounded-xl p-6 font-mono text-sm focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-700 resize-none"
                                            />
                                        )}
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={loading || !text}
                                        className="w-full h-14 btn-cyber text-sm relative overflow-hidden group"
                                    >
                                        <AnimatePresence mode="wait">
                                            {loading ? (
                                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-3">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    <span className="font-bold uppercase tracking-widest">Running Inference...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-3">
                                                    <Shield className="h-5 w-5" />
                                                    <span className="font-bold uppercase tracking-widest">Execute Deep Scan</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result-stage"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className={`glass-card rounded-2xl p-12 text-center relative overflow-hidden border-t-4 ${result.isPhishing ? 'border-t-red-500 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : 'border-t-green-500 shadow-[0_0_50px_rgba(16,185,129,0.1)]'}`}>
                                <motion.div 
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mb-8"
                                >
                                    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-900" />
                                            <motion.circle 
                                                cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="8" 
                                                strokeDasharray="465"
                                                initial={{ strokeDashoffset: 465 }}
                                                animate={{ strokeDashoffset: 465 - (465 * result.confidence) }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={result.isPhishing ? 'text-red-500' : 'text-green-500'}
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className={`text-3xl font-extrabold ${result.isPhishing ? 'text-red-500' : 'text-green-500'}`}>
                                                {(result.confidence * 100).toFixed(0)}%
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidence</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="space-y-4 mb-10">
                                    <h2 className={`text-4xl font-extrabold tracking-tight uppercase italic ${result.isPhishing ? 'text-red-500' : 'text-green-500'}`}>
                                        {result.isPhishing ? 'Malicious Detected' : 'Vector Secured'}
                                    </h2>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                        Neural engine classification complete
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-left">
                                    <ResultDetailCard 
                                        label="Linguistic Indicators" 
                                        value={result.features.suspicious_keywords?.length > 0 ? result.features.suspicious_keywords.join(', ') : 'None detected'} 
                                        color={result.isPhishing ? 'text-red-400' : 'text-slate-400'}
                                    />
                                    <ResultDetailCard 
                                        label="Vector Length" 
                                        value={`${result.features.length} characters`} 
                                        color="text-slate-400"
                                    />
                                    {type === 'url' && (
                                        <>
                                            <ResultDetailCard label="Protocol Safety" value={result.features.has_https ? 'HTTPS Valid' : 'Insecure HTTP'} color={result.features.has_https ? 'text-green-400' : 'text-red-400'} />
                                            <ResultDetailCard label="Direct IP Usage" value={result.features.has_ip ? 'Anomalous' : 'Clean'} color={result.features.has_ip ? 'text-red-400' : 'text-slate-400'} />
                                        </>
                                    )}
                                </div>

                                <Button onClick={resetScan} variant="outline" className="mt-12 w-full h-12 btn-outline text-[10px] font-extrabold uppercase tracking-widest">
                                    Initialize New Scrutiny
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
>>>>>>> Stashed changes
            </div>
        </Layout>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 font-bold uppercase tracking-widest text-[10px] ${
            active 
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
            : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const ResultDetailCard = ({ label, value, color }) => (
    <div className="bg-slate-950/50 p-4 rounded-xl border border-cyan-500/5">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xs font-bold font-mono truncate ${color}`}>{value}</p>
    </div>
);

export default Detection;
