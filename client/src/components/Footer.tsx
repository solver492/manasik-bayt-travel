import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="Manasik Bayt Travel"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your trusted partner for spiritual journeys and world exploration. We combine luxury, comfort, and spirituality.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61586792775655" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gold hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gold hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg text-gold mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/omra" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">Omra & Hajj</Link></li>
              <li><Link href="/travel" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">International Travel</Link></li>
              <li><Link href="/packs" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">Packages</Link></li>
              <li><Link href="/services" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">{t("nav.services")}</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-bold text-lg text-gold mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold text-lg text-gold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-gold shrink-0" />
                <span>Rue Fès, Galerie Marrakech N°29,<br />Tanger, Maroc</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <div>Fixe: 0531 31 53 15</div>
                  <div className="mt-1">Mobile: +212 661 63 11 60</div>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <span>contact@manasikbayt.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Manasik Bayt Travel. {t("footer.rights")}</p>
          <p>Designed and developed by digitalsolverland.</p>
        </div>
      </div>
    </footer>
  );
}
