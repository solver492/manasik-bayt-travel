import { useRoute, Link } from "wouter";
import { useOffer } from "@/hooks/use-offers";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Calendar, MapPin, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Schema for booking form
const bookingFormSchema = z.object({
  travelersCount: z.coerce.number().min(1, "Minimum 1 traveler"),
  specialRequests: z.string().optional(),
});

export default function OfferDetails() {
  const [, params] = useRoute("/offer/:id");
  const id = parseInt(params?.id || "0");
  const { data: offer, isLoading } = useOffer(id);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      travelersCount: 1,
      specialRequests: "",
    },
  });

  const onSubmit = (data: z.infer<typeof bookingFormSchema>) => {
    if (!offer) return;
    
    createBooking.mutate({
      userId: user!.id,
      offerId: offer.id,
      travelersCount: data.travelersCount,
      totalPrice: offer.price * data.travelersCount,
      specialRequests: data.specialRequests,
    }, {
      onSuccess: () => {
        setOpen(false);
        toast({
          title: "Booking Confirmed!",
          description: "Your request has been sent. Check your dashboard.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create booking. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!offer) return <div className="p-20 text-center">Offer not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh]">
        <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto">
             <span className="bg-gold text-primary-foreground px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">
               {offer.type}
             </span>
             <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4">{offer.title}</h1>
             <div className="flex items-center gap-6 text-primary/80">
                <div className="flex items-center gap-2">
                   <Calendar className="w-5 h-5 text-gold" />
                   <span className="font-medium">{offer.durationDays} Days</span>
                </div>
                <div className="flex items-center gap-2">
                   <MapPin className="w-5 h-5 text-gold" />
                   <span className="font-medium">Mecca & Medina</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Overview</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {offer.description}
            </p>
          </div>

          {/* Program Itinerary */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Program Itinerary</h2>
            <div className="space-y-4">
              {offer.program.map((day: any, i: number) => (
                <div key={i} className="border border-border rounded-xl p-6 hover:border-gold/50 transition-colors bg-card">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold font-serif">
                       {day.day}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{day.title}</h3>
                      <p className="text-muted-foreground">{day.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-xl shadow-black/5">
            <div className="mb-6">
               <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Price per person</p>
               <div className="flex items-end gap-2">
                 <span className="text-4xl font-serif font-bold text-primary">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: offer.currency }).format(offer.price)}
                 </span>
               </div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="flex items-center gap-3 text-sm">
                 <CheckCircle2 className="w-5 h-5 text-green-500" />
                 <span>Visa processing included</span>
               </div>
               <div className="flex items-center gap-3 text-sm">
                 <CheckCircle2 className="w-5 h-5 text-green-500" />
                 <span>5-Star accommodation</span>
               </div>
               <div className="flex items-center gap-3 text-sm">
                 <CheckCircle2 className="w-5 h-5 text-green-500" />
                 <span>Direct flights</span>
               </div>
            </div>

            {user ? (
               <Dialog open={open} onOpenChange={setOpen}>
                 <DialogTrigger asChild>
                   <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                     {t("booking.book")}
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-md">
                   <DialogHeader>
                     <DialogTitle className="font-serif text-2xl">Complete Booking</DialogTitle>
                   </DialogHeader>
                   <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                       <FormField
                         control={form.control}
                         name="travelersCount"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Number of Travelers</FormLabel>
                             <FormControl>
                               <Input type="number" min={1} {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="specialRequests"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Special Requests (Optional)</FormLabel>
                             <FormControl>
                               <Textarea placeholder="Dietary restrictions, wheelchair access, etc." {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       
                       <div className="pt-4 border-t border-border flex justify-between items-center">
                          <span className="font-bold">Total:</span>
                          <span className="text-xl font-bold text-primary">
                             {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: offer.currency }).format(offer.price * form.watch('travelersCount'))}
                          </span>
                       </div>

                       <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-primary-foreground" disabled={createBooking.isPending}>
                         {createBooking.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Reservation"}
                       </Button>
                     </form>
                   </Form>
                 </DialogContent>
               </Dialog>
            ) : (
              <Button asChild className="w-full h-12 text-lg font-semibold" variant="outline">
                <a href="/api/login">Login to Book</a>
              </Button>
            )}
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Free cancellation up to 7 days before departure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
