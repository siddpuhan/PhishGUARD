import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Shield, Mail, Globe, AlertTriangle, CheckCircle, ArrowRight, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Detection = () => {
    const [text, setText] = useState('');
    const [type, setType] = useState('url');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async (e) => {
        e.preventDefault();
        if (!text) return;
        setLoading(true);
        setResult(null);
        try {
            const { data } = await api.post('/scan/predict', { text, type });
            // Simulate a slight delay for animation effect if API is too fast
            await new Promise(resolve => setTimeout(resolve, 800)); 
            setResult(data.result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setResult(null);
        setText('');
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Threat Detection Engine</h1>
                    <p className="text-muted-foreground">Analyze suspicious URLs or email content using our advanced AI model.</p>
                </div>

                <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl overflow-hidden relative">
                    {/* Animated Border Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

                    <CardHeader>
                        <div className="flex justify-center space-x-4 mb-6">
                            <Button
                                variant={type === 'url' ? 'neon' : 'ghost'}
                                onClick={() => { setType('url'); setResult(null); }}
                                className={`w-32 transition-all duration-300 ${type === 'url' ? 'bg-cyan-500/10' : ''}`}
                            >
                                <Globe className="mr-2 h-4 w-4" />
                                URL
                            </Button>
                            <Button
                                variant={type === 'email' ? 'neon' : 'ghost'}
                                onClick={() => { setType('email'); setResult(null); }}
                                className={`w-32 transition-all duration-300 ${type === 'email' ? 'bg-cyan-500/10' : ''}`}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                            </Button>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <AnimatePresence mode="wait">
                            {!result ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleScan}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        {type === 'url' ? (
                                            <div className="relative group">
                                                <Globe className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                                                <Input
                                                    placeholder="https://example.com/login"
                                                    value={text}
                                                    onChange={(e) => setText(e.target.value)}
                                                    className="pl-12 h-14 text-lg bg-slate-950 border-slate-800"
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative group">
                                                <Textarea
                                                    placeholder="Paste email content here..."
                                                    value={text}
                                                    onChange={(e) => setText(e.target.value)}
                                                    className="min-h-[200px] text-lg bg-slate-950 border-slate-800 p-4"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full h-12 text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20"
                                        disabled={loading || !text}
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Analyzing Threat Vector...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Shield className="mr-2 h-5 w-5" />
                                                Run Analysis
                                            </div>
                                        )}
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-8"
                                >
                                    <div className={`flex flex-col items-center justify-center p-8 rounded-2xl border ${result.isPhishing ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            className={`rounded-full p-6 mb-4 ${result.isPhishing ? 'bg-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-emerald-500/20 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'}`}
                                        >
                                            {result.isPhishing ? <AlertTriangle className="h-16 w-16" /> : <CheckCircle className="h-16 w-16" />}
                                        </motion.div>
                                        
                                        <h2 className={`text-3xl font-bold mb-2 ${result.isPhishing ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {result.isPhishing ? 'Phishing Detected' : 'Legitimate Content'}
                                        </h2>
                                        
                                        <div className="flex items-center space-x-2 text-muted-foreground mb-6">
                                            <span className="font-mono text-sm uppercase tracking-wider">Confidence Score:</span>
                                            <span className={`text-xl font-bold ${result.isPhishing ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {(result.confidence * 100).toFixed(2)}%
                                            </span>
                                        </div>

                                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <Card className="bg-slate-950 border-slate-800">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                                                        <Info className="h-4 w-4 mr-2 text-cyan-500" />
                                                        Analysis Features
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                         {result.features.suspicious_keywords && result.features.suspicious_keywords.length > 0 ? (
                                                            <div>
                                                                <span className="text-xs text-muted-foreground block mb-1">Suspicious Keywords Found:</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {result.features.suspicious_keywords.map((kw, i) => (
                                                                        <Badge key={i} variant="destructive" className="uppercase text-[10px]">{kw}</Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center text-emerald-500 text-sm">
                                                                <CheckCircle className="h-3 w-3 mr-2" /> No suspicious keywords
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-slate-950 border-slate-800">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                                                        <Info className="h-4 w-4 mr-2 text-cyan-500" />
                                                        Technical Metadata
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-2 text-sm">
                                                     <div className="flex justify-between border-b border-slate-800 pb-1">
                                                        <span className="text-muted-foreground">Length:</span>
                                                        <span className="font-mono">{result.features.length} chars</span>
                                                    </div>
                                                    {type === 'url' && (
                                                        <>
                                                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                                                <span className="text-muted-foreground">HTTPS:</span>
                                                                <span className={result.features.has_https ? "text-emerald-500" : "text-red-500"}>
                                                                    {result.features.has_https ? "Yes" : "No"}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between pb-1">
                                                                <span className="text-muted-foreground">IP Address:</span>
                                                                <span className={result.features.has_ip ? "text-red-500" : "text-emerald-500"}>
                                                                    {result.features.has_ip ? "Detected" : "None"}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>

                                    <Button variant="outline" onClick={resetScan} className="w-full">
                                        Scan Another
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Detection;
