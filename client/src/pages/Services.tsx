import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, Car, Luggage, Plane, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const services = [
    {
        id: "hotel",
        icon: Building2,
        title: "Hôtels de Luxe",
        description: "Une sélection rigoureuse des meilleurs établissements pour votre confort et votre sérénité.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
        href: "/services/hotel"
    },
    {
        id: "car-rent",
        icon: Car,
        title: "Location de Voitures",
        description: "Des véhicules récents et confortables pour vos déplacements en toute liberté.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
        href: "/services/car-rent"
    }
];

export default function Services() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2000&auto=format&fit=crop"
                        alt="Services background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
                </div>

                <div className="container relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-bold uppercase tracking-widest mb-6 border border-gold/30 backdrop-blur-md"
                    >
                        <Star className="w-4 h-4 fill-gold" /> Nos Services Exclusifs
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-serif font-bold text-white mb-6"
                    >
                        {t("services.title")}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light"
                    >
                        Au-delà du pèlerinage, nous vous accompagnons dans chaque détail de votre voyage.
                    </motion.p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-white/20 h-[500px]"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-gold/20 backdrop-blur-xl border border-gold/30 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-white">{service.title}</h3>
                                <p className="text-white/70 text-lg max-w-sm line-clamp-2">
                                    {service.description}
                                </p>
                                <Link href={service.href}>
                                    <Button className="mt-4 bg-white text-primary hover:bg-gold hover:text-white rounded-full px-8 h-12 font-bold transition-all group/btn">
                                        En savoir plus
                                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Explore More - Navigation Buttons */}
                <div className="bg-primary/5 rounded-[3rem] p-12 md:p-20 text-center border border-primary/10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-10">Explorez nos offres complètes</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/packs">
                            <Button size="lg" className="bg-gold hover:bg-gold/90 text-primary-foreground min-w-[240px] h-16 text-xl font-bold rounded-2xl shadow-xl shadow-gold/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                                <Luggage className="w-6 h-6" />
                                Nos Packs
                            </Button>
                        </Link>
                        <Link href="/travel">
                            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary hover:text-white min-w-[240px] h-16 text-xl font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                                <Plane className="w-6 h-6" />
                                Nos Voyages
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
