import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function EditOffer() {
    const { id } = useParams();
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: offer, isLoading } = useQuery<any>({
        queryKey: [`/api/offers/${id}`],
        enabled: !!id
    });

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        type: "manasik",
        subtype: "",
        description: "",
        price: "",
        durationDays: "",
        imageUrl: "",
    });

    useEffect(() => {
        if (offer) {
            setFormData({
                title: offer.title || "",
                slug: offer.slug || "",
                type: offer.type || "manasik",
                subtype: offer.subtype || "",
                description: offer.description || "",
                price: String(offer.price || ""),
                durationDays: String(offer.durationDays || ""),
                imageUrl: offer.imageUrl || "",
            });
        }
    }, [offer]);

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                ...data,
                price: Number(data.price),
                durationDays: Number(data.durationDays),
            };
            await apiRequest("PATCH", `/api/admin/offers/${id}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/offers"] });
            queryClient.invalidateQueries({ queryKey: [`/api/offers/${id}`] });
            toast({ title: "Offre modifiée avec succès" });
            setLocation("/admin/offers");
        },
        onError: (e: any) => {
            toast({ title: "Erreur lors de la modification", description: e.message, variant: "destructive" });
        }
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (val: string) => {
        setFormData({ ...formData, type: val });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-50/50 p-8 flex items-center justify-center">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-4 md:space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/offers">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Modifier l'offre</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Détails de l'offre</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre</Label>
                                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL unique)</Label>
                                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select onValueChange={handleSelectChange} value={formData.type}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner le type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="manasik">Manasik (Omra/Hajj)</SelectItem>
                                            <SelectItem value="touristique">Touristique</SelectItem>
                                            <SelectItem value="organise">Organisé</SelectItem>
                                            <SelectItem value="pack">Pack</SelectItem>
                                            <SelectItem value="hotel">Hôtel</SelectItem>
                                            <SelectItem value="car_rental">Location Voiture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Prix (MAD)</Label>
                                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="durationDays">Durée (Jours)</Label>
                                    <Input id="durationDays" name="durationDays" type="number" value={formData.durationDays} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">URL Image</Label>
                                <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                            </div>

                            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Modification..." : "Modifier l'offre"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
