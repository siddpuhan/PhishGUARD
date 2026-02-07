import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, Search, History, BarChart3, LogOut, Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';
import { useContext } from 'react';
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
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/detect', icon: Search, label: 'Detection' },
        { path: '/history', icon: History, label: 'Scan History' },
        ...(user?.role === 'admin' ? [{ path: '/analytics', icon: BarChart3, label: 'Analytics' }] : []),
    ];

    return (
        <div className="flex h-screen bg-background overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Sidebar */}
            <AnimatePresence mode='wait'>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-card border-r border-border hidden md:flex flex-col z-20"
                    >
                        <div className="h-16 flex items-center px-6 border-b border-border">
                            <Shield className="h-8 w-8 text-cyan-500 mr-2" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                                PhishGuard AI
                            </span>
                        </div>

                        <div className="flex-1 py-6 px-4 space-y-1">
                            {menuItems.map((item) => (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start mb-1 ${location.pathname === item.path ? 'bg-accent/50 text-cyan-400' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </div>

                        <div className="p-4 border-t border-border">
                            <div className="flex items-center mb-4 px-2">
                                <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 mr-2">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{user?.username}</p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user?.email}</p>
                                </div>
                            </div>
                            <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Overlay */}
            {/* (Omitted for brevity in this step, focusing on desktop first, but responsiveness is in requirements) */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-background/50 backdrop-blur-sm">
                {/* Topbar */}
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-md sticky top-0 z-10">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:flex hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                     <div className="md:hidden flex items-center">
                        <Shield className="h-6 w-6 text-cyan-500 mr-2" />
                         <span className="font-bold">PhishGuard</span>
                     </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground hidden sm:block">
                            System Status: <span className="text-green-500 font-medium">Online</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
