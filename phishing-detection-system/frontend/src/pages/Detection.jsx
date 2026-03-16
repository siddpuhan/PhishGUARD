import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Shield, Mail, Globe, AlertTriangle, CheckCircle, Terminal, Cpu } from 'lucide-react';
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
            await new Promise(resolve => setTimeout(resolve, 2000)); // Ensure logs finish
            setResult(data.result);
        } catch (error) {
            console.error(error);
            setLogs(prev => [...prev, "ERROR: CONNECTION_FAILED"]);
            alert('Analysis failed. Please try again.');
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
            </div>
        </Layout>
    );
};

export default Detection;
