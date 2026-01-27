import { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    const { login, register, user, isLoggingIn, isRegistering } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                setLocation("/admin");
            } else {
                setLocation("/");
            }
        }
    }, [user, setLocation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeTab === 'login') {
                await login({ username, password });
                toast({ title: "Connexion réussie", description: "Bon retour parmi nous !" });
            } else {
                await register({ username, email, password, firstName, lastName, phone });
                toast({ title: "Compte créé", description: "Bienvenue chez Manasik Bayt Travel !" });
            }
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue",
                variant: "destructive"
            });
        }
    };

    const handleSocialLogin = (provider: string) => {
        // Replit Auth usually handles this, but for now we'll show a message
        toast({ title: "Info", description: `Connexion avec ${provider} bientôt disponible.` });
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/login-background.gif"
                    alt="Travel Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#1a4d4d]/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
                {/* Left Side - Brand Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-white text-center lg:text-left"
                >
                    <img src="/logo.jpeg" alt="Logo" className="h-24 w-auto mb-8 mx-auto lg:mx-0 rounded-2xl shadow-2xl" />
                    <h1
                        className="text-5xl lg:text-7xl mb-4 text-[#d4af7a] font-serif font-bold leading-tight"
                    >
                        Manasik
                        <br />
                        Bayt Travel
                    </h1>
                    <p
                        className="text-xl lg:text-2xl italic opacity-90 text-white font-serif"
                    >
                        Votre voyage spirituel commence ici
                    </p>

                    <div className="mt-12 hidden lg:grid grid-cols-2 gap-6 max-w-md">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <h3 className="font-bold text-gold mb-1">Expertise</h3>
                            <p className="text-sm text-white/70">Plus de 15 ans à votre service pour la Omra et le Hajj.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <h3 className="font-bold text-gold mb-1">Confiance</h3>
                            <p className="text-sm text-white/70">Des milliers de pèlerins nous font confiance chaque année.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Auth Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)]">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-8 bg-black/20 p-1.5 rounded-2xl">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-3 rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-wider ${activeTab === 'login'
                                    ? 'bg-[#d4af7a] text-white shadow-lg'
                                    : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                Se connecter
                            </button>
                            <button
                                onClick={() => setActiveTab('signup')}
                                className={`flex-1 py-3 rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-wider ${activeTab === 'signup'
                                    ? 'bg-[#d4af7a] text-white shadow-lg'
                                    : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                S'inscrire
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.form
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Username Field */}
                                <div className="group relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-gold transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Nom d'utilisateur"
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af7a] focus:bg-white/20 transition-all font-medium"
                                        required
                                    />
                                </div>

                                {/* Email Field (Signup only) */}
                                {activeTab === 'signup' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="group relative">
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    placeholder="Prénom"
                                                    className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af7a] focus:bg-white/20 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="group relative">
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    placeholder="Nom"
                                                    className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af7a] focus:bg-white/20 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-gold transition-colors w-5 h-5" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Téléphone"
                                                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af7a] focus:bg-white/20 transition-all font-medium"
                                                required
                                            />
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="group relative"
                                        >
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-gold transition-colors w-5 h-5" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email"
                                                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af7a] focus:bg-white/20 transition-all font-medium"
                                                required
                                            />
                                        </motion.div>
                                    </>
                                )}

                                {/* Password Field */}
                                <div className="group relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-gold transition-colors w-5 h-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mot de passe"
                                        className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af7a] focus:bg-white/20 transition-all font-medium"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoggingIn || isRegistering}
                                    className="w-full py-4 bg-gradient-to-r from-[#d4af7a] to-[#c49a63] hover:from-[#c49a63] hover:to-[#b58952] text-white font-bold rounded-2xl shadow-xl shadow-gold/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {activeTab === 'login'
                                        ? (isLoggingIn ? "Connexion..." : "Se connecter")
                                        : (isRegistering ? "Inscription..." : "S'inscrire")
                                    }
                                </button>

                                {/* Divider */}
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 bg-[#1a4d4d]/0 backdrop-blur-sm text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                            Ou continuer avec
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin('Google')}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all transform hover:scale-105"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase">Google</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin('Facebook')}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all transform hover:scale-105"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase">Facebook</span>
                                    </button>
                                </div>

                                {/* Forgot Password */}
                                <div className="text-center pt-2">
                                    <a href="#" className="text-white/40 hover:text-white text-xs font-medium transition-colors">
                                        Mot de passe oublié ?
                                    </a>
                                </div>
                            </motion.form>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
