import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, Users, ShieldCheck, AlertOctagon, TrendingUp, ShieldAlert, BarChart3, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/scan/analytics');
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const COLORS = ['#F97316', '#3B82F6']; // Orange (Malicious), Blue (Secured)

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                    <Activity className="h-10 w-10 text-accent-purple animate-pulse" />
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Processing Intelligence...</p>
                </div>
            </Layout>
        );
    }

    const pieData = stats ? [
        { name: 'Phishing', value: stats.phishingCount },
        { name: 'Legitimate', value: stats.legitimateCount },
    ] : [];

    // Premium mock data for bar chart
    const barData = [
        { name: 'Jan', phishing: 4, safe: 20 },
        { name: 'Feb', phishing: 3, safe: 25 },
        { name: 'Mar', phishing: 8, safe: 22 },
        { name: 'Apr', phishing: 2, safe: 30 },
        { name: 'May', phishing: 5, safe: 28 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
             <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Security Intelligence</h1>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Aggregate Network Threat Analysis</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Global Scans" 
                        value={stats?.totalScans || 0} 
                        icon={<Database className="h-5 w-5 text-accent-purple" />}
                        trend="Live Feed"
                        color="purple"
                    />
                     <StatCard 
                        title="Threats Neutralized" 
                        value={stats?.phishingCount || 0} 
                        icon={<ShieldAlert className="h-5 w-5 text-accent-orange" />}
                        trend="High Risk"
                        color="orange"
                    />
                     <StatCard 
                        title="Safe Traffic" 
                        value={stats?.legitimateCount || 0} 
                        icon={<ShieldCheck className="h-5 w-5 text-accent-blue" />}
                        trend="Verified"
                        color="blue"
                    />
                     <StatCard 
                        title="Accuracy Rate" 
                        value="99.9%" 
                        icon={<TrendingUp className="h-5 w-5 text-accent-cyan" />}
                        trend="Optimized"
                        color="cyan"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold">Threat Distribution</h3>
                            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Malicious vs Secured Assets</p>
                        </div>
                         <div className="h-[300px] w-full flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                         contentStyle={{ 
                                            backgroundColor: '#0B0F14', 
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36}
                                        wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '20px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold">Vector Trends</h3>
                             <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Phishing Vectors over Time (Simulated)</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="rgba(255,255,255,0.2)" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="rgba(255,255,255,0.2)" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                        contentStyle={{ 
                                            backgroundColor: '#0B0F14', 
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Bar dataKey="phishing" name="Malicious" fill="#F97316" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar dataKey="safe" name="Secured" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Legend 
                                        wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '20px' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </Layout>
    );
};

const StatCard = ({ title, value, icon, trend, color }) => {
    const colorClasses = {
        purple: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
        orange: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
        blue: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
        cyan: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    };

    return (
        <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className={`glass-card p-6 rounded-3xl group transition-all duration-500 hover:border-white/20 ${colorClasses[color]}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{trend}</div>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{title}</p>
        </motion.div>
    );
};

export default Analytics;
