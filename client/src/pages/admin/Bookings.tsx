import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Phone, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminBookings() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: bookings, isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/bookings"]
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const res = await apiRequest("PATCH", `/api/admin/bookings/${id}/status`, { status });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
            toast({ title: "Statut mis à jour" });
        },
        onError: () => {
            toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
        }
    });

    // Helper pour afficher le nom du client
    const getClientName = (booking: any) => {
        if (booking.contactName) return booking.contactName;
        if (booking.clientFirstName && booking.clientLastName) return `${booking.clientFirstName} ${booking.clientLastName}`;
        return booking.clientUsername || `Client #${booking.userId}`;
    };

    // Helper pour le téléphone
    const getPhone = (booking: any) => {
        return booking.contactPhone || booking.clientPhone;
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Toutes les Réservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Offre</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Voyageurs</TableHead>
                                        <TableHead>Prix Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings?.map((booking) => {
                                        const phone = getPhone(booking);
                                        const whatsappLink = phone ? `https://wa.me/${phone.replace(/\s+/g, '').replace('+', '')}` : null;

                                        return (
                                            <TableRow key={booking.id}>
                                                <TableCell>{booking.id}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{booking.offerTitle || `Offre #${booking.offerId}`}</span>
                                                        {booking.offerSlug && (
                                                            <a href={`/offer/${booking.offerSlug}`} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                                Voir l'offre <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{getClientName(booking)}</span>
                                                        {whatsappLink ? (
                                                            <a href={whatsappLink} target="_blank" className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-1">
                                                                <Phone className="w-3 h-3" /> {phone}
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Pas de numéro</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">{booking.travelersCount}</TableCell>
                                                <TableCell>{booking.totalPrice} MAD</TableCell>
                                                <TableCell>
                                                    <Select
                                                        defaultValue={booking.status}
                                                        onValueChange={(val) => updateStatusMutation.mutate({ id: booking.id, status: val })}
                                                    >
                                                        <SelectTrigger className={`w-[130px] h-8 text-xs font-bold uppercase rounded-full border-none ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-red-100 text-red-800'
                                                            }`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                                            <SelectItem value="completed">Completed</SelectItem>
                                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
