import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lock, ShieldCheck, Youtube, Download } from "lucide-react";

interface SelectionRow {
    id: string;
    role: "titulaire" | "suppleant";
    position: number;
    scoreFinal: number | null;
    fullName: string;
    gender: string;
    city: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    professionalStatus: string;
    videoUrl: string | null;
    topRank: number | null;
    triScore: number | null;
    marks: { reviewer: string; mark: string }[];
}

export default function AwsSelection() {
    const [keyInput, setKeyInput] = useState("");
    const [key, setKey] = useState("");

    const { data, isLoading, error } = useQuery<{ selection: SelectionRow[] }>({
        queryKey: ["/api/admin/aws-selection", key],
        enabled: !!key,
        retry: false,
        queryFn: async () => {
            const res = await fetch(`/api/admin/aws-selection?key=${encodeURIComponent(key)}`);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || "Accès refusé");
            }
            return res.json();
        },
    });

    const titulaires = (data?.selection || []).filter((r) => r.role === "titulaire");
    const suppleants = (data?.selection || []).filter((r) => r.role === "suppleant");

    const marksLabel = (r: SelectionRow) =>
        r.marks.map((m) => `${m.reviewer} ${m.mark === "bon" ? "👍" : m.mark === "revoir" ? "🤔" : "✖"}`).join(" · ");

    const exportCsv = () => {
        if (!data) return;
        const headers = ["Rôle", "N°", "Nom complet", "Sexe", "Date de naissance", "Ville", "Statut", "Rang Top100", "Score /100", "Score final", "Avis équipe", "Email", "Téléphone", "Vidéo"];
        const rows = (data.selection || []).map((r) => [
            r.role === "titulaire" ? "Titulaire" : "Suppléant", r.position, r.fullName, r.gender, r.dateOfBirth,
            r.city, r.professionalStatus, r.topRank ?? "", r.triScore ?? "", r.scoreFinal ?? "",
            marksLabel(r), r.email, r.phone, r.videoUrl || "",
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((c) => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Selection_25_5_AWS_reStart_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const table = (rows: SelectionRow[]) => (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>N°</TableHead>
                        <TableHead>Nom complet</TableHead>
                        <TableHead>Sexe</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Rang</TableHead>
                        <TableHead>Score final</TableHead>
                        <TableHead>Avis équipe</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Vidéo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell className="font-bold">{r.position}</TableCell>
                            <TableCell className="font-medium">{r.fullName}</TableCell>
                            <TableCell>{r.gender}</TableCell>
                            <TableCell className="text-sm">{r.professionalStatus}</TableCell>
                            <TableCell>{r.topRank ? <Badge variant="outline">⭐ {r.topRank}</Badge> : "—"}</TableCell>
                            <TableCell className="font-mono">{r.scoreFinal ?? ""}</TableCell>
                            <TableCell className="text-xs">{marksLabel(r) || "—"}</TableCell>
                            <TableCell className="text-sm">{r.phone}</TableCell>
                            <TableCell>
                                {r.videoUrl ? (
                                    <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-red-600 hover:underline text-sm">
                                        <Youtube className="w-4 h-4" /> Voir
                                    </a>
                                ) : "—"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/20 py-12">
            <SEOHead
                title="Sélection finale (privé) | SAYC Tchad"
                description="Espace privé de validation."
                path="/aws-selection"
            />
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 mb-4">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Espace privé — Représentant National</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Proposition de sélection 25 + 5</h1>
                    <p className="text-muted-foreground">AWS re/Start N'Djamena 2026 — document de travail confidentiel, non validé</p>
                </div>

                {!data && (
                    <Card className="max-w-md mx-auto">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Lock className="w-7 h-7 text-primary" />
                            </div>
                            <CardTitle>Accès restreint</CardTitle>
                            <CardDescription>Cette page est réservée au Représentant National. Entrez le mot de passe administrateur.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Mot de passe administrateur"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") setKey(keyInput.trim()); }}
                                className="h-12"
                            />
                            <Button className="w-full h-12 font-bold" onClick={() => setKey(keyInput.trim())} disabled={!keyInput.trim() || isLoading}>
                                {isLoading ? "Vérification..." : "Ouvrir la sélection"}
                            </Button>
                            {error && <p className="text-sm text-destructive text-center">{(error as Error).message}</p>}
                        </CardContent>
                    </Card>
                )}

                {data && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold">{titulaires.length}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Titulaires</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold">{suppleants.length}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Suppléants</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold">{titulaires.filter((r) => r.gender === "F").length}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Femmes (titulaires)</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold">{titulaires.filter((r) => ["Sans emploi", "Reconversion"].includes(r.professionalStatus)).length}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Sans emploi / reconv.</p>
                            </CardContent></Card>
                        </div>

                        <Card className="mb-8">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Titulaires (25)</CardTitle>
                                    <CardDescription>Classés par score final (score /100 + avis de l'équipe)</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={exportCsv}>
                                    <Download className="w-4 h-4 mr-2" /> Exporter
                                </Button>
                            </CardHeader>
                            <CardContent>{table(titulaires)}</CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Suppléants (5)</CardTitle>
                                <CardDescription>Sollicités dans l'ordre en cas de désistement</CardDescription>
                            </CardHeader>
                            <CardContent>{table(suppleants)}</CardContent>
                        </Card>

                        <p className="text-xs text-muted-foreground mt-6 text-center max-w-2xl mx-auto">
                            Document de travail strictement confidentiel. Cette proposition n'est pas validée : aucun candidat
                            ne doit être contacté avant l'examen et la validation de la liste par l'Ambassade des États-Unis.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
