import { useRoute } from "wouter";
import { useOffers } from "@/hooks/use-offers";
import { useLanguage } from "@/lib/i18n";
import OfferCard from "@/components/OfferCard";
import { Loader2 } from "lucide-react";

export default function OffersList() {
  const [match, params] = useRoute("/:category");
  const category = params?.category === "omra" ? "manasik" : 
                   params?.category === "travel" ? "touristique" : 
                   params?.category === "packs" ? "pack" : undefined;

  const { data: offers, isLoading } = useOffers({ type: category });
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 capitalize">
             {params?.category || "All Offers"}
           </h1>
           <p className="text-muted-foreground text-lg">
             Explore our exclusive selection of {params?.category} packages designed for your comfort and spiritual peace.
           </p>
        </div>

        {/* Grid */}
        {isLoading ? (
           <div className="flex justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-gold" />
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers?.map((offer) => (
                 <OfferCard key={offer.id} offer={offer} />
              ))}
              {offers?.length === 0 && (
                 <div className="col-span-full text-center py-20 text-muted-foreground">
                    No offers found in this category yet.
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
}
