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

interface ChoiceRow {
    id: string;
    choice: "in" | "out";
    fullName: string;
    gender: string;
    professionalStatus: string;
    topRank: number | null;
}

interface CandidateRow {
    id: string;
    fullName: string;
    gender: string;
    city: string;
    professionalStatus: string;
    topRank: number | null;
    triScore: number | null;
    videoUrl: string | null;
}

export default function AwsSelection() {
    const [keyInput, setKeyInput] = useState("");
    const [key, setKey] = useState("");

    const { data, isLoading, error, refetch } = useQuery<{ selection: SelectionRow[]; choices?: ChoiceRow[] }>({
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
    const choices = data?.choices || [];
    const choiceOf = (id: string) => choices.find((c) => c.id === id)?.choice || "";

    const [searchQ, setSearchQ] = useState("");
    const [results, setResults] = useState<CandidateRow[]>([]);
    const [searching, setSearching] = useState(false);
    const [savingChoice, setSavingChoice] = useState(false);

    const doSearch = async () => {
        if (searchQ.trim().length < 2) return;
        try {
            setSearching(true);
            const res = await fetch(`/api/admin/aws-candidates?key=${encodeURIComponent(key)}&q=${encodeURIComponent(searchQ.trim())}`);
            const body = await res.json();
            setResults(body.candidates || []);
        } catch {
            alert("Recherche impossible. Réessayez.");
        } finally {
            setSearching(false);
        }
    };

    const setChoice = async (id: string, choice: "in" | "out" | "") => {
        try {
            setSavingChoice(true);
            const res = await fetch(`/api/admin/aws-choice?key=${encodeURIComponent(key)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, choice }),
            });
            if (!res.ok) throw new Error();
            await refetch();
        } catch {
            alert("Impossible d'enregistrer le choix. Réessayez.");
        } finally {
            setSavingChoice(false);
        }
    };

    const marksLabel = (r: SelectionRow) =>
        r.marks.map((m) => `${m.reviewer} ${m.mark === "bon" ? "👍" : m.mark === "revoir" ? "🤔" : "✖"}`).join(" · ");

    // Lien WhatsApp avec le message de notification pré-rempli
    const waLink = (r: SelectionRow) => {
        let num = (r.phone || "").replace(/\D/g, "");
        if (num.length === 8) num = "235" + num;
        if (num.startsWith("00")) num = num.slice(2);
        const fem = r.gender === "F";
        const texte = `🎉 Félicitations ${r.fullName.trim()} !

Suite à ta candidature au programme AWS re/Start — Chad Cloud Talent N'Djamena 2026, nous avons le plaisir de te confirmer que tu fais partie des 25 candidats retenus.

Merci de CONFIRMER par retour de ce message, avant le samedi 21 novembre à 18h :
1️⃣ que tu es bien présent${fem ? "e" : ""} à N'Djamena et disponible à plein temps du 23 novembre 2026 au 19 février 2027 ;
2️⃣ que tu disposes d'une pièce d'identité valide.
Sans confirmation dans ce délai, ta place pourra être attribuée à un suppléant.

⚠️ Consignes pour le premier jour (mardi 24 novembre 2026) :
• Présence à 9h30 précises à la réception de l'Ambassade des États-Unis à N'Djamena (formalités de sécurité) ;
• Pièce d'identité valide obligatoire ;
• Téléphones et appareils électroniques interdits à l'intérieur : ils seront déposés à la réception pendant la durée du programme.

Encore félicitations ! 🙌
Smart Africa Youth Chapter Tchad — sayctchad.org`;
        return `https://wa.me/${num}?text=${encodeURIComponent(texte)}`;
    };

    // Rectificatif : le rendez-vous est le mardi 24 novembre, pas le lundi 23
    const waRectifLink = (r: SelectionRow) => {
        let num = (r.phone || "").replace(/\D/g, "");
        if (num.length === 8) num = "235" + num;
        if (num.startsWith("00")) num = num.slice(2);
        const texte = `⚠️ RECTIFICATIF IMPORTANT — AWS re/Start

Bonjour ${r.fullName.trim()},

Une correction concernant notre précédent message : le rendez-vous du premier jour aura lieu le MARDI 24 NOVEMBRE 2026 à 9h30 précises à la réception de l'Ambassade des États-Unis à N'Djamena — et NON le lundi 23 novembre.

Les autres consignes restent inchangées (pièce d'identité valide, téléphones déposés à la réception).

Merci de répondre « Bien reçu » pour confirmer.

Smart Africa Youth Chapter Tchad — sayctchad.org`;
        return `https://wa.me/${num}?text=${encodeURIComponent(texte)}`;
    };

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
                        <TableHead>Notifier</TableHead>
                        <TableHead>Vidéo</TableHead>
                        <TableHead>Mon choix</TableHead>
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
                                {r.role === "titulaire" ? (
                                    <div className="flex flex-col gap-1">
                                        <a href={waLink(r)} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full">
                                                📱 WhatsApp
                                            </Button>
                                        </a>
                                        <a href={waRectifLink(r)} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm" variant="outline" className="text-amber-700 border-amber-500/50 whitespace-nowrap w-full">
                                                ⚠️ Rectif. 24 nov.
                                            </Button>
                                        </a>
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground">Après désistement</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {r.videoUrl ? (
                                    <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-red-600 hover:underline text-sm">
                                        <Youtube className="w-4 h-4" /> Voir
                                    </a>
                                ) : "—"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="sm"
                                    variant={choiceOf(r.id) === "out" ? "destructive" : "outline"}
                                    disabled={savingChoice}
                                    onClick={() => setChoice(r.id, choiceOf(r.id) === "out" ? "" : "out")}
                                >
                                    {choiceOf(r.id) === "out" ? "🗑 À remplacer ✓" : "À remplacer"}
                                </Button>
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

                        <Card className="mt-8 border-accent/40">
                            <CardHeader>
                                <CardTitle>⭐ Mon choix — personnes qui méritent une place</CardTitle>
                                <CardDescription>
                                    Cherchez n'importe quel candidat parmi les 1 678 et marquez-le « Mérite une place ».
                                    Sur les listes ci-dessus, marquez « À remplacer » ceux qui doivent sortir.
                                    Vos choix sont enregistrés : revenez ensuite vers Claude pour appliquer les remplacements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Nom, email ou téléphone du candidat…"
                                        value={searchQ}
                                        onChange={(e) => setSearchQ(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
                                    />
                                    <Button onClick={doSearch} disabled={searching || searchQ.trim().length < 2}>
                                        {searching ? "…" : "Chercher"}
                                    </Button>
                                </div>

                                {results.length > 0 && (
                                    <div className="rounded-md border overflow-x-auto">
                                        <Table>
                                            <TableBody>
                                                {results.map((c) => (
                                                    <TableRow key={c.id}>
                                                        <TableCell className="font-medium">{c.fullName}</TableCell>
                                                        <TableCell>{c.gender}</TableCell>
                                                        <TableCell className="text-sm">{c.professionalStatus}</TableCell>
                                                        <TableCell>{c.topRank ? <Badge variant="outline">⭐ {c.topRank}</Badge> : "—"}</TableCell>
                                                        <TableCell className="font-mono text-sm">{c.triScore ?? ""}</TableCell>
                                                        <TableCell>
                                                            {c.videoUrl && (
                                                                <a href={c.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-red-600 hover:underline text-sm">
                                                                    <Youtube className="w-4 h-4" /> Voir
                                                                </a>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                variant={choiceOf(c.id) === "in" ? "default" : "outline"}
                                                                className={choiceOf(c.id) === "in" ? "bg-green-600 hover:bg-green-700" : ""}
                                                                disabled={savingChoice}
                                                                onClick={() => setChoice(c.id, choiceOf(c.id) === "in" ? "" : "in")}
                                                            >
                                                                {choiceOf(c.id) === "in" ? "⭐ Mérite une place ✓" : "⭐ Mérite une place"}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}

                                {choices.length > 0 && (
                                    <div className="rounded-lg border bg-muted/20 p-4">
                                        <p className="text-sm font-bold mb-2">Mes choix en attente ({choices.length}) :</p>
                                        <div className="space-y-1">
                                            {choices.map((c) => (
                                                <div key={c.id} className="flex items-center justify-between gap-2 text-sm">
                                                    <span>
                                                        {c.choice === "in" ? "⭐ À intégrer : " : "🗑 À remplacer : "}
                                                        <span className="font-medium">{c.fullName}</span>
                                                        {c.topRank ? ` (rang ${c.topRank})` : ""}
                                                    </span>
                                                    <Button size="sm" variant="ghost" disabled={savingChoice} onClick={() => setChoice(c.id, "")}>
                                                        Annuler
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-3">
                                            Quand vos choix sont faits, dites simplement à Claude : « Applique mes choix » —
                                            il remplacera les sortants par vos entrants en gardant les équilibres.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
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
