import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2000&auto=format&fit=crop"
                        alt="Contact background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm" />
                </div>

                <div className="container relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-white mb-4"
                    >
                        {t("nav.contact")}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl mx-auto"
                    >
                        Nous sommes à votre écoute pour organiser votre prochain voyage d'exception.
                    </motion.p>
                </div>
            </section>

            <section className="container mx-auto px-4 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-white/20">
                            <h3 className="text-2xl font-serif font-bold text-primary mb-8">Informations de contact</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Téléphone</p>
                                        <p className="text-lg font-medium">+213 (0) 555 123 456</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Email</p>
                                        <p className="text-lg font-medium">contact@manasikbayt.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Adresse</p>
                                        <p className="text-lg font-medium">123 Rue de la Liberté, Alger, Algérie</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-border">
                                <h4 className="font-bold mb-4">Suivez-nous</h4>
                                <div className="flex gap-4">
                                    {['Facebook', 'Instagram', 'WhatsApp'].map((social) => (
                                        <button key={social} className="px-4 py-2 rounded-xl bg-muted hover:bg-gold hover:text-white transition-colors text-sm font-medium">
                                            {social}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-white/20">
                            <h2 className="text-3xl font-serif font-bold text-primary mb-8">Envoyez-nous un message</h2>

                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Nom Complet</label>
                                        <Input placeholder="Votre nom" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-gold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Email</label>
                                        <Input type="email" placeholder="votre@email.com" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-gold" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1">Sujet</label>
                                    <Input placeholder="De quoi souhaitez-vous discuter ?" className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-gold" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1">Message</label>
                                    <Textarea
                                        placeholder="Écrivez votre message ici..."
                                        className="min-h-[150px] rounded-xl bg-muted/30 border-none focus-visible:ring-gold resize-none"
                                    />
                                </div>

                                <Button className="w-full h-14 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-gold text-white font-bold rounded-xl shadow-lg shadow-gold/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Envoyer le Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
