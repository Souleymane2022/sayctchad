import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ShieldCheck, Download, Youtube, Globe } from "lucide-react";

interface InvestRow {
    id: string;
    role: "retenu" | "attente";
    position: number;
    scoreFinal: number | null;
    note: string | null;
    startupName: string;
    sector: string;
    stage: string;
    foundingYear: string | null;
    revenue12m: string | null;
    fundingAmount: string | null;
    website: string | null;
    description: string;
    founderFirstName: string;
    founderLastName: string;
    founderGender: string;
    founderEmail: string;
    founderPhone: string;
    videoUrl: string | null;
    hasDeck: boolean;
    deckFileName: string | null;
}

const videoEmbedId = (u: string | null | undefined) => {
    const m = /(?:youtu\.be\/|shorts\/|watch\?v=|live\/|embed\/)([\w-]{6,})/.exec((u || "").trim());
    return m ? m[1] : null;
};

export default function InvestSelection() {
    const [keyInput, setKeyInput] = useState("");
    const [key, setKey] = useState("");

    const { data, isLoading, error } = useQuery<{ selection: InvestRow[] }>({
        queryKey: ["/api/admin/invest-selection", key],
        enabled: !!key,
        retry: false,
        queryFn: async () => {
            const res = await fetch(`/api/admin/invest-selection?key=${encodeURIComponent(key)}`);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || "Accès refusé");
            }
            return res.json();
        },
    });

    const retenues = (data?.selection || []).filter((r) => r.role === "retenu");
    const attente = (data?.selection || []).filter((r) => r.role === "attente");

    const carte = (r: InvestRow) => {
        const vid = videoEmbedId(r.videoUrl);
        return (
            <Card key={r.id} className={r.note ? "border-amber-500/50" : ""}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                                <Badge className={r.role === "retenu" ? "bg-green-600/15 text-green-800 border border-green-600/40 hover:bg-green-600/15" : "bg-sky-500/15 text-sky-800 border border-sky-500/40 hover:bg-sky-500/15"}>
                                    {r.role === "retenu" ? `N°${r.position}` : `Attente ${r.position}`}
                                </Badge>
                                {r.startupName}
                            </CardTitle>
                            <CardDescription>
                                {r.sector} · {r.stage}{r.foundingYear ? ` · créée en ${r.foundingYear}` : ""}
                                {typeof r.scoreFinal === "number" ? ` · score ${r.scoreFinal}` : ""}
                            </CardDescription>
                        </div>
                        {r.founderGender === "F" && <Badge variant="outline" className="text-pink-700 border-pink-400/50">Fondatrice</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        {vid ? (
                            <div className="rounded-lg overflow-hidden border bg-black">
                                <iframe
                                    src={`https://www.youtube.com/embed/${vid}`}
                                    title={`Pitch ${r.startupName}`}
                                    className="w-full aspect-video"
                                    loading="lazy"
                                    allow="accelerometer; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-destructive">Vidéo pitch indisponible.</p>
                        )}
                        {r.videoUrl && (
                            <p className="mt-1 text-center">
                                <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-red-600 hover:underline text-xs">
                                    <Youtube className="w-3.5 h-3.5" /> Ouvrir sur YouTube
                                </a>
                            </p>
                        )}
                        {r.note && <p className="text-xs text-amber-700 font-medium mt-2">⚠️ {r.note}</p>}
                    </div>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-muted-foreground">Fondateur/trice :</span>{" "}
                            <span className="font-medium">{r.founderFirstName} {r.founderLastName}</span>
                        </p>
                        <p><span className="text-muted-foreground">Téléphone :</span> {r.founderPhone}</p>
                        <p className="break-all"><span className="text-muted-foreground">Email :</span> {r.founderEmail}</p>
                        {r.revenue12m && Number(String(r.revenue12m).replace(/\D/g, "")) > 0 && (
                            <p><span className="text-muted-foreground">Revenus 12 mois :</span> {r.revenue12m} FCFA</p>
                        )}
                        {r.fundingAmount && <p><span className="text-muted-foreground">Recherche :</span> {r.fundingAmount} FCFA</p>}
                        <div className="flex gap-2 flex-wrap pt-1">
                            {(r.website || "").trim() && (
                                <a href={(r.website || "").startsWith("http") ? r.website! : `https://${r.website}`} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline"><Globe className="w-3.5 h-3.5 mr-1" /> Site web</Button>
                                </a>
                            )}
                            {r.hasDeck && (
                                <a href={`/api/admin/invest-ready-applications/${r.id}/file?type=deck&key=${encodeURIComponent(key)}`}>
                                    <Button size="sm" variant="outline"><Download className="w-3.5 h-3.5 mr-1" /> Pitch deck</Button>
                                </a>
                            )}
                        </div>
                        <details className="pt-1">
                            <summary className="cursor-pointer text-muted-foreground text-xs font-bold uppercase tracking-wider">Description du projet</summary>
                            <p className="mt-1 bg-muted/30 p-3 rounded-lg border whitespace-pre-wrap leading-relaxed">{r.description}</p>
                        </details>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-muted/20 py-12">
            <SEOHead title="Sélection Invest Ready (privé) | SAYC Tchad" description="Espace privé." path="/invest-selection" />
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 mb-4">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Espace privé — Représentant National</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Invest Ready Tchad — Sélection des 20 start-ups</h1>
                    <p className="text-muted-foreground">Bootcamp du 25 au 27 novembre 2026 — document de travail confidentiel</p>
                </div>

                {!data && (
                    <Card className="max-w-md mx-auto">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Lock className="w-7 h-7 text-primary" />
                            </div>
                            <CardTitle>Accès restreint</CardTitle>
                            <CardDescription>Entrez le mot de passe administrateur.</CardDescription>
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
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold">{retenues.length}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Retenues</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold">{retenues.filter((r) => r.founderGender === "F").length}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Fondatrices</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold">{attente.length}</p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Liste d'attente</p>
                            </CardContent></Card>
                        </div>

                        <div className="space-y-4">{retenues.map(carte)}</div>

                        {attente.length > 0 && (
                            <>
                                <h2 className="text-xl font-bold mt-10 mb-4">Liste d'attente (dans l'ordre de repêchage)</h2>
                                <div className="space-y-4">{attente.map(carte)}</div>
                            </>
                        )}

                        <p className="text-xs text-muted-foreground mt-8 text-center max-w-2xl mx-auto">
                            Document de travail strictement confidentiel — aucune start-up ne doit être contactée avant validation finale.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
