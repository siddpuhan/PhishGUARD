import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, Users, ShieldCheck, AlertOctagon } from 'lucide-react';
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

    const COLORS = ['#ef4444', '#10b981'];

    if (loading) return <Layout><div className="flex justify-center items-center h-full text-cyan-500">Loading Analytics...</div></Layout>;

    const pieData = stats ? [
        { name: 'Phishing', value: stats.phishingCount },
        { name: 'Legitimate', value: stats.legitimateCount },
    ] : [];

    // Mock data for bar chart since backend doesn't provide monthly breakdown yet
    const barData = [
        { name: 'Jan', phishing: 4, safe: 20 },
        { name: 'Feb', phishing: 3, safe: 25 },
        { name: 'Mar', phishing: 8, safe: 22 },
        { name: 'Apr', phishing: 2, safe: 30 },
        { name: 'May', phishing: 5, safe: 28 },
    ];

    return (
        <Layout>
             <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Admin Analytics</h1>
                    <p className="text-muted-foreground">Deep insights into system performance and threat landscape.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Total Scans" 
                        value={stats?.totalScans || 0} 
                        icon={<Activity className="h-4 w-4 text-cyan-500" />}
                        desc="System-wide usage"
                    />
                     <StatCard 
                        title="Phishing Detected" 
                        value={stats?.phishingCount || 0} 
                        icon={<AlertOctagon className="h-4 w-4 text-red-500" />}
                        desc="Threats blocked"
                        className="border-red-500/30"
                    />
                     <StatCard 
                        title="Legitimate" 
                        value={stats?.legitimateCount || 0} 
                        icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
                        desc="Safe traffic"
                        className="border-emerald-500/30"
                    />
                     <StatCard 
                        title="Active Users" 
                        value="1" 
                        icon={<Users className="h-4 w-4 text-purple-500" />}
                        desc="Currently online"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle>Threat Distribution</CardTitle>
                            <CardDescription>Ratio of malicious vs safe content</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="h-[300px] w-full flex justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.5rem' }}
                                             itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle>Monthly Trends</CardTitle>
                             <CardDescription>Phishing attempts over time (Mock Data)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.5rem' }}
                                        />
                                        <Bar dataKey="phishing" name="Phishing" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                                        <Bar dataKey="safe" name="Safe" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                        <Legend />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

const StatCard = ({ title, value, icon, desc, className }) => (
    <Card className={`bg-slate-900/50 border-slate-800 ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-muted-foreground">{desc}</p>
        </CardContent>
    </Card>
);

export default Analytics;
