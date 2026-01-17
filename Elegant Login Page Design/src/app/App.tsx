import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import logoBackground from 'figma:asset/28b4ec1f4e8c715a3ee696ee7b371a9ea0b14a18.png';

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt', { username, password });
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Ici vous pouvez ajouter la logique d'authentification OAuth
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Logo Manasik */}
      <div className="absolute inset-0 z-0">
        <img
          src={logoBackground}
          alt="Manasik Bayt Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a4d4d]/50"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-6 py-3 shadow-lg">
            <div className="flex gap-8">
              <a href="#" className="text-white hover:text-white/80 transition-colors font-medium">
                Accueil
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors font-medium">
                À propos
              </a>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-white hover:text-white/80 transition-colors font-medium">
                Se connecter
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors font-medium">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-6xl flex items-center justify-between gap-12">
          {/* Left Side - Title */}
          <div className="flex-1 text-white">
            <h1 
              className="text-5xl lg:text-7xl mb-4 text-[#d4af7a]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Manasik
              <br />
              Bayt Travel
            </h1>
            <p 
              className="text-xl lg:text-2xl italic opacity-90 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Votre voyage spirituel commence ici
            </p>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex-1 max-w-md">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl">
              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 rounded-xl transition-all ${
                    activeTab === 'login'
                      ? 'bg-[#d4af7a] text-white font-semibold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-3 rounded-xl transition-all ${
                    activeTab === 'signup'
                      ? 'bg-[#d4af7a] text-white font-semibold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  S'inscrire
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nom d'utilisateur"
                    className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#d4af7a] backdrop-blur-sm transition-all"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#d4af7a] backdrop-blur-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#d4af7a] to-[#c49a63] hover:from-[#c49a63] hover:to-[#b58952] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                >
                  Se connecter
                </button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/30"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-transparent text-white/80 text-sm">
                      Ou continuer avec
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm font-medium">Facebook</span>
                  </button>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                  </button>

                  {/* Instagram */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Instagram')}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-sm font-medium">Instagram</span>
                  </button>

                  {/* TikTok */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('TikTok')}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <span className="text-sm font-medium">TikTok</span>
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="text-center pt-2">
                  <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
