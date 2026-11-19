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

const TRI_LABELS: Record<string, string> = {
    A: "A — Dossier solide",
    B: "B — Dossier correct",
    C: "C — À vérifier",
};

const triBadge = (categorie?: string) => {
    if (categorie === "A") return <Badge className="bg-green-500/15 text-green-700 border border-green-500/30 hover:bg-green-500/15">A</Badge>;
    if (categorie === "B") return <Badge className="bg-yellow-500/15 text-yellow-700 border border-yellow-500/30 hover:bg-yellow-500/15">B</Badge>;
    if (categorie === "C") return <Badge className="bg-red-500/10 text-red-700 border border-red-500/30 hover:bg-red-500/10">C</Badge>;
    return null;
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
    age?: number | null;
    categorie?: "A" | "B" | "C";
    signalements?: string[];
    marks?: { reviewer: string; mark: string }[];
    topRank?: number | null;
    triScore?: number | null;
    videoStatus?: string | null;
    videoChannel?: string | null;
    videoTitle?: string | null;
    videoNote?: string | null;
}

interface TrackingData {
    stats: { total: number; femmes: number; hommes: number; avecVideo: number; triA?: number; triB?: number; triC?: number };
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
    const [triFilter, setTriFilter] = useState<"all" | "A" | "B" | "C" | "top" | "attente" | "mesbons" | "mesrevoir">("all");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"defaut" | "rang" | "score" | "nom" | "recent" | "ancien" | "age">("defaut");
    const [lot, setLot] = useState(0); // 0 = tous, 1..10 = lot de 15 dossiers classés
    const [reviewer, setReviewer] = useState<string>(() => {
        try { return localStorage.getItem("aws_reviewer") || ""; } catch { return ""; }
    });
    const [reviewIndex, setReviewIndex] = useState<number | null>(null); // mode revue
    const [savingMark, setSavingMark] = useState(false);

    const saveReviewer = (name: string) => {
        setReviewer(name);
        try { localStorage.setItem("aws_reviewer", name); } catch { /* privé */ }
    };

    const myMark = (a: TrackingRow) =>
        (a.marks || []).find((m) => m.reviewer.toLowerCase() === reviewer.trim().toLowerCase())?.mark || "";

    const markCounts = (a: TrackingRow) => {
        const c = { bon: 0, revoir: 0, non: 0 };
        for (const m of a.marks || []) if (m.mark in c) c[m.mark as keyof typeof c]++;
        return c;
    };

