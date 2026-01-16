import { Offer } from "@shared/schema";
import { Link } from "wouter";
import { Clock, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export default function OfferCard({ offer }: { offer: Offer }) {
  const { t } = useLanguage();
  
  return (
    <div className="group relative flex flex-col bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={offer.imageUrl} 
          alt={offer.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {offer.isFeatured && (
             <span className="bg-gold text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
               Featured
             </span>
           )}
           <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
             {offer.type}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-xl font-bold text-primary group-hover:text-gold transition-colors line-clamp-2">
            {offer.title}
          </h3>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">
          {offer.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gold" />
            <span>{offer.durationDays} Days</span>
          </div>
          <div className="flex items-center gap-1.5">
             <Users className="w-4 h-4 text-gold" />
             <span>Group / Family</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase">{t("booking.price")}</span>
            <span className="font-serif font-bold text-lg text-primary">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: offer.currency }).format(offer.price)}
            </span>
          </div>
          
          <Link 
            href={`/offer/${offer.id}`} 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
