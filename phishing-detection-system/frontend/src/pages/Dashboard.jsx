import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { Activity, ShieldAlert, CheckCircle, Search, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

    const data = [
        { name: 'MON', scans: 4 },
        { name: 'TUE', scans: 3 },
        { name: 'WED', scans: 2 },
        { name: 'THU', scans: 7 },
        { name: 'FRI', scans: 5 },
        { name: 'SAT', scans: 10 },
        { name: 'SUN', scans: 6 },
    ];

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
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
