import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    offerTitle: string;
    offerId: number;
}

interface BookingFormData {
    contactName: string;
    contactPhone: string;
    contactAddress?: string;
    travelersCount: number;
    specialRequests?: string;
}

export default function BookingModal({ isOpen, onClose, offerTitle, offerId }: BookingModalProps) {
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormData>({
        defaultValues: {
            travelersCount: 1
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: BookingFormData) => {
            const res = await apiRequest("POST", "/api/bookings", {
                ...data,
                offerId,
                totalPrice: 0, // Prix calculé côté serveur ou ignoré pour la pré-réservation simple
                status: "pending"
            });
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Réservation envoyée !",
                description: "Bientôt un de nos agents va vous rappeler pour confirmer votre réservation.",
                className: "bg-green-600 text-white"
            });
            reset();
            onClose();
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue.",
                variant: "destructive"
            });
        }
    });

    const onSubmit = (data: BookingFormData) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white text-left font-sans">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-primary">Compléter la réservation</DialogTitle>
                    <DialogDescription>
                        Pour l'offre : <span className="font-semibold text-gold">{offerTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contactName">Nom et Prénom *</Label>
                            <Input
                                id="contactName"
                                placeholder="Ex: Mohammed Amine"
                                {...register("contactName", { required: "Ce champ est requis" })}
                            />
                            {errors.contactName && <span className="text-red-500 text-sm">{errors.contactName.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="contactPhone">Numéro de Téléphone *</Label>
                            <Input
                                id="contactPhone"
                                type="tel"
                                placeholder="Ex: 06 12 34 56 78"
                                {...register("contactPhone", { required: "Ce champ est requis" })}
                            />
                            {errors.contactPhone && <span className="text-red-500 text-sm">{errors.contactPhone.message}</span>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="contactAddress">Adresse (Optionnel)</Label>
                            <Input
                                id="contactAddress"
                                placeholder="Votre adresse"
                                {...register("contactAddress")}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="travelersCount">Nombre de voyageurs</Label>
                            <Input
                                id="travelersCount"
                                type="number"
                                min={1}
                                {...register("travelersCount", { valueAsNumber: true })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="specialRequests">Messages ou Demandes Spéciales (Optionnel)</Label>
                            <Textarea
                                id="specialRequests"
                                placeholder="Allergies, accessibilité..."
                                {...register("specialRequests")}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Annuler
                        </Button>
                        <Button type="submit" className="bg-gold hover:bg-gold/90 text-primary-foreground min-w-[150px]" disabled={mutation.isPending}>
                            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Confirmer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
