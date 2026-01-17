import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, Star, Check, MapPin, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function HotelService() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">
            <header className="relative h-[60vh] flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
                        alt="Luxury Hotel"
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
                            Hôtels de Prestige
                        </h1>
                        <p className="text-white/80 text-xl max-w-2xl font-light">
                            Nous sélectionnons pour vous les meilleurs hôtels à proximité des Lieux Saints et partout dans le monde.
                        </p>
                    </motion.div>
                </div>
            </header>

            <section className="py-24 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-bold uppercase tracking-widest">
                            <Star className="w-4 h-4 fill-gold" /> Qualité Supérieure
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-primary">Un séjour d'exception garanti</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            La qualité de votre hébergement est primordiale pour la réussite de votre séjour. Que ce soit pour une Omra, un Hajj ou un voyage de loisirs, nous ne faisons aucun compromis sur votre confort.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Proximité immédiate du Haram",
                                "Petit-déjeuner buffet international inclus",
                                "Service de conciergerie 24/7",
                                "Chambres spacieuses et luxueuses",
                                "Wifi haut débit gratuit"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg">
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4 text-gold" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link href="/contact">
                            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 h-14 font-bold mt-4 shadow-xl shadow-primary/10">
                                Demander un devis
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 mt-8">
                            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop" className="rounded-2xl shadow-xl h-64 w-full object-cover" />
                            <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop" className="rounded-2xl shadow-xl h-80 w-full object-cover" />
                        </div>
                        <div className="space-y-4">
                            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4df85b?q=80&w=600&auto=format&fit=crop" className="rounded-2xl shadow-xl h-80 w-full object-cover" />
                            <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop" className="rounded-2xl shadow-xl h-64 w-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
