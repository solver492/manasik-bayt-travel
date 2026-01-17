import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Car, Shield, Gauge, Clock, ArrowLeft, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function CarRentService() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">
            <header className="relative h-[60vh] flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1449965072345-65718144f23b?q=80&w=2000&auto=format&fit=crop"
                        alt="Luxury Cars"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/60" />
                </div>

                <div className="container relative z-10 px-4">
                    <Link href="/services">
                        <button className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            Retour aux services
                        </button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
                            Location de Véhicules
                        </h1>
                        <p className="text-white/80 text-xl max-w-2xl font-light">
                            Voyagez à votre rythme avec nos services de location de voitures haut de gamme.
                        </p>
                    </motion.div>
                </div>
            </header>

            <section className="py-24 container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <h2 className="text-4xl font-serif font-bold text-primary">Pourquoi nous choisir ?</h2>
                    <p className="text-muted-foreground text-lg">
                        Nous proposons une large gamme de véhicules adaptés à tous vos besoins, de la citadine économique au SUV luxueux.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: Shield, title: "Assurance Tout Risque", desc: "Partez l'esprit tranquille avec nos protections complètes." },
                        { icon: Gauge, title: "Kilométrage Illimité", desc: "Explorez sans compter la distance parcourue." },
                        { icon: Clock, title: "Assistance 24/7", desc: "Une équipe dédiée pour vous aider à tout moment." },
                        { icon: Key, title: "Livraison Locale", desc: "Récupérez votre véhicule à l'aéroport ou à votre hôtel." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-3xl border border-border hover:border-gold/30 hover:shadow-xl transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-primary rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h3 className="text-3xl font-serif font-bold mb-4">Prêt à prendre la route ?</h3>
                        <p className="text-white/70 text-lg">
                            Contactez-nous pour réserver votre véhicule ou pour obtenir plus d'informations sur nos tarifs préférentiels.
                        </p>
                    </div>
                    <Link href="/contact">
                        <Button size="lg" className="bg-gold hover:bg-gold/90 text-primary-foreground rounded-full px-12 h-14 text-lg font-bold">
                            Réserver Maintenant
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
