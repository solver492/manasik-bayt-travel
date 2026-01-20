import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Users, BookOpen, ClipboardList, PlusCircle, LayoutDashboard, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const { data: clients, isLoading: clientsLoading } = useQuery<any[]>({ queryKey: ["/api/admin/clients"] });
    const { data: bookings, isLoading: bookingsLoading } = useQuery<any[]>({ queryKey: ["/api/admin/bookings"] });

    console.log("AdminDashboard Auth State:", { user, role: user?.role });

    if (!user || user.role !== 'admin') {
        return (
            <div className="p-8 text-center flex flex-col items-center gap-4">
                <div className="text-red-500 font-bold">Accès refusé. Vous devez être administrateur.</div>
                <div className="text-sm text-gray-500">Rôle actuel: {user?.role || "Non connecté"}</div>
                <Button onClick={() => window.location.href = "/auth"}>Retour à la connexion</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-primary">Manasik Admin</h2>
                </div>
                <nav className="px-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="secondary" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Tableau de bord
                        </Button>
                    </Link>
                    <Link href="/admin/clients">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Users className="h-4 w-4" />
                            Clients
                        </Button>
                    </Link>
                    <Link href="/admin/bookings">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <ClipboardList className="h-4 w-4" />
                            Réservations
                        </Button>
                    </Link>
                    <Link href="/admin/offers">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <BookOpen className="h-4 w-4" />
                            Offres & Articles
                        </Button>
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <Button variant="destructive" className="w-full gap-2" onClick={() => logout()}>
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Bonjour, {user.username}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clients?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">inscrits sur la plateforme</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">en attente de traitement</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Actions Rapides</CardTitle>
                            <PlusCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Link href="/admin/offers/new">
                                <Button size="sm" className="w-full">Nouvelle Offre</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Latest Bookings Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dernières Réservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bookings && bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.slice(0, 5).map((booking: any) => (
                                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Réservation #{booking.id}</p>
                                            <p className="text-sm text-muted-foreground">Status: {booking.status}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{booking.totalPrice} MAD</p>
                                            <p className="text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">Aucune réservation récente</p>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
