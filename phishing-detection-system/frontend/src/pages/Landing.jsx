import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Lock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import CircuitShield from '../components/CircuitShield';
import CounterStat from '../components/CounterStat';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#121212] text-white selection:bg-lime-400/20 relative overflow-hidden">
            {/* Scan-line Effect */}
            <div className="scanline"></div>

            {/* Noise Grain - handled by body::before in CSS */}

            {/* Navbar - Minimal & Monospace */}
            <nav className="fixed w-full z-50 bg-[#0f0f0f]/90 backdrop-blur-sm border-b border-lime-400/20">
                <div className="container mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <Shield className="h-7 w-7 text-lime-400" strokeWidth={1.5} />
                            <div className="absolute inset-0 bg-lime-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <span className="text-lg font-mono font-medium tracking-wider">
                            PHISHGUARD
                        </span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-8 font-mono text-xs uppercase tracking-[0.15em]">
                        <a href="#features" className="text-gray-400 hover:text-lime-400 transition-colors">
                            Features
                        </a>
                        <a href="#stats" className="text-gray-400 hover:text-lime-400 transition-colors">
                            Statistics
                        </a>
                        <a href="#demo" className="text-gray-400 hover:text-lime-400 transition-colors">
                            Demo
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <button className="hidden md:block font-mono text-xs uppercase tracking-wider text-gray-400 hover:text-lime-400 transition-colors px-4 py-2">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="btn-sharp">
                                Start Scan
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Grid-Breaking Editorial Layout */}
            <section className="relative pt-32 md:pt-40 pb-20 overflow-hidden grid-lines">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
                        {/* Left: Oversized Typography */}
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {/* Decorative Number */}
                                <div className="absolute -left-4 md:-left-8 -top-12 text-[180px] md:text-[240px] font-display leading-none text-lime-400/10 select-none pointer-events-none">
                                    01
                                </div>

                                {/* Badge */}
                                <div className="inline-flex items-center space-x-2 mb-8 border border-lime-400/30 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-lime-400 animate-fade-in-1">
                                    <div className="w-2 h-2 bg-lime-400 animate-pulse"></div>
                                    <span>Next-Gen Protection</span>
                                </div>

                                {/* Main Headline - Editorial Style */}
                                <h1 className="relative z-10 animate-fade-in-2">
                                    <div className="text-6xl md:text-8xl lg:text-9xl font-display leading-[0.9] tracking-tight mb-6">
                                        <span className="block text-white">CYBERSECURITY</span>
                                        <span className="block neon-text">MADE EASIER</span>
                                    </div>
                                </h1>

                                {/* Decorative Rule */}
                                <div className="w-32 h-[2px] bg-lime-400 mb-8 animate-fade-in-3"></div>

                                {/* Body Copy */}
                                <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-xl font-light animate-fade-in-3">
                                    Advanced AI-powered phishing detection that analyzes threats in real-time. 
                                    Protect your organization with military-grade security infrastructure.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-4">
                                    <Link to="/register">
                                        <button className="group relative px-8 py-4 bg-lime-400 text-black font-mono text-sm uppercase tracking-[0.15em] font-medium overflow-hidden transition-all hover:neon-glow-strong">
                                            <span className="relative z-10 flex items-center justify-center">
                                                Deploy Now
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </button>
                                    </Link>
                                    <Link to="/login">
                                        <button className="px-8 py-4 border-2 border-lime-400/30 text-lime-400 font-mono text-sm uppercase tracking-[0.15em] font-medium hover:bg-lime-400/10 transition-colors">
                                            Live Demo
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Abstract Circuit Illustration */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="relative h-[500px] md:h-[600px] animate-fade-in-2"
                        >
                            <div className="absolute inset-0 border-2 border-lime-400/20 data-stream">
                                <CircuitShield />
                            </div>
                            {/* Corner Decorations */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-lime-400"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-lime-400"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-lime-400"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-lime-400"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Oversized Typography Cards */}
            <section id="stats" className="py-32 bg-[#0a0a0a] border-y border-lime-400/20">
                <div className="container mx-auto px-6 md:px-12">
                    {/* Section Header */}
                    <div className="mb-16">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-[1px] bg-lime-400"></div>
                            <span className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">
                                By The Numbers
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-display text-white">
                            THREAT INTELLIGENCE
                        </h2>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <CounterStat 
                            end={4000}
                            suffix="+"
                            label="Threats Blocked"
                            duration={2500}
                        />
                        <CounterStat 
                            end={60}
                            suffix="+"
                            label="Enterprise Clients"
                            duration={2000}
                        />
                        <CounterStat 
                            end={99}
                            suffix="%"
                            label="Detection Rate"
                            duration={2200}
                        />
                    </div>
                </div>
            </section>

            {/* Features Section - Brutalist Cards */}
            <section id="features" className="py-32 relative">
                <div className="container mx-auto px-6 md:px-12">
                    {/* Section Header */}
                    <div className="mb-20">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-[1px] bg-lime-400"></div>
                            <span className="font-mono text-xs uppercase tracking-[0.3em] text-lime-400">
                                Core Features
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-display text-white">
                            DEFENSE SYSTEMS
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard 
                            number="01"
                            icon={<Zap className="h-12 w-12" strokeWidth={1} />}
                            title="REAL-TIME ANALYSIS"
                            desc="Instant threat detection using optimized machine learning pipelines and heuristic analysis."
                        />
                        <FeatureCard 
                            number="02"
                            icon={<Lock className="h-12 w-12" strokeWidth={1} />}
                            title="ENTERPRISE SECURITY"
                            desc="Military-grade encryption and secure infrastructure. Zero-trust architecture."
                        />
                        <FeatureCard 
                            number="03"
                            icon={<Activity className="h-12 w-12" strokeWidth={1} />}
                            title="ADVANCED HEURISTICS"
                            desc="Beyond blacklists. Deep linguistic pattern analysis and behavioral detection."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-lime-400/20 bg-[#0a0a0a]">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <Shield className="h-6 w-6 text-lime-400" strokeWidth={1.5} />
                            <span className="font-mono text-sm tracking-wider">PHISHGUARD</span>
                        </div>
                        <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                            © 2024 All Systems Operational
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ number, icon, title, desc }) => (
    <motion.div 
        whileHover={{ y: -8 }}
        className="group relative border-2 border-lime-400/20 bg-[#0f0f0f] p-8 md:p-10 hover:border-lime-400 transition-all duration-300"
    >
        {/* Number */}
        <div className="absolute top-6 right-6 text-6xl font-display text-lime-400/10 group-hover:text-lime-400/20 transition-colors">
            {number}
        </div>

        {/* Icon */}
        <div className="text-lime-400 mb-8 relative z-10">
            {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-display mb-4 text-white tracking-wide">
            {title}
        </h3>

        {/* Divider */}
        <div className="w-12 h-[1px] bg-lime-400/30 mb-6 group-hover:w-20 transition-all duration-300"></div>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed font-light">
            {desc}
        </p>

        {/* Corner accent */}
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-lime-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
);

export default Landing;
