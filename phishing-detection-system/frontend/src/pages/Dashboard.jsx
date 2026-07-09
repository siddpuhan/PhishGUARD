import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
<<<<<<< Updated upstream
import { Activity, ShieldAlert, CheckCircle, Search, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
=======
import { Search, ShieldAlert, ShieldCheck, Database, TrendingUp, AlertTriangle } from 'lucide-react';
>>>>>>> Stashed changes
import { motion } from 'framer-motion';

const StatPanel = ({ title, value, subtext, icon: Icon, colorClass, delay }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value) || 0;
        if (end === 0) return;

        const duration = 2000;
        const increment = end / (duration / 16); 

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="border-l-2 border-[#333] pl-6 py-2 bg-[#0a0a0a] relative group hover:bg-[#111] transition-colors"
        >
            <div className={`absolute left-[-2px] top-0 bottom-0 w-0.5 ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_currentColor]`} />
            
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">{title}</h3>
                <Icon className={`h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <div className="text-5xl font-display text-white mb-2 leading-none">
                {typeof value === 'number' ? count : value}
            </div>
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">
                {subtext}
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ total: 0, phishing: 0, legitimate: 0 });
    const [recentScans, setRecentScans] = useState([]);
    const [loading, setLoading] = useState(true);

<<<<<<< Updated upstream
    const data = [
        { name: 'MON', scans: 4 },
        { name: 'TUE', scans: 3 },
        { name: 'WED', scans: 2 },
        { name: 'THU', scans: 7 },
        { name: 'FRI', scans: 5 },
        { name: 'SAT', scans: 10 },
        { name: 'SUN', scans: 6 },
    ];

=======
>>>>>>> Stashed changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: history } = await api.get('/scan/history');
                const total = history.length;
                const phishing = history.filter(h => h.result.isPhishing).length;
                const legitimate = total - phishing;
                setStats({ total, phishing, legitimate });
                setRecentScans(history.slice(0, 5));
            } catch (error) {
                console.error("Dashboard data sync failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

<<<<<<< Updated upstream
    return (
        <Layout>
            <div className="space-y-12">
                <div className="border-b border-[#333] pb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-6xl font-display text-white mb-1 leading-none">COMMAND CENTER</h1>
                        <p className="text-xs font-mono text-lime-400 uppercase tracking-[0.2em]">
                             Welcome back, Operator {user?.username}
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                         <div className="text-[10px] text-gray-600 font-mono mb-1">SYSTEM STATUS</div>
                         <div className="flex items-center justify-end space-x-2">
                            <div className="h-2 w-2 bg-lime-500 animate-pulse"></div>
                            <span className="text-lime-500 font-mono text-xs font-bold tracking-widest">OPERATIONAL</span>
                         </div>
                    </div>
                </div>

                {/* Stats Grid - Bloomberg Terminal Style */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <StatPanel 
                        title="TOTAL_SCANS" 
                        value={stats.total} 
                        subtext="+20.1% INCREASE" 
                        icon={Search} 
                        colorClass="bg-cyan-500" 
                        delay={0.1}
                    />
                    <StatPanel 
                        title="THREATS_BLOCKED" 
                        value={stats.phishing} 
                        subtext="HIGH SEVERITY" 
                        icon={ShieldAlert} 
                        colorClass="bg-red-500" 
                        delay={0.2}
                    />
                    <StatPanel 
                        title="VERIFIED_SAFE" 
                        value={stats.legitimate} 
                        subtext="CLEAN TRAFFIC" 
                        icon={CheckCircle} 
                        colorClass="bg-emerald-500" 
                        delay={0.3}
                    />
                    <StatPanel 
                        title="RISK_INDEX" 
                        value={stats.total > 0 ? ((stats.phishing / stats.total) * 10).toFixed(1) : "0.0"} 
                        subtext="LEVEL: MODERATE" 
                        icon={Activity} 
                        colorClass="bg-lime-400" 
                        delay={0.4}
                    />
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Activity Graph */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="col-span-2 border border-[#333] bg-[#0a0a0a] p-6 relative"
                    >
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-lime-500"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-lime-500"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-lime-500"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-lime-500"></div>

                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-mono text-white uppercase tracking-widest flex items-center">
                                <Activity className="h-4 w-4 text-lime-400 mr-2" />
                                THREAT_ACTIVITY_LOG
                            </h3>
                            <div className="flex space-x-2">
                                {['1H', '24H', '7D', '30D'].map(range => (
                                    <button key={range} className={`text-[10px] font-mono px-2 py-1 border border-[#333] hover:border-lime-500 hover:text-lime-500 transition-colors ${range === '7D' ? 'bg-lime-400/10 text-lime-400 border-lime-500' : 'text-gray-500'}`}>
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a3e635" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#4b5563" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        fontFamily="monospace"
                                    />
                                    <YAxis 
                                        stroke="#4b5563" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        fontFamily="monospace"
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#a3e635', fontFamily: 'monospace', fontSize: '12px' }}
                                        itemStyle={{ color: '#a3e635' }}
                                        cursor={{ stroke: '#a3e635', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="scans" 
                                        stroke="#a3e635" 
                                        strokeWidth={2} 
                                        fillOpacity={1} 
                                        fill="url(#colorScans)" 
                                        activeDot={{ r: 4, strokeWidth: 0, fill: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Recent Scans Feed */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="border border-[#333] bg-[#0a0a0a] p-0"
                    >
                         <div className="p-4 border-b border-[#333] bg-[#0f0f0f] flex justify-between items-center">
                            <h3 className="text-sm font-mono text-white uppercase tracking-widest flex items-center">
                                <Terminal className="h-4 w-4 text-lime-400 mr-2" />
                                LIVE_FEED
                            </h3>
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                        </div>
                        
                        <div className="divide-y divide-[#222] max-h-[380px] overflow-auto scrollbar-thin scrollbar-thumb-[#333]">
                            {recentScans.length === 0 ? (
                                <div className="p-8 text-center text-gray-600 font-mono text-xs">NO_DATA_AVAILABLE</div>
                            ) : (
                                recentScans.map((scan, i) => (
                                    <div key={i} className="p-4 hover:bg-[#111] transition-colors group cursor-default">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`text-[10px] font-bold uppercase px-1.5 py-0.5 border ${scan.result.isPhishing ? 'text-red-500 border-red-900 bg-red-900/10' : 'text-emerald-500 border-emerald-900 bg-emerald-900/10'}`}>
                                                {scan.result.isPhishing ? 'CRITICAL' : 'CLEAN'}
                                            </div>
                                            <span className="text-[10px] text-gray-600 font-mono">
                                                {new Date(scan.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className="font-mono text-xs text-gray-300 truncate mb-1 group-hover:text-lime-400 transition-colors">
                                            {scan.content}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500 uppercase">{scan.inputType}</span>
                                            <span className={`text-[10px] font-mono ${scan.result.isPhishing ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {(scan.result.confidence * 100).toFixed(1)}% CONF
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
=======
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Database Assets" 
                        value={stats.total} 
                        icon={<Database className="h-5 w-5 text-cyan-500" />}
                        status="Live Sync"
                    />
                    <StatCard 
                        title="Critical Threats" 
                        value={stats.phishing} 
                        icon={<ShieldAlert className="h-5 w-5 text-red-500" />}
                        status="Isolated"
                    />
                    <StatCard 
                        title="Verified Assets" 
                        value={stats.legitimate} 
                        icon={<ShieldCheck className="h-5 w-5 text-green-500" />}
                        status="Safe"
                    />
                    <StatCard 
                        title="System Risk" 
                        value={`${stats.total > 0 ? ((stats.phishing / stats.total) * 100).toFixed(1) : 0}%`} 
                        icon={<TrendingUp className="h-5 w-5 text-yellow-500" />}
                        status="Calculated"
                    />
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Recent Vector Logs */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-500">Recent Vector Logs</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time scan history</p>
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-cyan-500/5">
                                    <tr>
                                        <th className="pb-4">Source Type</th>
                                        <th className="pb-4">Payload Content</th>
                                        <th className="pb-4 text-right">Classification</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {recentScans.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="py-10 text-center text-slate-600 uppercase font-bold tracking-widest">No vectors logged</td>
                                        </tr>
                                    ) : (
                                        recentScans.map((scan, i) => (
                                            <tr key={i} className="border-b border-cyan-500/5 hover:bg-cyan-500/[0.02] transition-colors">
                                                <td className="py-4 font-bold text-cyan-500/60 uppercase">{scan.inputType}</td>
                                                <td className="py-4 font-mono text-slate-400 truncate max-w-[300px]">{scan.content}</td>
                                                <td className="py-4 text-right">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                        scan.result.isPhishing ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    }`}>
                                                        {scan.result.isPhishing ? 'Malicious' : 'Clean'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Quick Analysis Info */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="glass-card rounded-2xl p-8 border-l-4 border-l-cyan-500">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 mb-4">Inference Summary</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-bold uppercase">System Uptime</span>
                                    <span className="text-white font-bold">99.98%</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-bold uppercase">Avg Response</span>
                                    <span className="text-white font-bold">142ms</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-bold uppercase">Threat Coverage</span>
                                    <span className="text-white font-bold">Full Spectrum</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-8 border-l-4 border-l-red-500">
                            <div className="flex items-center space-x-3 mb-4">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500">Critical Alert</h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Ensure all URL redirects are scrutinized. Zero-day obfuscation techniques detected in recent network vectors.
                            </p>
>>>>>>> Stashed changes
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

const StatCard = ({ title, value, icon, status }) => (
    <motion.div 
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        className="glass-card p-6 rounded-2xl group transition-all duration-300 hover:border-cyan-500/20"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-950 rounded border border-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
                {icon}
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{status}</div>
        </div>
        <div className="text-3xl font-extrabold tracking-tight mb-1 text-white">{value}</div>
        <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-widest">{title}</p>
    </motion.div>
);

export default Dashboard;
