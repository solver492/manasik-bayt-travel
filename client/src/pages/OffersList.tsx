import { useRoute } from "wouter";
import { useOffers } from "@/hooks/use-offers";
import { useLanguage } from "@/lib/i18n";
import OfferCard from "@/components/OfferCard";
import { Loader2 } from "lucide-react";
import { AviasalesWidget } from "@/components/AviasalesWidget";

export default function OffersList() {
  const [match, params] = useRoute("/:category");
  const isTravelPage = params?.category === "travel";
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

        {/* Aviasales Widgets for Travel Page */}
        {isTravelPage && (
          <div className="mb-16 space-y-12">
            <div className="rounded-xl overflow-hidden shadow-lg border border-border bg-card">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="text-xl font-semibold text-primary">Explore Destinations</h2>
              </div>
              <AviasalesWidget 
                scriptSrc="https://tpwdg.com/content?currency=eur&trs=499992&shmarker=578528&lat=35.726288&lng=-5.912898&powered_by=true&search_host=www.aviasales.com%2Fsearch&locale=en&origin=TNG&value_min=0&value_max=1000000&round_trip=true&only_direct=false&radius=1&draggable=true&disable_zoom=false&show_logo=false&scrollwheel=false&primary=%230B2F08ff&secondary=%233FABDB&light=%23ffffff&width=1500&height=500&zoom=2&promo_id=4054&campaign_id=100" 
                className="w-full min-h-[500px]"
              />
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg border border-border bg-card">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="text-xl font-semibold text-primary">Search Flights</h2>
              </div>
              <AviasalesWidget 
                scriptSrc="https://tpwdg.com/content?currency=eur&trs=499992&shmarker=578528&color_button=%230A370Cff&target_host=search.jetradar.com&locale=ar&powered_by=true&origin=TNG&destination=DXB&with_fallback=true&non_direct_flights=true&min_lines=5&border_radius=10&color_background=%23FFFFFF&color_text=%23000000&color_border=%23FFFFFF&promo_id=2811&campaign_id=100" 
                className="w-full min-h-[400px]"
              />
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg border border-border bg-card">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="text-xl font-semibold text-primary">Hotel & Flight Search</h2>
              </div>
              <AviasalesWidget 
                scriptSrc="https://tpwdg.com/content?currency=eur&trs=499992&shmarker=578528&show_hotels=true&powered_by=true&locale=ar&searchUrl=search.jetradar.com&primary_override=%230A3B0Aff&color_button=%23153F0Cff&color_icons=%23051747ff&dark=%23262626&light=%23FDE2E2ff&secondary=%23ACB0ACff&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=true&plain=true&origin=TNG&destination=MED&promo_id=7879&campaign_id=100" 
                className="w-full min-h-[400px]"
              />
            </div>
          </div>
        )}

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
