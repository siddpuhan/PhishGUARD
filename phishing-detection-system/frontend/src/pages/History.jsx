import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
<<<<<<< Updated upstream
import { Search, Calendar, Link as LinkIcon, Mail, ChevronDown, ChevronUp, Terminal, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
=======
import { Badge } from '../components/ui/badge';
import { ShieldAlert, CheckCircle, Search, Calendar, Link as LinkIcon, Mail, ShieldCheck, Clock, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
>>>>>>> Stashed changes

const History = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/scan/history');
                setScans(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const filteredScans = scans.filter(scan => {
        if (filter === 'all') return true;
        if (filter === 'phishing') return scan.result.isPhishing;
        if (filter === 'clean') return !scan.result.isPhishing;
        return true;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
<<<<<<< Updated upstream
            <div className="space-y-8">
                <div className="border-b border-[#333] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-5xl font-display text-white mb-2">SCAN_LOGS</h1>
                        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                            Historical archive of threat analysis vectors
                        </p>
                    </div>
                    
                    {/* Filter Bar */}
                    <div className="flex space-x-2">
                        {['all', 'phishing', 'clean'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-all duration-200 ${filter === f ? 'bg-lime-400 text-black border-lime-400 font-bold' : 'bg-transparent text-gray-500 border-[#333] hover:border-gray-500'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-[#333] min-h-[500px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#333] bg-[#0f0f0f] text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        <div className="col-span-1">STATUS</div>
                        <div className="col-span-2">TIMESTAMP</div>
                        <div className="col-span-1">TYPE</div>
                        <div className="col-span-6">TARGET_PAYLOAD</div>
                        <div className="col-span-1 text-right">SCORE</div>
                        <div className="col-span-1 text-right">ACTION</div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center font-mono text-gray-600 animate-pulse">LOADING_DATA_STREAMS...</div>
                    ) : filteredScans.length === 0 ? (
                        <div className="p-12 text-center font-mono text-gray-600">NO_RECORDS_FOUND</div>
                    ) : (
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="divide-y divide-[#1a1a1a]"
                        >
                            {filteredScans.map((scan) => (
                                <React.Fragment key={scan._id}>
=======
            <div className="space-y-8 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Security Archives</h1>
                        <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Immutable Log of Neural Threat Analyses</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="glass-card rounded-xl text-[10px] font-bold uppercase tracking-widest px-4">
                            <Filter className="w-3 h-3 mr-2" /> Filter
                        </Button>
                        <Button variant="ghost" size="sm" className="glass-card rounded-xl text-[10px] font-bold uppercase tracking-widest px-4">
                            <Download className="w-3 h-3 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                <div className="glass-card rounded-[32px] overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-white/60">Historical Data</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{scans.length} Total Records</span>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-white/20">
                                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Decrypting Logs...</p>
                            </div>
                        ) : scans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-white/10">
                                <Search className="h-16 w-16 mb-4 opacity-10" />
                                <p className="text-sm font-medium">Archive empty. No threat analyses performed yet.</p>
                            </div>
                        ) : (
                            <motion.div 
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="space-y-3"
                            >
                                {scans.map((scan) => (
>>>>>>> Stashed changes
                                    <motion.div 
                                        variants={item}
<<<<<<< Updated upstream
                                        onClick={() => toggleRow(scan._id)}
                                        className={`grid grid-cols-12 gap-4 p-4 items-center cursor-pointer transition-colors duration-200 group relative ${expandedRow === scan._id ? 'bg-[#111]' : 'hover:bg-[#111]'}`}
                                    >
                                        {/* Active Row Indicator */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 ${expandedRow === scan._id ? 'bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.4)]' : 'bg-transparent group-hover:bg-lime-400/50'}`} />

                                        <div className="col-span-1">
                                            <div className={`inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase border ${scan.result.isPhishing ? 'text-red-500 border-red-900 bg-red-900/10' : 'text-emerald-500 border-emerald-900 bg-emerald-900/10'}`}>
                                                {scan.result.isPhishing ? 'CRITICAL' : 'CLEAN'}
                                            </div>
                                        </div>
                                        <div className="col-span-2 font-mono text-xs text-gray-400">
                                            {new Date(scan.createdAt).toLocaleDateString()} <span className="text-[#333]">|</span> {new Date(scan.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="col-span-1">
                                            {scan.inputType === 'url' ? (
                                                <LinkIcon className="h-4 w-4 text-gray-600" />
                                            ) : (
                                                <Mail className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                        <div className="col-span-6 font-mono text-sm text-gray-300 truncate pr-4 group-hover:text-lime-400 transition-colors">
                                            {scan.content}
                                        </div>
                                        <div className="col-span-1 text-right font-mono text-xs">
                                            <span className={scan.result.isPhishing ? 'text-red-500' : 'text-emerald-500'}>
                                                {(scan.result.confidence * 10).toFixed(1)}
                                            </span>
                                            <span className="text-gray-600">/10</span>
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            {expandedRow === scan._id ? (
                                                <ChevronUp className="h-4 w-4 text-lime-400" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-gray-600 group-hover:text-white" />
                                            )}
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {expandedRow === scan._id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-[#050505] border-b border-[#333]"
                                            >
                                                <div className="p-6 grid md:grid-cols-2 gap-8 font-mono text-xs">
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                                                            <Terminal className="h-3 w-3 mr-2" />
                                                            ANALYSIS_OUTPUT
                                                        </div>
                                                        <div className="space-y-2 text-gray-400">
                                                            <div className="flex justify-between border-b border-[#222] pb-1">
                                                                <span>SCAN_ID</span>
                                                                <span className="text-white">{scan._id}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b border-[#222] pb-1">
                                                                <span>TARGET_TYPE</span>
                                                                <span className="uppercase text-white">{scan.inputType}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b border-[#222] pb-1">
                                                                <span>THREAT_LEVEL</span>
                                                                <span className={scan.result.isPhishing ? 'text-red-500' : 'text-emerald-500'}>
                                                                    {scan.result.isPhishing ? 'HIGH_CRITICALITY' : 'NEGLIGIBLE'}
                                                                </span>
                                                            </div>
                                                            <div className="pt-2">
                                                                <span className="block mb-1 text-gray-500">FULL_PAYLOAD:</span>
                                                                <div className="bg-[#111] p-2 border border-[#333] text-gray-300 break-all">
                                                                    {scan.content}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                                                            HEURISTIC_DETAILS
                                                        </div>
                                                        <div className="space-y-2">
                                                            {scan.result.features.suspicious_keywords?.length > 0 ? (
                                                                scan.result.features.suspicious_keywords.map((kw, i) => (
                                                                    <div key={i} className="flex items-center text-red-400 bg-red-900/5 border border-red-900/20 p-2">
                                                                        <AlertTriangle className="h-3 w-3 mr-2" />
                                                                        DETECTED_KEYWORD: "{kw.toUpperCase()}"
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="flex items-center text-emerald-500 bg-emerald-900/5 border border-emerald-900/20 p-2">
                                                                    <CheckCircle className="h-3 w-3 mr-2" />
                                                                    NO_SUSPICIOUS_SIGNATURES_DETECTED
                                                                </div>
                                                            )}
                                                            
                                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                                <div className="bg-[#111] p-2 border border-[#333]">
                                                                    <div className="text-gray-500 mb-1">PAYLOAD_LENGTH</div>
                                                                    <div className="text-white">{scan.result.features.length} BYTES</div>
                                                                </div>
                                                                {scan.inputType === 'url' && (
                                                                    <div className="bg-[#111] p-2 border border-[#333]">
                                                                        <div className="text-gray-500 mb-1">SSL_VERIFICATION</div>
                                                                        <div className={scan.result.features.has_https ? 'text-emerald-500' : 'text-red-500'}>
                                                                            {scan.result.features.has_https ? 'SECURE (HTTPS)' : 'INSECURE (HTTP)'}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </motion.div>
                    )}
                </div>
                
                {/* Pagination (Visual only for now as API handles all) */}
                {!loading && filteredScans.length > 0 && (
                    <div className="flex justify-end space-x-2">
                        <button className="h-8 w-8 flex items-center justify-center border border-[#333] text-gray-500 hover:border-lime-400 hover:text-lime-400 transition-colors">
                            {'<'}
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center bg-lime-400 text-black font-bold border border-lime-400">
                            1
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center border border-[#333] text-gray-500 hover:border-lime-400 hover:text-lime-400 transition-colors">
                            {'>'}
                        </button>
                    </div>
                )}
=======
                                        className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                                    >
                                        <div className="flex items-start space-x-4 mb-4 md:mb-0 w-full md:w-auto">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                scan.result.isPhishing 
                                                ? 'bg-accent-orange/10 text-accent-orange border border-accent-orange/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                                                : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                            }`}>
                                                {scan.result.isPhishing ? <ShieldAlert className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                                            </div>
                                            
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <Badge className="bg-white/5 border-white/10 text-[9px] uppercase font-bold text-white/40 tracking-widest px-2 py-0.5">
                                                        {scan.inputType === 'url' ? <LinkIcon className="h-2 w-2 mr-1" /> : <Mail className="h-2 w-2 mr-1" />}
                                                        {scan.inputType}
                                                    </Badge>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center">
                                                        <Clock className="h-2.5 w-2.5 mr-1" />
                                                        {new Date(scan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors truncate max-w-md">
                                                    {scan.content}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                                            <div className="text-left md:text-right">
                                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-0.5">Confidence</p>
                                                <p className={`text-lg font-bold tracking-tighter ${scan.result.isPhishing ? 'text-accent-orange' : 'text-accent-blue'}`}>
                                                    {(scan.result.confidence * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl border font-bold text-[10px] uppercase tracking-widest ${
                                                scan.result.isPhishing 
                                                ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20' 
                                                : 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
                                            }`}>
                                                {scan.result.isPhishing ? 'Malicious' : 'Secured'}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
>>>>>>> Stashed changes
            </div>
        </Layout>
    );
};

const Loader2 = ({ className }) => (
    <svg 
        className={className} 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default History;
