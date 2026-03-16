import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Search, Calendar, Link as LinkIcon, Mail, ChevronDown, ChevronUp, Terminal, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
                                    <motion.div 
                                        variants={item}
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
            </div>
        </Layout>
    );
};

export default History;
