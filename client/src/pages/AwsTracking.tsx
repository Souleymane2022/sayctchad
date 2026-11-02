import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Cloud, Lock, Users, Video, RefreshCw, Youtube, Camera, Download, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const decisionBadge = (status: string) => {
    if (status === "approved") return <Badge className="bg-green-500/15 text-green-700 border border-green-500/30 hover:bg-green-500/15">Favorable</Badge>;
    if (status === "rejected") return <Badge className="bg-red-500/10 text-red-700 border border-red-500/30 hover:bg-red-500/10">Défavorable</Badge>;
    return <Badge variant="outline">En attente</Badge>;
};

interface TrackingRow {
    id: string;
    fullName: string;
    gender: string;
    city: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    professionalStatus: string;
    status: string;
    videoUrl: string | null;
    hasPhoto: boolean;
    motivation: string;
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

    const photoSrc = (id: string) => `/api/aws-tracking/${id}/photo?code=${encodeURIComponent(code)}`;
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const setDecision = async (id: string, status: "pending" | "approved" | "rejected") => {
        try {
            setUpdatingId(id);
            const res = await fetch(`/api/aws-tracking/${id}/status?code=${encodeURIComponent(code)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error();
            await refetch();
        } catch {
            alert("Impossible d'enregistrer la décision. Réessayez.");
        } finally {
            setUpdatingId(null);
        }
    };

    const exportToExcel = () => {
        if (!data) return;
        const headers = ["Nom Complet", "Sexe", "Date de Naissance", "Ville", "Statut Professionnel", "Email", "Téléphone", "Vidéo (YouTube)", "Photo", "Décision", "Motivation", "Date Candidature"];
        const decisionLabel = (s: string) => (s === "approved" ? "Favorable" : s === "rejected" ? "Défavorable" : "En attente");
        const rows = data.applications.map((a) => [
            a.fullName, a.gender, a.dateOfBirth, a.city, a.professionalStatus, a.email, a.phone,
            a.videoUrl || "", a.hasPhoto ? "Oui" : "Non", decisionLabel(a.status), a.motivation,
            a.createdAt ? new Date(a.createdAt).toLocaleString("fr-FR") : "",
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Candidatures_AWS_reStart_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-muted/20 py-12">
            <SEOHead
                title="Suivi des candidatures AWS re/Start | SAYC Tchad"
                description="Tableau de suivi en lecture seule des candidatures AWS re/Start N'Djamena."
                path="/aws-suivi"
            />
            <div className="container mx-auto px-4 max-w-6xl">
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
                                <p className="text-3xl font-bold text-foreground">{data.stats.femmes}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Femmes</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold text-foreground">{data.stats.hommes}</p>
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
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={exportToExcel} disabled={data.applications.length === 0}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Exporter Excel (CSV)
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                                        <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
                                        Actualiser
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Photo</TableHead>
                                                <TableHead>Nom complet</TableHead>
                                                <TableHead>Sexe</TableHead>
                                                <TableHead>Ville</TableHead>
                                                <TableHead>Vidéo</TableHead>
                                                <TableHead>Décision</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Dossier</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.applications.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                                        Aucune candidature pour le moment — l'appel est ouvert du 3 au 13 novembre 2026.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                data.applications.map((a) => (
                                                    <TableRow key={a.id}>
                                                        <TableCell>
                                                            {a.hasPhoto ? (
                                                                <img src={photoSrc(a.id)} alt={a.fullName} loading="lazy" className="w-10 h-10 rounded-lg object-cover border" />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Camera className="w-4 h-4" /></div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-medium">{a.fullName}</TableCell>
                                                        <TableCell>{a.gender}</TableCell>
                                                        <TableCell>{a.city}</TableCell>
                                                        <TableCell>
                                                            {a.videoUrl ? (
                                                                <a href={a.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-red-600 hover:underline text-sm font-medium">
                                                                    <Youtube className="w-4 h-4" /> Voir
                                                                </a>
                                                            ) : "—"}
                                                        </TableCell>
                                                        <TableCell>{decisionBadge(a.status)}</TableCell>
                                                        <TableCell className="text-xs">{a.createdAt ? new Date(a.createdAt).toLocaleDateString("fr-FR") : ""}</TableCell>
                                                        <TableCell>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" size="sm">Ouvrir</Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Dossier — {a.fullName}</DialogTitle>
                                                                    </DialogHeader>
                                                                    {a.hasPhoto && (
                                                                        <div className="flex justify-center py-2">
                                                                            <img src={photoSrc(a.id)} alt={a.fullName} className="w-32 h-32 rounded-xl object-cover border shadow-sm" />
                                                                        </div>
                                                                    )}
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                                                                        <div><Label className="text-xs text-muted-foreground">Sexe</Label><p className="text-sm font-medium">{a.gender === "F" ? "Féminin" : "Masculin"}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Date de naissance</Label><p className="text-sm font-medium">{a.dateOfBirth}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Ville</Label><p className="text-sm font-medium">{a.city}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Statut professionnel</Label><p className="text-sm font-medium">{a.professionalStatus}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Email</Label><p className="text-sm font-medium break-all">{a.email}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Téléphone (WhatsApp)</Label><p className="text-sm font-medium">{a.phone}</p></div>
                                                                        {a.videoUrl && (
                                                                            <div className="md:col-span-2">
                                                                                <Label className="text-xs text-muted-foreground">Vidéo de présentation (1 min)</Label>
                                                                                <p><a href={a.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-red-600 hover:underline text-sm font-medium"><Youtube className="w-4 h-4" /> Regarder sur YouTube</a></p>
                                                                            </div>
                                                                        )}
                                                                        <div className="md:col-span-2">
                                                                            <Label className="text-xs text-muted-foreground font-bold">Motivation</Label>
                                                                            <div className="text-sm bg-muted/30 p-4 rounded-lg border whitespace-pre-wrap leading-relaxed mt-1">{a.motivation}</div>
                                                                        </div>
                                                                        <div className="md:col-span-2 border-t pt-4">
                                                                            <Label className="text-xs text-muted-foreground font-bold">Décision sur ce dossier</Label>
                                                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                                                {decisionBadge(a.status)}
                                                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={updatingId === a.id} onClick={() => setDecision(a.id, "approved")}>
                                                                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Favorable
                                                                                </Button>
                                                                                <Button size="sm" variant="destructive" disabled={updatingId === a.id} onClick={() => setDecision(a.id, "rejected")}>
                                                                                    <XCircle className="w-4 h-4 mr-1" /> Défavorable
                                                                                </Button>
                                                                                <Button size="sm" variant="outline" disabled={updatingId === a.id} onClick={() => setDecision(a.id, "pending")}>
                                                                                    <RotateCcw className="w-4 h-4 mr-1" /> En attente
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Accès réservé aux partenaires du programme Chad Cloud Talent. Seule la décision sur
                                    chaque dossier peut être modifiée. Merci de traiter ces données personnelles de façon confidentielle.
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
