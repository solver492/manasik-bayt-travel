import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useOffers } from "@/hooks/use-offers";
import OfferCard from "@/components/OfferCard";
import { ArrowRight, Star, Plane, Shield, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useLanguage();
  const { data: featuredOffers, isLoading } = useOffers({ featured: true });

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

      {/* eSIM Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 -skew-x-12 transform origin-top" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-bold uppercase tracking-wider">
                <Wifi className="w-4 h-4" /> Connectivity
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
                {t("section.esim.title")}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {t("section.esim.desc")}
              </p>
              <div className="flex gap-4">
                <Button className="bg-gold hover:bg-gold/90 text-primary-foreground rounded-full px-8">
                  Get eSIM
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                  Watch Guide
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2">
              {/* Video Placeholder */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10 shadow-2xl group cursor-pointer">
                {/* Unsplash: Man using phone in airport */}
                <img
                  src="https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?q=80&w=2000&auto=format&fit=crop"
                  alt="eSIM usage"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
