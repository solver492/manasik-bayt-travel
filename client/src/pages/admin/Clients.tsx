import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Mail, Phone, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminClients() {
    const { data: clients, isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/clients"]
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Clients ({clients?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div>Chargement...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Utilisateur</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Prénom & Nom</TableHead>
                                        <TableHead>Téléphone</TableHead>
                                        <TableHead>Points</TableHead>
                                        <TableHead>Niveau</TableHead>
                                        <TableHead>Inscrit le</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients?.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell>{client.id}</TableCell>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                {client.username}
                                            </TableCell>
                                            <TableCell>{client.email}</TableCell>
                                            <TableCell>{client.firstName} {client.lastName}</TableCell>
                                            <TableCell>
                                                {client.phone ? (
                                                    <a
                                                        href={`https://wa.me/${client.phone.replace(/\s+/g, '').replace('+', '')}`}
                                                        target="_blank"
                                                        className="flex items-center gap-2 hover:text-green-600 transition-colors"
                                                    >
                                                        <Phone className="h-4 w-4" />
                                                        {client.phone}
                                                    </a>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>{client.points}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${client.level === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                                                    client.level === 'silver' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-orange-50 text-orange-800'
                                                    }`}>
                                                    {client.level}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
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
