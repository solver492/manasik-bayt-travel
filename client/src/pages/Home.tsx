import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useOffers } from "@/hooks/use-offers";
import OfferCard from "@/components/OfferCard";
import { ArrowRight, Star, Plane, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  const { t } = useLanguage();
  const { data: featuredOffers, isLoading } = useOffers({ featured: true });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-start justify-center overflow-hidden pt-8">
        {/* Animated Background with Overlay */}
        <div className="absolute inset-0 z-0 bg-primary/95">
          <img
            src="/hero-background.gif"
            alt="Hero Background"
            className="w-full h-full object-contain md:object-cover object-center"
          />
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 text-center mt-2 flex flex-col h-full justify-between pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight drop-shadow-2xl">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          {/* CTA Buttons at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12"
          >
            <Link href="/omra">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-primary-foreground min-w-[220px] h-14 text-lg font-semibold rounded-full shadow-2xl shadow-gold/30 transition-transform hover:scale-105 active:scale-95">
                {t("hero.cta.omra")}
              </Button>
            </Link>
            <Link href="/travel">
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-xl min-w-[220px] h-14 text-lg font-semibold rounded-full transition-transform hover:scale-105 active:scale-95">
                {t("hero.cta.tours")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Features */}
      <section className="py-24 bg-white relative z-20 -mt-20 rounded-t-[3rem]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Premium Experience", desc: "Hand-picked hotels and exclusive services for your comfort." },
              { icon: Shield, title: "Secure Booking", desc: "Full protection and transparent pricing with no hidden fees." },
              { icon: Plane, title: "Global Coverage", desc: "From spiritual journeys to world exploration, we cover it all." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border hover:border-gold/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-6">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-primary mb-3">{t("section.featured")}</h2>
              <p className="text-muted-foreground">Handpicked packages just for you</p>
            </div>
            <Link href="/offers">
              <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-gold hover:text-gold/80 hover:bg-gold/10">
                View All Offers <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredOffers?.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Omra Ramadan 2026 Section Simplified */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 bg-muted/30 p-12 rounded-3xl border border-gold/20 shadow-lg">

            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary leading-tight">
              🌙 Offres Omra Ramadan 2026 - Packs Complets (30 Jours)
            </h2>

            <div className="space-y-4 text-lg md:text-xl text-muted-foreground">
              <p className="font-medium">
                <span className="text-primary font-bold">Départ :</span> 17 Février 2026 | <span className="text-primary font-bold">Retour :</span> 22 Mars 2026
              </p>
              <p className="font-medium">
                <span className="text-primary font-bold">Lieu de départ :</span> Vol Direct depuis l'Aéroport de Tanger
              </p>
            </div>

            <div className="pt-8">
              <Button
                size="lg"
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-gold hover:bg-gold/90 text-primary-foreground min-w-[240px] h-14 text-xl font-bold rounded-full shadow-xl shadow-gold/20 hover:scale-105 transition-transform duration-300"
              >
                Réserver Maintenant
              </Button>
            </div>

          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        offerTitle="Omra Ramadan 2026"
        offerId={1}
      />
    </div>
  );
}
