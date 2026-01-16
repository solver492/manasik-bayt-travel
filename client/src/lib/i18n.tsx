import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'ar' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  fr: {
    "nav.home": "Accueil",
    "nav.omra": "Omra & Hajj",
    "nav.tours": "Voyages",
    "nav.groups": "Groupes",
    "nav.packs": "Packs",
    "nav.about": "À Propos",
    "nav.contact": "Contact",
    "nav.dashboard": "Mon Espace",
    "hero.title": "Voyagez avec l'Âme en Paix",
    "hero.subtitle": "Une expérience spirituelle et touristique unique, conçue pour votre confort et votre sérénité.",
    "hero.cta.omra": "Réserver Omra",
    "hero.cta.tours": "Découvrir le Monde",
    "section.featured": "Nos Offres Vedettes",
    "section.esim.title": "Restez Connecté",
    "section.esim.desc": "Évitez les frais d'itinérance avec nos solutions eSIM intégrées. Profitez d'une connexion internet fluide partout dans le monde.",
    "booking.price": "Prix par personne",
    "booking.book": "Réserver",
    "footer.rights": "Tous droits réservés.",
    "auth.login": "Connexion",
    "auth.logout": "Déconnexion",
  },
  en: {
    "nav.home": "Home",
    "nav.omra": "Umrah & Hajj",
    "nav.tours": "Tours",
    "nav.groups": "Groups",
    "nav.packs": "Packs",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.dashboard": "Dashboard",
    "hero.title": "Travel with Peace of Soul",
    "hero.subtitle": "A unique spiritual and tourist experience, designed for your comfort and serenity.",
    "hero.cta.omra": "Book Umrah",
    "hero.cta.tours": "Discover the World",
    "section.featured": "Featured Offers",
    "section.esim.title": "Stay Connected",
    "section.esim.desc": "Avoid roaming charges with our integrated eSIM solutions. Enjoy seamless internet connection anywhere in the world.",
    "booking.price": "Price per person",
    "booking.book": "Book Now",
    "footer.rights": "All rights reserved.",
    "auth.login": "Login",
    "auth.logout": "Logout",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.omra": "العمرة والحج",
    "nav.tours": "سياحة",
    "nav.groups": "مجموعات",
    "nav.packs": "باقات",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",
    "nav.dashboard": "لوحة التحكم",
    "hero.title": "سافر بروح مطمئنة",
    "hero.subtitle": "تجربة روحية وسياحية فريدة، مصممة لراحتك وصفائك.",
    "hero.cta.omra": "حجز العمرة",
    "hero.cta.tours": "اكتشف العالم",
    "section.featured": "عروض مميزة",
    "section.esim.title": "ابق متصلاً",
    "section.esim.desc": "تجنب رسوم التجوال مع حلول eSIM المتكاملة لدينا. استمتع باتصال إنترنت سلس في أي مكان في العالم.",
    "booking.price": "السعر للشخص الواحد",
    "booking.book": "احجز الآن",
    "footer.rights": "جميع الحقوق محفوظة.",
    "auth.login": "دخول",
    "auth.logout": "خروج",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
