import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< Updated upstream
import { Shield, LayoutDashboard, Search, History, BarChart3, LogOut, Menu, User, Terminal } from 'lucide-react';
=======
import { Shield, LayoutDashboard, Search, History, BarChart3, LogOut, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
>>>>>>> Stashed changes
import { Button } from './ui/button';
import AuthContext from '../context/AuthContext';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
<<<<<<< Updated upstream
        { path: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
        { path: '/detect', icon: Search, label: 'THREAT_DETECT' },
        { path: '/history', icon: History, label: 'SCAN_LOGS' },
        ...(user?.role === 'admin' ? [{ path: '/analytics', icon: BarChart3, label: 'SYSTEM_ANALYTICS' }] : []),
    ];

    return (
        <div className="flex h-screen bg-[#121212] overflow-hidden selection:bg-lime-400/30 selection:text-lime-400 font-mono">
            {/* Sidebar */}
            <AnimatePresence mode='wait'>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-[#0f0f0f] border-r border-[#333] hidden md:flex flex-col z-20 relative"
                    >
                         {/* Noise Grain Overlay */}
                         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                        <div className="h-20 flex items-center px-6 border-b border-[#333] relative z-10">
                            <Shield className="h-8 w-8 text-lime-400 mr-3" strokeWidth={1.5} />
                            <div className="flex flex-col">
                                <span className="text-xl font-display tracking-wider text-white">
                                    PHISHGUARD
                                </span>
                                <span className="text-[10px] text-lime-400 tracking-[0.2em]">SYSTEM V.2.0</span>
                            </div>
                        </div>

                        <div className="flex-1 py-8 px-0 space-y-1 relative z-10">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link key={item.path} to={item.path} className="block group">
                                        <div className={`relative px-6 py-4 flex items-center transition-all duration-200 ${isActive ? 'bg-lime-400/5' : 'hover:bg-white/5'}`}>
                                            {/* Active State Border Stripe */}
                                            {isActive && (
                                                <motion.div 
                                                    layoutId="activeTab"
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.5)]" 
                                                />
                                            )}
                                            
                                            <item.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-lime-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                                            <span className={`text-sm tracking-widest ${isActive ? 'text-lime-400 font-bold' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="p-6 border-t border-[#333] relative z-10">
                            <div className="flex items-center mb-6 px-2 border border-[#333] p-3 bg-black/40">
                                <div className="h-8 w-8 bg-lime-400/20 flex items-center justify-center text-lime-400 mr-3 border border-lime-400/30">
                                    <User className="h-4 w-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-white uppercase tracking-wider truncate">{user?.username}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <Button 
                                variant="destructive" 
                                className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 rounded-none uppercase tracking-widest text-xs h-10" 
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-3 w-3" />
                                Disconnect
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#121212] relative">
                 {/* Topbar */}
                <header className="h-20 border-b border-[#333] flex items-center justify-between px-8 bg-[#121212]/90 backdrop-blur-md sticky top-0 z-10">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:flex hidden text-lime-400 hover:text-lime-300 hover:bg-lime-400/10 rounded-none">
                        <Menu className="h-5 w-5" />
                    </Button>
                     <div className="md:hidden flex items-center">
                        <Shield className="h-6 w-6 text-lime-400 mr-2" />
                         <span className="font-display tracking-wider text-white">PHISHGUARD</span>
                     </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-2 px-3 py-1 border border-lime-400/20 bg-lime-400/5">
                            <div className="h-1.5 w-1.5 bg-lime-400 animate-pulse"></div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-lime-400 font-bold">System Online</span>
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono hidden sm:block">
                             {new Date().toLocaleTimeString()} :: SECURE_CONN
=======
        { path: '/dashboard', icon: LayoutDashboard, label: 'Control Center' },
        { path: '/detect', icon: Search, label: 'Threat Scanner' },
        { path: '/history', icon: History, label: 'Vector Logs' },
        ...(user?.role === 'admin' ? [{ path: '/analytics', icon: BarChart3, label: 'Intelligence' }] : []),
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden cyber-grid">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="bg-slate-950/50 backdrop-blur-xl border-r border-cyan-500/10 flex flex-col relative z-50 transition-all duration-300"
            >
                <div className="h-20 flex items-center px-6 mb-8 border-b border-cyan-500/5">
                    <Shield className="h-6 w-6 text-cyan-500 flex-shrink-0" />
                    {isSidebarOpen && (
                        <motion.span 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="ml-3 font-bold text-lg tracking-tighter uppercase italic text-cyan-500"
                        >
                            AI_Scanner
                        </motion.span>
                    )}
                </div>

                <div className="flex-1 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant="ghost"
                                    className={`w-full group relative h-12 rounded-lg transition-all duration-300 ${
                                        isActive 
                                        ? 'bg-cyan-500/10 text-cyan-400' 
                                        : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5'
                                    } ${isSidebarOpen ? 'justify-start px-4' : 'justify-center px-0'}`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-cyan-500' : ''}`} />
                                    {isSidebarOpen && <span className="ml-3 font-bold text-[10px] uppercase tracking-widest">{item.label}</span>}
                                    {isActive && isSidebarOpen && (
                                        <motion.div 
                                            layoutId="active-pill"
                                            className="absolute left-0 w-[2px] h-6 bg-cyan-500"
                                        />
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-cyan-500/5">
                    <div className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 scale-0 h-0 overflow-hidden'} transition-all duration-300 mb-4 px-2`}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Operative</p>
                        <p className="text-xs font-bold text-white truncate mt-1">{user?.username}</p>
                    </div>
                    <Button 
                        variant="ghost" 
                        className={`w-full h-12 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 ${isSidebarOpen ? 'justify-start px-4' : 'justify-center px-0'}`}
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        {isSidebarOpen && <span className="ml-3 font-bold text-[10px] uppercase tracking-widest">Terminate Session</span>}
                    </Button>
                </div>

                <button 
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)] border border-cyan-400/50 hover:scale-110 transition-transform"
                >
                    {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                <header className="h-20 flex items-center justify-between px-8 border-b border-cyan-500/5 bg-slate-950/20 backdrop-blur-md">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold tracking-tight uppercase italic text-white">
                            {menuItems.find(i => i.path === location.pathname)?.label || 'System Overview'}
                        </h2>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Inference Engine Active</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg border border-cyan-500/10 flex items-center justify-center bg-cyan-500/5">
                            <Activity className="h-5 w-5 text-cyan-500/60" />
>>>>>>> Stashed changes
                        </div>
                    </div>
                </header>

<<<<<<< Updated upstream
                <main className="flex-1 overflow-auto p-8 scrollbar-thin scrollbar-thumb-lime-900 scrollbar-track-[#0a0a0a]">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
=======
                <main className="flex-1 overflow-auto p-8 relative">
                    {children}
>>>>>>> Stashed changes
                </main>
            </div>
        </div>
    );
};

export default Layout;