    const setMark = async (a: TrackingRow, mark: string) => {
        if (reviewer.trim().length < 2) {
            alert("Entrez d'abord votre prénom d'évaluateur (en haut de la liste).");
            return;
        }
        const newMark = myMark(a) === mark ? "" : mark; // re-cliquer retire l'avis
        try {
            setSavingMark(true);
            const res = await fetch(`/api/aws-tracking/${a.id}/mark?code=${encodeURIComponent(code)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewer: reviewer.trim(), mark: newMark }),
            });
            if (!res.ok) throw new Error();
            await refetch();
        } catch {
            alert("Impossible d'enregistrer l'avis. Réessayez.");
        } finally {
            setSavingMark(false);
        }
    };

    const videoEmbedId = (u: string | null | undefined) => {
        const m = /(?:youtu\.be\/|shorts\/|watch\?v=|live\/|embed\/)([\w-]{6,})/.exec((u || "").trim());
        return m ? m[1] : null;
    };

    // Lot d'évaluation (1-10), stable pour chaque dossier : les 150 classés
    // gardent leurs blocs de 15 (rangs 1-15 = lot 1, etc.), tous les autres
    // sont répartis équitablement d'après leur identifiant (même résultat
    // sur tous les appareils).
    const lotOf = (a: TrackingRow) => {
        const r = a.topRank ?? 0;
        if (r >= 1 && r <= 150) return Math.floor((r - 1) / 15) + 1;
        let h = 0;
        for (let i = 0; i < a.id.length; i++) h = (h * 31 + a.id.charCodeAt(i)) >>> 0;
        return (h % 10) + 1;
    };

    const nbTop = (data?.applications || []).filter((a) => (a.topRank ?? 0) >= 1 && (a.topRank ?? 0) <= 100).length;
    const nbAttente = (data?.applications || []).filter((a) => (a.topRank ?? 0) > 100).length;

    const normalize = (s: string | null | undefined) =>
        (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const q = normalize(search.trim());

    const visibleApplications = (data?.applications || [])
        .filter((a) => {
            if (triFilter === "top" && !((a.topRank ?? 0) >= 1 && (a.topRank ?? 0) <= 100)) return false;
            if (triFilter === "attente" && !((a.topRank ?? 0) > 100)) return false;
            if ((triFilter === "A" || triFilter === "B" || triFilter === "C") && a.categorie !== triFilter) return false;
            if (triFilter === "mesbons" && myMark(a) !== "bon") return false;
            if (triFilter === "mesrevoir" && myMark(a) !== "revoir") return false;
            if (lot > 0 && lotOf(a) !== lot) return false;
            if (!q) return true;
            return [a.fullName, a.email, a.phone, a.city, a.videoChannel, a.videoTitle, a.professionalStatus]
                .some((f) => normalize(f).includes(q));
        })
        .sort((x, y) => {
            const rank = (a: TrackingRow) => a.topRank ?? 9999;
            switch (sortBy) {
                case "rang": return rank(x) - rank(y);
                case "score": return (y.triScore ?? -1) - (x.triScore ?? -1);
                case "nom": return (x.fullName || "").localeCompare(y.fullName || "", "fr");
                case "recent": return (y.createdAt || "").localeCompare(x.createdAt || "");
                case "ancien": return (x.createdAt || "").localeCompare(y.createdAt || "");
                case "age": return (x.age ?? 999) - (y.age ?? 999);
                default:
                    if (triFilter === "top" || triFilter === "attente" || lot > 0) return rank(x) - rank(y);
                    return 0;
            }
        });

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
        const headers = ["Rang Top 100", "Avis Équipe", "Tri", "Signalements", "Nom Complet", "Sexe", "Âge", "Date de Naissance", "Ville", "Statut Professionnel", "Email", "Téléphone", "Vidéo (YouTube)", "État Vidéo", "Chaîne YouTube", "Titre Vidéo", "Observation Vidéo", "Photo", "Décision", "Motivation", "Date Candidature"];
        const decisionLabel = (s: string) => (s === "approved" ? "Favorable" : s === "rejected" ? "Défavorable" : "En attente");
        const rows = visibleApplications.map((a) => [
            a.topRank ?? "", (a.marks || []).map((m) => `${m.reviewer}: ${m.mark}`).join(" | "), a.categorie ? TRI_LABELS[a.categorie] : "", (a.signalements || []).join(" | "),
            a.fullName, a.gender, a.age ?? "", a.dateOfBirth, a.city, a.professionalStatus, a.email, a.phone,
            a.videoUrl || "", a.videoStatus || "", a.videoChannel || "", a.videoTitle || "", a.videoNote || "",
            a.hasPhoto ? "Oui" : "Non", decisionLabel(a.status), a.motivation,
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
                                    <CardDescription>Candidatures du 3 au 13 novembre 2026 — pré-tri automatique : A = dossier solide, B = correct, C = à vérifier</CardDescription>
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
                                <div className="flex flex-col md:flex-row gap-3 mb-3 p-3 rounded-lg border bg-muted/20">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-sm whitespace-nowrap font-bold">Évaluateur :</Label>
                                        <Input
                                            placeholder="Votre prénom"
                                            value={reviewer}
                                            onChange={(e) => saveReviewer(e.target.value)}
                                            className="w-40"
                                        />
                                    </div>
                                    <select
                                        value={lot}
                                        onChange={(e) => setLot(Number(e.target.value))}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        aria-label="Mon lot"
                                    >
                                        <option value={0}>Lot : tous les dossiers</option>
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                            <option key={n} value={n}>Lot {n} — rangs {(n - 1) * 15 + 1}-{n * 15} + part des autres</option>
                                        ))}
                                    </select>
                                    <Button
                                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                                        disabled={visibleApplications.length === 0}
                                        onClick={() => setReviewIndex(0)}
                                    >
                                        ▶ Mode revue ({visibleApplications.length})
                                    </Button>
                                </div>
                                <div className="flex flex-col md:flex-row gap-3 mb-4">
                                    <Input
                                        placeholder="Rechercher : nom, email, téléphone, ville, chaîne YouTube…"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="md:max-w-md"
                                    />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        aria-label="Trier par"
                                    >
                                        <option value="defaut">Tri : par défaut</option>
                                        <option value="rang">Tri : rang Top 100</option>
                                        <option value="score">Tri : score décroissant</option>
                                        <option value="nom">Tri : nom A → Z</option>
                                        <option value="recent">Tri : plus récentes</option>
                                        <option value="ancien">Tri : plus anciennes</option>
                                        <option value="age">Tri : âge croissant</option>
                                    </select>
                                    {(q || sortBy !== "defaut" || lot > 0) && (
                                        <span className="text-sm text-muted-foreground self-center">
                                            {visibleApplications.length} résultat{visibleApplications.length > 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Button variant={triFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setTriFilter("all")}>
                                        Toutes ({data.stats.total})
                                    </Button>
                                    <Button variant={triFilter === "A" ? "default" : "outline"} size="sm" className={triFilter === "A" ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-500/40"} onClick={() => setTriFilter("A")}>
                                        A — Solides ({data.stats.triA ?? 0})
                                    </Button>
                                    <Button variant={triFilter === "B" ? "default" : "outline"} size="sm" className={triFilter === "B" ? "bg-yellow-600 hover:bg-yellow-700" : "text-yellow-700 border-yellow-500/40"} onClick={() => setTriFilter("B")}>
                                        B — Corrects ({data.stats.triB ?? 0})
                                    </Button>
                                    <Button variant={triFilter === "C" ? "default" : "outline"} size="sm" className={triFilter === "C" ? "bg-red-600 hover:bg-red-700" : "text-red-700 border-red-500/40"} onClick={() => setTriFilter("C")}>
                                        C — À vérifier ({data.stats.triC ?? 0})
                                    </Button>
                                    {nbTop > 0 && (
                                        <Button variant={triFilter === "top" ? "default" : "outline"} size="sm" className={triFilter === "top" ? "bg-accent text-accent-foreground hover:bg-accent/90" : "text-accent border-accent/40"} onClick={() => setTriFilter("top")}>
                                            ⭐ Top 100 ({nbTop})
                                        </Button>
                                    )}
                                    {nbAttente > 0 && (
                                        <Button variant={triFilter === "attente" ? "default" : "outline"} size="sm" onClick={() => setTriFilter("attente")}>
                                            Liste d'attente ({nbAttente})
                                        </Button>
                                    )}
                                    {reviewer.trim().length >= 2 && (
                                        <>
                                            <Button variant={triFilter === "mesbons" ? "default" : "outline"} size="sm" onClick={() => setTriFilter("mesbons")}>
                                                👍 Mes bons profils
                                            </Button>
                                            <Button variant={triFilter === "mesrevoir" ? "default" : "outline"} size="sm" onClick={() => setTriFilter("mesrevoir")}>
                                                🤔 À revoir
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Photo</TableHead>
                                                <TableHead>Nom complet</TableHead>
                                                <TableHead>Rang</TableHead>
                                                <TableHead>Tri</TableHead>
                                                <TableHead>Avis</TableHead>
                                                <TableHead>Sexe</TableHead>
                                                <TableHead>Ville</TableHead>
                                                <TableHead>Vidéo</TableHead>
                                                <TableHead>Décision</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Dossier</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visibleApplications.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                                                        Aucune candidature dans cette catégorie.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                visibleApplications.map((a) => (
                                                    <TableRow key={a.id}>
                                                        <TableCell>
                                                            {a.hasPhoto ? (
                                                                <img src={photoSrc(a.id)} alt={a.fullName} loading="lazy" className="w-10 h-10 rounded-lg object-cover border" />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Camera className="w-4 h-4" /></div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-medium">{a.fullName}</TableCell>
                                                        <TableCell>
                                                            {a.topRank && a.topRank <= 100 ? (
                                                                <Badge className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent/15 whitespace-nowrap">⭐ {a.topRank}</Badge>
                                                            ) : a.topRank ? (
                                                                <Badge variant="outline" className="whitespace-nowrap" title="Liste d'attente">{a.topRank}</Badge>
                                                            ) : null}
                                                        </TableCell>
                                                        <TableCell title={(a.signalements || []).join(" | ") || (a.categorie ? TRI_LABELS[a.categorie] : "")}>{triBadge(a.categorie)}</TableCell>
                                                        <TableCell className="whitespace-nowrap text-sm">
                                                            {(() => {
                                                                const c = markCounts(a);
                                                                const mine = myMark(a);
                                                                return (
                                                                    <span title={(a.marks || []).map((m) => `${m.reviewer} : ${m.mark === "bon" ? "👍" : m.mark === "revoir" ? "🤔" : "✖"}`).join(" · ")}>
                                                                        {c.bon > 0 && <span className="mr-1">👍{c.bon}</span>}
                                                                        {c.revoir > 0 && <span className="mr-1">🤔{c.revoir}</span>}
                                                                        {c.non > 0 && <span className="mr-1">✖{c.non}</span>}
                                                                        {mine && <Badge variant="outline" className="ml-0.5 px-1 text-[10px]">moi : {mine === "bon" ? "👍" : mine === "revoir" ? "🤔" : "✖"}</Badge>}
                                                                    </span>
                                                                );
                                                            })()}
                                                        </TableCell>
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
                                                                        <div className="md:col-span-2 flex items-center gap-2 flex-wrap">
                                                                            {triBadge(a.categorie)}
                                                                            <span className="text-sm font-medium">{a.categorie ? TRI_LABELS[a.categorie] : ""}</span>
                                                                            {a.topRank && a.topRank <= 100 && <Badge className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent/15">⭐ Top 100 — rang {a.topRank}</Badge>}
                                                                            {a.topRank && a.topRank > 100 && <Badge variant="outline">Liste d'attente — rang {a.topRank}</Badge>}
                                                                        </div>
                                                                        {a.videoStatus && (
                                                                            <div className={`md:col-span-2 rounded-lg p-3 border ${a.videoStatus === "En ligne" && (a.videoNote || "").startsWith("OK") ? "bg-green-500/5 border-green-500/20" : a.videoStatus !== "En ligne" || (a.videoNote || "").startsWith("PROBLÈME") ? "bg-red-500/5 border-red-500/20" : "bg-yellow-500/5 border-yellow-500/20"}`}>
                                                                                <Label className="text-xs font-bold">Vérification de la vidéo</Label>
                                                                                <div className="text-sm mt-1 space-y-0.5">
                                                                                    <p><span className="text-muted-foreground">État :</span> {a.videoStatus}</p>
                                                                                    {a.videoChannel && <p><span className="text-muted-foreground">Chaîne :</span> {a.videoChannel}</p>}
                                                                                    {a.videoTitle && <p><span className="text-muted-foreground">Titre :</span> {a.videoTitle}</p>}
                                                                                    {a.videoNote && <p className="font-medium">{a.videoNote}</p>}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {(a.signalements || []).length > 0 && (
                                                                            <div className="md:col-span-2 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                                                                                <Label className="text-xs text-red-700 font-bold">Signalements du pré-tri automatique</Label>
                                                                                <ul className="list-disc list-inside text-sm text-red-800 mt-1 space-y-0.5">
                                                                                    {(a.signalements || []).map((s, i) => <li key={i}>{s}</li>)}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                        <div><Label className="text-xs text-muted-foreground">Sexe</Label><p className="text-sm font-medium">{a.gender === "F" ? "Féminin" : "Masculin"}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Date de naissance</Label><p className="text-sm font-medium">{a.dateOfBirth}{typeof a.age === "number" ? ` (${a.age} ans)` : ""}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Ville</Label><p className="text-sm font-medium">{a.city}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Statut professionnel</Label><p className="text-sm font-medium">{a.professionalStatus}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Email</Label><p className="text-sm font-medium break-all">{a.email}</p></div>
                                                                        <div><Label className="text-xs text-muted-foreground">Téléphone (WhatsApp)</Label><p className="text-sm font-medium">{a.phone}</p></div>
                                                                        {a.videoUrl && (
                                                                            <div className="md:col-span-2">
                                                                                <Label className="text-xs text-muted-foreground">Vidéo de présentation (1 min)</Label>
                                                                                {videoEmbedId(a.videoUrl) && (
                                                                                    <div className="mt-2 rounded-lg overflow-hidden border bg-black mx-auto" style={{ maxWidth: 320 }}>
                                                                                        <iframe
                                                                                            src={`https://www.youtube.com/embed/${videoEmbedId(a.videoUrl)}`}
                                                                                            title={`Vidéo de ${a.fullName}`}
                                                                                            className="w-full aspect-[9/16]"
                                                                                            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                                                                                            allowFullScreen
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                                <p className="mt-1 text-center"><a href={a.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-red-600 hover:underline text-sm font-medium"><Youtube className="w-4 h-4" /> Ouvrir sur YouTube</a></p>
                                                                            </div>
                                                                        )}
                                                                        <div className="md:col-span-2 border-t pt-3">
                                                                            <Label className="text-xs text-muted-foreground font-bold">Mon avis d'évaluateur{reviewer.trim().length >= 2 ? ` (${reviewer.trim()})` : ""}</Label>
                                                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                                                <Button size="sm" variant={myMark(a) === "bon" ? "default" : "outline"} className={myMark(a) === "bon" ? "bg-green-600 hover:bg-green-700" : ""} disabled={savingMark} onClick={() => setMark(a, "bon")}>👍 Bon profil</Button>
                                                                                <Button size="sm" variant={myMark(a) === "revoir" ? "default" : "outline"} className={myMark(a) === "revoir" ? "bg-yellow-600 hover:bg-yellow-700" : ""} disabled={savingMark} onClick={() => setMark(a, "revoir")}>🤔 À revoir</Button>
                                                                                <Button size="sm" variant={myMark(a) === "non" ? "default" : "outline"} className={myMark(a) === "non" ? "bg-red-600 hover:bg-red-700" : ""} disabled={savingMark} onClick={() => setMark(a, "non")}>✖ Non</Button>
                                                                                <span className="text-xs text-muted-foreground">Re-cliquer retire l'avis. Avis de l'équipe : {(a.marks || []).length === 0 ? "aucun" : (a.marks || []).map((m) => `${m.reviewer} ${m.mark === "bon" ? "👍" : m.mark === "revoir" ? "🤔" : "✖"}`).join(" · ")}</span>
                                                                            </div>
                                                                        </div>
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

                        <Dialog open={reviewIndex !== null} onOpenChange={(open) => { if (!open) setReviewIndex(null); }}>
                            <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
                                {reviewIndex !== null && visibleApplications[reviewIndex] && (() => {
                                    const a = visibleApplications[reviewIndex];
                                    const vid = videoEmbedId(a.videoUrl);
                                    const next = () => setReviewIndex(Math.min(reviewIndex + 1, visibleApplications.length - 1));
                                    const markAndNext = async (m: string) => { await setMark(a, m); if (reviewIndex < visibleApplications.length - 1) next(); };
                                    return (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2 flex-wrap">
                                                    <span>Revue {reviewIndex + 1} / {visibleApplications.length}</span>
                                                    {a.topRank && <Badge className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent/15">{a.topRank <= 100 ? `⭐ Rang ${a.topRank}` : `Attente ${a.topRank}`}</Badge>}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    {vid ? (
                                                        <div className="rounded-lg overflow-hidden border bg-black">
                                                            <iframe
                                                                key={a.id}
                                                                src={`https://www.youtube.com/embed/${vid}?autoplay=1`}
                                                                title={`Vidéo de ${a.fullName}`}
                                                                className="w-full aspect-[9/16] max-h-[55vh]"
                                                                allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-destructive">Pas de vidéo lisible.</p>
                                                    )}
                                                    {a.videoNote && <p className={`text-xs mt-2 font-medium ${a.videoNote.startsWith("OK") ? "text-green-700" : "text-red-700"}`}>{a.videoNote}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-bold">{a.fullName}</h3>
                                                    <p className="text-sm text-muted-foreground">{a.gender === "F" ? "Femme" : "Homme"}{typeof a.age === "number" ? ` · ${a.age} ans` : ""} · {a.city} · {a.professionalStatus}</p>
                                                    <div className="text-sm bg-muted/30 p-3 rounded-lg border whitespace-pre-wrap leading-relaxed max-h-[32vh] overflow-y-auto">{a.motivation}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 flex-wrap border-t pt-3">
                                                <Button variant="outline" size="sm" disabled={reviewIndex === 0} onClick={() => setReviewIndex(reviewIndex - 1)}>← Précédent</Button>
                                                <div className="flex gap-2">
                                                    <Button variant={myMark(a) === "bon" ? "default" : "outline"} className={myMark(a) === "bon" ? "bg-green-600 hover:bg-green-700" : ""} disabled={savingMark} onClick={() => markAndNext("bon")}>👍 Bon profil</Button>
                                                    <Button variant={myMark(a) === "revoir" ? "default" : "outline"} className={myMark(a) === "revoir" ? "bg-yellow-600 hover:bg-yellow-700" : ""} disabled={savingMark} onClick={() => markAndNext("revoir")}>🤔 À revoir</Button>
                                                    <Button variant={myMark(a) === "non" ? "default" : "outline"} className={myMark(a) === "non" ? "bg-red-600 hover:bg-red-700" : ""} disabled={savingMark} onClick={() => markAndNext("non")}>✖ Non</Button>
                                                </div>
                                                <Button variant="outline" size="sm" disabled={reviewIndex >= visibleApplications.length - 1} onClick={next}>Suivant →</Button>
                                            </div>
                                        </>
                                    );
                                })()}
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </div>
        </div>
    );
}
