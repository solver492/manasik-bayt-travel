import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminOffers() {
    const { data: offers, isLoading } = useQuery<any[]>({
        queryKey: ["/api/offers"]
    });
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/admin/offers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
            toast({ title: "Offre supprimée" });
        },
        onError: () => {
            toast({ title: "Erreur lors de la suppression", variant: "destructive" });
        }
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des Offres</h1>
                    </div>
                    <Link href="/admin/offers/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nouvelle Offre
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Offres ({offers?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div>Chargement...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Titre</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Prix</TableHead>
                                        <TableHead>Durée</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {offers?.map((offer) => (
                                        <TableRow key={offer.id}>
                                            <TableCell>{offer.id}</TableCell>
                                            <TableCell className="font-medium">{offer.title}</TableCell>
                                            <TableCell>
                                                <span className="capitalize bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                                                    {offer.type}
                                                </span>
                                            </TableCell>
                                            <TableCell>{offer.price} {offer.currency}</TableCell>
                                            <TableCell>{offer.durationDays} jours</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(offer.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
