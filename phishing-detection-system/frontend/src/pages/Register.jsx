import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Show wake-up message after 3 seconds
        const wakeUpTimer = setTimeout(() => {
            setError('⏳ Server is waking up... This may take up to 60 seconds on first load.');
        }, 3000);
        
        try {
            await register(username, email, password);
            clearTimeout(wakeUpTimer);
            navigate('/dashboard');
        } catch (err) {
            clearTimeout(wakeUpTimer);
            setError('Registration failed. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white relative overflow-hidden">
            {/* Scan-line Effect */}
            <div className="scanline"></div>

            {/* Back to Home Link */}
            <Link to="/" className="fixed top-6 left-6 z-50 flex items-center space-x-2 group">
                <Shield className="h-6 w-6 text-lime-400" strokeWidth={1.5} />
                <span className="font-mono text-sm uppercase tracking-wider text-gray-400 group-hover:text-lime-400 transition-colors">
                    PhishGUARD
                </span>
            </Link>

            <div className="container mx-auto px-6 min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Form Container - Sharp Borders */}
                    <div className="border-2 border-lime-400/20 bg-[#1a1a1a] p-8 relative">
                        {/* Terminal-style header */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-lime-400/5 border-b border-lime-400/20 flex items-center px-3">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-lime-400/40"></div>
                                <div className="w-2 h-2 bg-lime-400/40"></div>
                                <div className="w-2 h-2 bg-lime-400/40"></div>
                            </div>
                            <span className="ml-4 font-mono text-xs text-lime-400/60 uppercase">Registration Terminal</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            {/* Error Message */}
                            {error && (
                                <div className={`p-4 border-2 font-mono text-xs ${
                                    error.includes('⏳') 
                                        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}>
                                    <div className="font-bold mb-1">&gt; SYSTEM MESSAGE</div>
                                    {error}
                                </div>
                            )}

                            {/* Username Input */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="font-mono text-xs uppercase tracking-wider text-lime-400 block">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full bg-[#0f0f0f] border-2 border-lime-400/20 px-4 py-3 font-mono text-sm text-white focus:border-lime-400 focus:outline-none transition-colors"
                                    placeholder="enter_username"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-lime-400 block">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-[#0f0f0f] border-2 border-lime-400/20 px-4 py-3 font-mono text-sm text-white focus:border-lime-400 focus:outline-none transition-colors"
                                    placeholder="user@example.com"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-lime-400 block">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-[#0f0f0f] border-2 border-lime-400/20 px-4 py-3 font-mono text-sm text-white focus:border-lime-400 focus:outline-none transition-colors"
                                    placeholder="••••••••••"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-lime-400 text-black font-mono text-xs uppercase tracking-wider px-6 py-4 border-2 border-lime-400 hover:bg-transparent hover:text-lime-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black animate-spin rounded-full"></div>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Register User</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 pt-6 border-t border-lime-400/20">
                            <p className="font-mono text-xs text-gray-400 text-center">
                                Already registered?{' '}
                                <Link to="/login" className="text-lime-400 hover:underline uppercase tracking-wider">
                                    Login Here
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-6 flex items-center justify-between font-mono text-xs text-gray-600">
                        <div>SECURE_CONNECTION</div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-lime-400 animate-pulse"></div>
                            <span>ONLINE</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
