import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CreateOffer() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        type: "manasik",
        subtype: "",
        description: "",
        price: "",
        durationDays: "",
        imageUrl: "",
        program: [] as { day: number, title: string, desc: string }[] // Simplified for now
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            // Simple program for demo
            const payload = {
                ...data,
                price: Number(data.price),
                durationDays: Number(data.durationDays),
                program: [{ day: 1, title: "Début", desc: "Début du programme" }]
            };
            await apiRequest("POST", "/api/admin/offers", payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
            toast({ title: "Offre créée avec succès" });
            setLocation("/admin/offers");
        },
        onError: (e: any) => {
            toast({ title: "Erreur lors de la création", description: e.message, variant: "destructive" });
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
        createMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/offers">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Nouvelle Offre</h1>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL unique)</Label>
                                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select onValueChange={handleSelectChange} defaultValue={formData.type}>
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

                            <div className="grid grid-cols-2 gap-4">
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

                            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Création..." : "Créer l'offre"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
