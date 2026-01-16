import { useAuth } from "@/hooks/use-auth";
import { useMyBookings } from "@/hooks/use-bookings";
import { useLanguage } from "@/lib/i18n";
import { Loader2, Ticket, Award, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings();
  const { t } = useLanguage();

  if (authLoading || bookingsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-serif">Please login to view dashboard</h2>
        <Button asChild><a href="/api/login">Login</a></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
           <h1 className="text-4xl font-serif font-bold text-primary">My Dashboard</h1>
           <Button variant="ghost" className="text-destructive hover:text-destructive/80" onClick={() => logout()}>
             <LogOut className="w-4 h-4 mr-2" /> {t("auth.logout")}
           </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Profile Card */}
           <div className="lg:col-span-1 space-y-8">
             <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <div className="flex flex-col items-center text-center">
                   <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-serif font-bold mb-4">
                      {user.username.charAt(0).toUpperCase()}
                   </div>
                   <h2 className="text-xl font-bold mb-1">{user.username}</h2>
                   <p className="text-muted-foreground text-sm mb-6">{user.email}</p>
                   
                   <div className="w-full bg-muted/50 rounded-xl p-4 flex items-center justify-between mb-4">
                      <div className="flex flex-col items-start">
                         <span className="text-xs text-muted-foreground uppercase tracking-wide">Level</span>
                         <span className="font-bold text-primary capitalize">{user.level}</span>
                      </div>
                      <Award className={`w-8 h-8 ${user.level === 'gold' ? 'text-yellow-500' : 'text-slate-400'}`} />
                   </div>
                   
                   <div className="w-full bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex flex-col items-start">
                         <span className="text-xs text-muted-foreground uppercase tracking-wide">Points</span>
                         <span className="font-bold text-primary">{user.points} pts</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.points < 1000 ? `${1000 - user.points} to Silver` : "Max Level"}
                      </div>
                   </div>
                </div>
             </div>
           </div>

           {/* Bookings */}
           <div className="lg:col-span-2">
              <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                 <Ticket className="w-6 h-6 text-gold" />
                 My Bookings
              </h3>
              
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                   {bookings.map((booking: any) => (
                      <div key={booking.id} className="bg-card rounded-xl border border-border p-6 flex flex-col md:flex-row gap-6 items-center hover:border-gold/30 transition-colors shadow-sm">
                         <div className="flex-grow text-center md:text-left">
                            <h4 className="font-bold text-lg mb-1">Booking #{booking.id}</h4>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                               <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                               <span>•</span>
                               <span>{booking.travelersCount} Travelers</span>
                               <span>•</span>
                               <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(booking.totalPrice)}</span>
                            </div>
                         </div>
                         <div>
                            <span className={`
                               px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                               ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                 booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                 'bg-red-100 text-red-700'}
                            `}>
                               {booking.status}
                            </span>
                         </div>
                      </div>
                   ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border border-dashed p-12 text-center">
                   <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-muted-foreground" />
                   </div>
                   <h4 className="text-lg font-bold mb-2">No bookings yet</h4>
                   <p className="text-muted-foreground mb-6">Start your spiritual journey today.</p>
                   <Link href="/omra">
                     <Button>Browse Offers</Button>
                   </Link>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
