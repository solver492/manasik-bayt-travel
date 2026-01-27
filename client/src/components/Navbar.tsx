import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, User, LogOut, LayoutDashboard, Menu, X, ChevronDown, Building2, Car, Luggage, Plane } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage, dir } = useLanguage();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: t("nav.home"), icon: "/icons/Accueil.png" },
    { href: "/omra", label: t("nav.omra"), icon: "/icons/Omra & Hajj.png" },
    { href: "/travel", label: t("nav.tours"), icon: "/icons/Voyages.png" },
    { href: "/packs", label: t("nav.packs"), icon: "/icons/packs.png" },
    {
      label: t("nav.services"),
      icon: "/icons/services.png",
      isDropdown: true,
      subItems: [
        { href: "/services/hotel", label: t("services.hotel"), description: "Hôtels de prestige", icon: Building2 },
        { href: "/services/car-rent", label: t("services.carRent"), description: "Location de véhicules", icon: Car },
        { href: "/packs", label: t("nav.packs"), description: "Nos formules complètes", icon: Luggage, isRedirection: true },
        { href: "/travel", label: t("nav.tours"), description: "Découvrez le monde", icon: Plane, isRedirection: true },
      ]
    },
    { href: "/contact", label: t("nav.contact"), icon: "/icons/contacte.png" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/[0.02] backdrop-blur-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] ring-1 ring-white/5">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.jpeg"
            alt="Manasik Bayt Travel"
            className="h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            link.isDropdown ? (
              <DropdownMenu key={link.label}>
                <DropdownMenuTrigger className="focus:outline-none">
                  <motion.div
                    className={cn(
                      "text-sm font-medium transition-all duration-300 relative py-2 px-1 flex items-center gap-2",
                      location.startsWith("/services") ? "text-black font-bold" : "text-black/80 hover:text-gold"
                    )}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={link.icon} alt="" className="w-5 h-5 object-contain" />
                    {link.label}
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px] p-2 bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
                  {link.subItems?.map((sub) => (
                    <DropdownMenuItem key={sub.href} asChild>
                      <Link href={sub.href} className="flex items-start gap-4 p-3 rounded-xl cursor-pointer hover:bg-gold/10 transition-colors group">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          sub.isRedirection ? "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white" : "bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white"
                        )}>
                          <sub.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{sub.label}</div>
                          <div className="text-xs text-muted-foreground">{sub.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className="relative"
              >
                <motion.span
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative py-2 px-1 block flex items-center gap-2",
                    location === link.href ? "text-black font-bold" : "text-black/80 hover:text-gold"
                  )}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={link.icon} alt="" className="w-5 h-5 object-contain" />
                  {link.label}
                  {location === link.href && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold via-yellow-400 to-gold rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.span>
              </Link>
            )
          ))}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-black/80 hover:text-black hover:bg-black/5 transition-all">
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('fr')}>Français</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>العربية</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-4">
              {/* Gamification Badge */}
              <div className="hidden xl:flex flex-col items-end mr-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{user.points} pts</span>
                <span className={cn(
                  "text-xs font-bold uppercase px-2 py-0.5 rounded-full",
                  user.level === 'gold' ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                    user.level === 'silver' ? "bg-slate-100 text-slate-700 border border-slate-200" :
                      "bg-orange-50 text-orange-700 border border-orange-200"
                )}>
                  {user.level}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full w-10 h-10 p-0 bg-primary/10 hover:bg-primary/20 text-primary border-none shadow-none">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold text-primary">
                    {user.username}
                  </div>
                  <div className="h-px bg-border my-1" />
                  <DropdownMenuItem asChild>
                    <Link href={user.role === 'admin' ? "/admin" : "/dashboard"} className="cursor-pointer w-full flex items-center">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {user.role === 'admin' ? "Admin Panel" : t("nav.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-400 hover:to-gold text-white font-bold shadow-xl shadow-gold/20 rounded-full px-8 transition-all duration-300 border-none">
                {t("auth.login")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2 text-black hover:bg-black/5 rounded-full transition-colors" onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/20 backdrop-blur-[32px] p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto">
          {links.map((link) => (
            link.isDropdown ? (
              <div key={link.label} className="space-y-2">
                <div className="text-black/40 text-xs font-bold uppercase tracking-widest px-4 mt-2">
                  {link.label}
                </div>
                {link.subItems?.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "text-lg font-medium transition-all hover:text-gold py-2 flex items-center gap-3 px-4 rounded-xl",
                      location === sub.href ? "bg-black/10 text-black font-bold" : "text-black/70 hover:bg-black/5"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <sub.icon className="w-5 h-5 opacity-70" />
                    {sub.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className={cn(
                  "text-lg font-medium transition-all hover:text-gold py-2 flex items-center gap-3 px-4 rounded-xl",
                  location === link.href ? "bg-black/10 text-black font-bold" : "text-black/70 hover:bg-black/5"
                )}
                onClick={() => setIsOpen(false)}
              >
                <img src={link.icon} alt="" className="w-6 h-6 object-contain" />
                {link.label}
              </Link>
            )
          ))}
          <div className="h-px bg-border my-2" />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant={language === 'fr' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('fr')}>FR</Button>
              <Button variant={language === 'ar' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('ar')}>AR</Button>
              <Button variant={language === 'en' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('en')}>EN</Button>
            </div>
            {user ? (
              <Link href={user.role === 'admin' ? "/admin" : "/dashboard"} onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm">{user.role === 'admin' ? "Admin" : t("nav.dashboard")}</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button size="sm" className="bg-primary text-white">
                  {t("auth.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
