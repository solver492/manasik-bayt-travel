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
import { Globe, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage, dir } = useLanguage();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/omra", label: t("nav.omra") },
    { href: "/travel", label: t("nav.tours") },
    // { href: "/groups", label: t("nav.groups") },
    { href: "/packs", label: t("nav.packs") },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-200 rounded-lg flex items-center justify-center shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-all duration-300">
            <span className="text-primary-foreground font-serif font-bold text-xl">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-none tracking-tight text-primary group-hover:text-gold transition-colors">Manasik Bayt</span>
            <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">Travel Agency</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gold relative py-1",
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
              {location === link.href && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
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
                     <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {t("nav.dashboard")}
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
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full px-6">
              <a href="/api/login">{t("auth.login")}</a>
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2 text-primary" onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
           {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-lg font-medium transition-colors hover:text-gold py-2",
                location === link.href ? "text-primary font-bold" : "text-muted-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant={language === 'fr' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('fr')}>FR</Button>
              <Button variant={language === 'ar' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('ar')}>AR</Button>
              <Button variant={language === 'en' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('en')}>EN</Button>
            </div>
            {user ? (
               <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                 <Button variant="outline" size="sm">{t("nav.dashboard")}</Button>
               </Link>
            ) : (
              <Button asChild size="sm" className="bg-primary text-white">
                <a href="/api/login">{t("auth.login")}</a>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
