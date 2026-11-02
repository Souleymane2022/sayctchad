import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cloud, Lock, Users, Video, RefreshCw } from "lucide-react";

interface TrackingRow {
    fullName: string;
    gender: string;
    city: string;
    professionalStatus: string;
    status: string;
    hasVideo: boolean;
    hasPhoto: boolean;
    createdAt: string | null;
}

interface TrackingData {
    stats: { total: number; femmes: number; hommes: number; avecVideo: number };
    applications: TrackingRow[];
}

export default function AwsTracking() {
    const initialCode = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("code") || ""
        : "";
    const [codeInput, setCodeInput] = useState(initialCode);
    const [code, setCode] = useState(initialCode);

    const { data, isLoading, error, refetch, isFetching } = useQuery<TrackingData>({
        queryKey: ["/api/aws-tracking", code],
        enabled: !!code,
        retry: false,
        queryFn: async () => {
            const res = await fetch(`/api/aws-tracking?code=${encodeURIComponent(code)}`);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || "Accès refusé");
            }
            return res.json();
        },
    });

    return (
        <div className="min-h-screen bg-muted/20 py-12">
            <SEOHead
                title="Suivi des candidatures AWS re/Start | SAYC Tchad"
                description="Tableau de suivi en lecture seule des candidatures AWS re/Start N'Djamena."
                path="/aws-suivi"
            />
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/30 mb-4">
                        <Cloud className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Chad Cloud Talent — AWS re/Start</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Suivi des Candidatures</h1>
                    <p className="text-muted-foreground">Tableau de bord en lecture seule — réservé aux partenaires du programme</p>
                </div>

                {!data && (
                    <Card className="max-w-md mx-auto">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                                <Lock className="w-7 h-7 text-accent" />
                            </div>
                            <CardTitle>Accès partenaire</CardTitle>
                            <CardDescription>Saisissez le code d'accès qui vous a été communiqué par SAYC Tchad.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Code d'accès"
                                value={codeInput}
                                onChange={(e) => setCodeInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") setCode(codeInput.trim()); }}
                                className="h-12"
                            />
                            <Button className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold" onClick={() => setCode(codeInput.trim())} disabled={!codeInput.trim() || isLoading}>
                                {isLoading ? "Vérification..." : "Accéder au suivi"}
                            </Button>
                            {error && <p className="text-sm text-destructive text-center">{(error as Error).message}</p>}
                        </CardContent>
                    </Card>
                )}

                {data && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card><CardContent className="pt-6 text-center">
                                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                                <p className="text-3xl font-bold text-foreground">{data.stats.total}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Candidatures</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold text-foreground mt-8 md:mt-0">{data.stats.femmes}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Femmes</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold text-foreground mt-8 md:mt-0">{data.stats.hommes}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Hommes</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <Video className="w-6 h-6 text-accent mx-auto mb-2" />
                                <p className="text-3xl font-bold text-foreground">{data.stats.avecVideo}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Avec vidéo</p>
                            </CardContent></Card>
                        </div>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Liste des candidatures</CardTitle>
                                    <CardDescription>Candidatures du 3 au 13 novembre 2026 — mise à jour en temps réel</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
                                    Actualiser
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom complet</TableHead>
                                                <TableHead>Sexe</TableHead>
                                                <TableHead>Ville</TableHead>
                                                <TableHead>Statut professionnel</TableHead>
                                                <TableHead>Vidéo</TableHead>
                                                <TableHead>Photo</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.applications.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                        Aucune candidature pour le moment — l'appel est ouvert du 3 au 13 novembre 2026.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                data.applications.map((a, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="font-medium">{a.fullName}</TableCell>
                                                        <TableCell>{a.gender}</TableCell>
                                                        <TableCell>{a.city}</TableCell>
                                                        <TableCell className="text-xs">{a.professionalStatus}</TableCell>
                                                        <TableCell>{a.hasVideo ? "✔" : "—"}</TableCell>
                                                        <TableCell>{a.hasPhoto ? "✔" : "—"}</TableCell>
                                                        <TableCell className="text-xs">{a.createdAt ? new Date(a.createdAt).toLocaleString("fr-FR") : ""}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Consultation en lecture seule. Les coordonnées complètes et les dossiers détaillés sont gérés par SAYC Tchad
                                    et partagés avec les partenaires lors de la présélection.
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
