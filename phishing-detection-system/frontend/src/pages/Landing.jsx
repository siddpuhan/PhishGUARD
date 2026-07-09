<<<<<<< Updated upstream
import { Nav } from "../components/LandingPage/Nav";
import { Hero } from "../components/LandingPage/Hero";
import { ProductPreview } from "../components/LandingPage/ProductPreview";
import { HowItWorks } from "../components/LandingPage/HowItWorks";
import { WhyItWorks } from "../components/LandingPage/WhyItWorks";
import { GithubSection } from "../components/LandingPage/GithubSection";
import { Footer } from "../components/LandingPage/Footer";
import { CursorGlow } from "../components/LandingPage/CursorGlow";

export function Landing() {
  return (
    <div
      id="top"
      className="relative flex min-h-dvh flex-col bg-forest-950 text-fg"
      style={{ backgroundColor: "hsl(122 40% 7%)", color: "hsl(78 18% 90%)" }}
    >
      {/* Floating cursor + reactive background shine */}
      <CursorGlow />
      <Nav />
      <main className="relative z-10 flex-1">
        <Hero />
        <ProductPreview />
        <HowItWorks />
        <WhyItWorks />
        <GithubSection />
      </main>
      <Footer />
    </div>
  );
}
=======
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Shield, Search, Mail, History, Globe, Lock, Activity, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    return (
        <div className="min-h-screen bg-background text-foreground cyber-grid">
            {/* Navbar */}
            <nav className="fixed w-full z-50 border-b border-cyan-500/10 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-cyan-500" />
                        <span className="text-xl font-bold tracking-tight uppercase italic">AI Phishing Detector</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="btn-cyber text-sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-48 pb-20 relative px-6 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full -z-10" />
                
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                            AI-Powered Phishing <br />
                            <span className="text-cyan-500">Detection in Real Time</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
                            Scan URLs, emails, and messages instantly using machine learning. Identify malicious vectors before they compromise your data.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button className="h-14 px-10 btn-cyber text-lg group">
                                    Start Scanning
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Button variant="outline" className="h-14 px-10 btn-outline text-lg">
                                View Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-32 border-y border-cyan-500/5 bg-slate-950/20">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold tracking-tight">Technical Threat Intelligence</h2>
                        <div className="h-1 w-20 bg-cyan-500" />
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Phishing accounts for over 90% of data breaches. Traditional blacklist-based detection fails against zero-day attacks. Our engine uses neural linguistic analysis to catch threats that simple filters miss.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <CheckCircle className="h-6 w-6 text-cyan-500 shrink-0" />
                                <div>
                                    <p className="font-bold text-white">Heuristic Metadata Analysis</p>
                                    <p className="text-sm text-slate-500">Scrutinizing technical headers and URL construction.</p>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <CheckCircle className="h-6 w-6 text-cyan-500 shrink-0" />
                                <div>
                                    <p className="font-bold text-white">Real-time Inference</p>
                                    <p className="text-sm text-slate-500">Sub-second response times using optimized ML pipelines.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="relative">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 rounded-2xl relative z-10"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-cyan-500/10">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Threat_Analyzer_v2.0</span>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Target URL</div>
                                    <div className="bg-slate-950 p-3 rounded border border-cyan-500/20 font-mono text-xs text-slate-400">
                                        https://secure-verify-auth.net/login/chase
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-24 h-24 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                                                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="264" strokeDashoffset="40" className="text-red-500" />
                                            </svg>
                                            <span className="absolute text-xl font-bold text-red-500">85%</span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">Risk Factor</span>
                                    </div>

                                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center flex-1 ml-8">
                                        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                        <div className="text-xs font-bold text-red-500 uppercase tracking-widest">MALICIOUS DETECTED</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <div className="absolute -inset-4 bg-cyan-500/5 blur-3xl rounded-full -z-10" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold tracking-tight mb-4 uppercase">Product Capabilities</h2>
                        <div className="h-1 w-12 bg-cyan-500 mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Globe className="h-8 w-8 text-cyan-500" />}
                            title="URL Detection"
                            desc="Deep heuristic analysis of URLs to identify character spoofing and hidden redirects."
                        />
                        <FeatureCard 
                            icon={<Mail className="h-8 w-8 text-cyan-500" />}
                            title="Content Analysis"
                            desc="Machine learning models analyze linguistic patterns for urgency and suspicious requests."
                        />
                        <FeatureCard 
                            icon={<History className="h-8 w-8 text-cyan-500" />}
                            title="History & Analytics"
                            desc="Comprehensive logging and trend analysis of scanned vectors over time."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-cyan-500/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Shield className="h-4 w-4 text-cyan-500" />
                        <span className="font-bold text-white tracking-widest uppercase">AI Phishing Detector</span>
                    </div>
                    <p>&copy; 2024. All technical assets protected.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card p-10 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="mb-6 p-4 bg-cyan-500/5 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
);
>>>>>>> Stashed changes

export default Landing;
