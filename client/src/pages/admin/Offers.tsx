import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminOffers() {
    const { data: offers, isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/offers"]
    });
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/admin/offers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/offers"] });
            toast({ title: "Offre supprimée" });
        },
        onError: () => {
            toast({ title: "Erreur lors de la suppression", variant: "destructive" });
        }
    });

    const toggleVisibilityMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("POST", `/api/admin/offers/${id}/toggle-visibility`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/offers"] });
            toast({ title: "Visibilité modifiée" });
        },
        onError: () => {
            toast({ title: "Erreur lors de la modification", variant: "destructive" });
        }
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestion des Offres</h1>
                    </div>
                    <Link href="/admin/offers/new">
                        <Button className="gap-2 w-full sm:w-auto">
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
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="hidden md:table-cell">ID</TableHead>
                                            <TableHead>Titre</TableHead>
                                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                                            <TableHead className="hidden lg:table-cell">Prix</TableHead>
                                            <TableHead className="hidden lg:table-cell">Durée</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {offers?.map((offer) => (
                                            <TableRow key={offer.id} className={!offer.isVisible ? "opacity-50" : ""}>
                                                <TableCell className="hidden md:table-cell">{offer.id}</TableCell>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        {offer.title}
                                                        <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                                            {offer.price} {offer.currency} • {offer.durationDays}j
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <span className="capitalize bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                                                        {offer.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">{offer.price} {offer.currency}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{offer.durationDays} jours</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 md:gap-2">
                                                        <Link href={`/admin/offers/${offer.id}/edit`}>
                                                            <Button variant="ghost" size="icon" title="Modifier">
                                                                <Edit className="h-4 w-4 text-blue-600" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => toggleVisibilityMutation.mutate(offer.id)}
                                                            title={offer.isVisible ? "Masquer" : "Afficher"}
                                                        >
                                                            {offer.isVisible ? (
                                                                <Eye className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteMutation.mutate(offer.id)}
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
