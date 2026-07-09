import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, Search, History, BarChart3, LogOut, Menu, User, Terminal } from 'lucide-react';
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
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8 scrollbar-thin scrollbar-thumb-lime-900 scrollbar-track-[#0a0a0a]">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
