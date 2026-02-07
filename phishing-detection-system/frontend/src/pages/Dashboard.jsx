import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, ShieldAlert, CheckCircle, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ total: 0, phishing: 0, legitimate: 0 });
    const [recentScans, setRecentScans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for the chart since we don't have a real time-series API yet
    const data = [
        { name: 'Mon', scans: 4 },
        { name: 'Tue', scans: 3 },
        { name: 'Wed', scans: 2 },
        { name: 'Thu', scans: 7 },
        { name: 'Fri', scans: 5 },
        { name: 'Sat', scans: 10 },
        { name: 'Sun', scans: 6 },
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
                className="space-y-6"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your security scans and threat detection.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div variants={itemVariants}>
                        <Card className="border-t-4 border-t-cyan-500 bg-slate-900/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                                <Search className="h-4 w-4 text-cyan-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stats.total}</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="border-t-4 border-t-red-500 bg-slate-900/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Phishing Detected</CardTitle>
                                <ShieldAlert className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stats.phishing}</div>
                                <p className="text-xs text-muted-foreground">High Risk</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                     <motion.div variants={itemVariants}>
                        <Card className="border-t-4 border-t-emerald-500 bg-slate-900/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Safe URLs</CardTitle>
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stats.legitimate}</div>
                                <p className="text-xs text-muted-foreground">Verified Safe</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="border-t-4 border-t-purple-500 bg-slate-900/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                                <Activity className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">
                                    {stats.total > 0 ? ((stats.phishing / stats.total) * 100).toFixed(1) : 0}%
                                </div>
                                <p className="text-xs text-muted-foreground">Threat Level</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <motion.div variants={itemVariants} className="col-span-4">
                        <Card className="h-full bg-slate-900/50">
                            <CardHeader>
                                <CardTitle>Scan Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data}>
                                            <defs>
                                                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                                itemStyle={{ color: '#06b6d4' }}
                                            />
                                            <Area type="monotone" dataKey="scans" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-3">
                         <Card className="h-full bg-slate-900/50">
                            <CardHeader>
                                <CardTitle>Recent Scans</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentScans.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">No recent scans.</p>
                                    ) : (
                                        recentScans.map((scan, i) => (
                                            <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                                                <div className="flex items-center space-x-3 overflow-hidden">
                                                    <div className={`p-2 rounded-full ${scan.result.isPhishing ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                        {scan.result.isPhishing ? <ShieldAlert className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-sm font-medium text-white truncate max-w-[150px]">{scan.content}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">{scan.inputType}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={scan.result.isPhishing ? 'danger' : 'success'}>
                                                    {scan.result.isPhishing ? 'Phishing' : 'Safe'}
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </Layout>
    );
};

export default Dashboard;
