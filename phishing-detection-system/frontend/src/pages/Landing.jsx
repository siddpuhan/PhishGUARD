import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Shield, Lock, Zap, ChevronRight, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Shield className="h-8 w-8 text-cyan-500" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                            PhishGuard AI
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-gray-300 hover:text-white">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white border-0 shadow-lg shadow-cyan-500/20">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/20 rounded-[100%] blur-[100px] opacity-50 pointer-events-none" />
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                            Next-Gen Cybersecurity
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                            Detect Phishing with <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">
                                Artificial Intelligence
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Protect your organization from sophisticated phishing attacks. Our advanced ML models analyze URLs and email content in real-time.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="h-14 px-8 text-lg bg-cyan-600 hover:bg-cyan-700 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                    Start Free Scan <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/10">
                                    Live Demo
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Zap className="h-10 w-10 text-yellow-400" />}
                            title="Real-time Analysis"
                            desc="Instant threat detection using our optimized machine learning pipeline."
                        />
                        <FeatureCard 
                            icon={<Lock className="h-10 w-10 text-emerald-400" />}
                            title="Enterprise Security"
                            desc="Bank-grade encryption and secure infrastructure for your data."
                        />
                        <FeatureCard 
                            icon={<Activity className="h-10 w-10 text-purple-400" />}
                            title="Advanced Heuristics"
                            desc="Beyond simple blacklists. We analyze linguistic patterns and metadata."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/10 text-center text-gray-500">
                <p>&copy; 2024 PhishGuard AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
    >
        <div className="mb-6 p-4 bg-white/5 rounded-xl inline-block">{icon}</div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
);

export default Landing;
