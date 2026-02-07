import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ShieldAlert, CheckCircle, Search, Calendar, Link as LinkIcon, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Scan History</h1>
                    <p className="text-muted-foreground">Detailed log of all your previous threat analyses.</p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Search className="mr-2 h-5 w-5 text-cyan-500" />
                            Recent Scans
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-10 text-muted-foreground">Loading history...</div>
                        ) : scans.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">No scans found. Start by scanning a URL!</div>
                        ) : (
                            <motion.div 
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="space-y-4"
                            >
                                {scans.map((scan) => (
                                    <motion.div 
                                        key={scan._id}
                                        variants={item}
                                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors"
                                    >
                                        <div className="flex items-start space-x-4 mb-4 md:mb-0 w-full md:w-auto overflow-hidden">
                                            <div className={`p-3 rounded-full shrink-0 ${scan.result.isPhishing ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {scan.result.isPhishing ? <ShieldAlert className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400 capitalize">
                                                        {scan.inputType === 'url' ? <LinkIcon className="h-3 w-3 mr-1" /> : <Mail className="h-3 w-3 mr-1" />}
                                                        {scan.inputType}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {new Date(scan.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-white truncate max-w-md" title={scan.content}>
                                                    {scan.content}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Confidence</p>
                                                <p className={`font-bold ${scan.result.isPhishing ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {(scan.result.confidence * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                            <Badge className={`px-3 py-1 ${scan.result.isPhishing ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}>
                                                {scan.result.isPhishing ? 'Phishing' : 'Safe'}
                                            </Badge>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default History;
