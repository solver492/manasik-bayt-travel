import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { IslamicPattern } from '@/app/components/islamic-pattern';
import { CrescentMoon } from '@/app/components/crescent-moon';
import logoImage from 'figma:asset/28b4ec1f4e8c715a3ee696ee7b371a9ea0b14a18.png';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt', { email, rememberMe });
  };

  return (
    <div className="w-full max-w-md mx-auto px-8 py-12 relative">
      <IslamicPattern />
      
      {/* Decorative Crescent Moons */}
      <div className="absolute top-4 left-4 z-0">
        <CrescentMoon className="text-[#d4af7a] opacity-10" size={32} />
      </div>
      <div className="absolute bottom-4 right-4 z-0 rotate-180">
        <CrescentMoon className="text-[#1a4d4d] opacity-10" size={32} />
      </div>
      
      {/* Logo */}
      <div className="mb-8 relative z-10 flex justify-center animate-fadeIn">
        <img 
          src={logoImage} 
          alt="Manasik Bayt Travel" 
          className="h-24 w-auto object-contain drop-shadow-lg"
        />
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-10 relative z-10 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <h1 
          className="mb-2 text-[#1a4d4d]" 
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Bienvenue sur Manasik Bayt Travel
        </h1>
        <p 
          className="text-[#2d3436]/70"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Votre voyage spirituel commence ici
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        {/* Email Field */}
        <div>
          <label 
            htmlFor="email" 
            className="block mb-2 text-[#2d3436]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Adresse e-mail
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a4d4d]/50 group-focus-within:text-[#1a4d4d] w-5 h-5 transition-colors duration-300" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#1a4d4d]/20 rounded-xl focus:outline-none focus:border-[#1a4d4d] focus:ring-2 focus:ring-[#1a4d4d]/20 transition-all duration-300 text-[#2d3436] shadow-sm hover:shadow-md"
              placeholder="votre@email.com"
              required
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label 
            htmlFor="password" 
            className="block mb-2 text-[#2d3436]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Mot de passe
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a4d4d]/50 group-focus-within:text-[#1a4d4d] w-5 h-5 transition-colors duration-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white border-2 border-[#1a4d4d]/20 rounded-xl focus:outline-none focus:border-[#1a4d4d] focus:ring-2 focus:ring-[#1a4d4d]/20 transition-all duration-300 text-[#2d3436] shadow-sm hover:shadow-md"
              placeholder="••••••••"
              required
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1a4d4d]/50 hover:text-[#1a4d4d] transition-colors"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[#1a4d4d]/30 text-[#1a4d4d] focus:ring-[#1a4d4d]/20 cursor-pointer"
            />
            <span 
              className="ml-2 text-[#2d3436]/80 text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Se souvenir de moi
            </span>
          </label>
          <a 
            href="#" 
            className="text-sm text-[#1a4d4d] hover:text-[#d4af7a] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Mot de passe oublié ?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full bg-[#d4af7a] text-white py-3.5 rounded-xl hover:bg-[#c49a63] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] relative overflow-hidden group"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="relative z-10">Se Connecter</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>

        {/* Secure Login Badge */}
        <div className="flex items-center justify-center gap-2 text-[#1a4d4d]/60 text-sm">
          <Shield className="w-4 h-4" />
          <span style={{ fontFamily: "'Inter', sans-serif" }}>Connexion sécurisée</span>
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1a4d4d]/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span 
              className="px-4 bg-[#f8f6f3] text-[#2d3436]/60 text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Nouveau sur Manasik ?
            </span>
          </div>
        </div>

        {/* Create Account Link */}
        <div className="text-center">
          <a 
            href="#" 
            className="inline-block text-[#1a4d4d] hover:text-[#d4af7a] transition-colors border-b-2 border-transparent hover:border-[#d4af7a]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Créer un compte
          </a>
        </div>
      </form>
    </div>
  );
}