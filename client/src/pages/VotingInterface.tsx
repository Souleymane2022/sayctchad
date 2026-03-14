import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type ElectionCandidate, type InsertVote } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Vote, CheckCircle2, AlertCircle, ShieldCheck, User, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";

const roles = [
    "Leader National",
    "Leader Adjoint",
    "Secteur Privé",
    "Académique",
    "Inclusion"
];

export default function VotingInterface() {
    const { toast } = useToast();
    const [step, setStep] = useState<"verify" | "vote" | "done">("verify");
    const [voterInfo, setVoterInfo] = useState({ membershipId: "", email: "" });
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});

    const { data: candidates, isLoading } = useQuery<ElectionCandidate[]>({
        queryKey: ["/api/elections/candidates"],
        enabled: step === "vote",
    });

    const voteMutation = useMutation({
        mutationFn: async (vote: InsertVote & { membershipId: string; email: string }) => {
            const res = await apiRequest("POST", "/api/elections/vote", vote);
            return res.json();
        },
        onSuccess: () => {
            if (currentRoleIndex < roles.length - 1) {
                setCurrentRoleIndex(prev => prev + 1);
            } else {
                setStep("done");
                toast({
                    title: "Merci pour votre vote !",
                    description: "Vos choix ont été enregistrés avec succès.",
                });
            }
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur lors du vote",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!voterInfo.membershipId || !voterInfo.email) {
            toast({
                title: "Champs requis",
                description: "Veuillez entrer votre ID de membre et votre email.",
                variant: "destructive",
            });
            return;
        }
        setStep("vote");
    };

    const handleVote = (candidateId: string) => {
        const role = roles[currentRoleIndex];
        voteMutation.mutate({
            membershipId: voterInfo.membershipId,
            email: voterInfo.email,
            candidateId,
            role,
            voterId: "" // backend handles this properly
        });
    };

    const currentRole = roles[currentRoleIndex];
    const roleCandidates = candidates?.filter(c => c.role === currentRole) || [];

    if (step === "done") {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center">
                <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-sayc-teal/10 text-sayc-teal rounded-full flex items-center justify-center mx-auto border-4 border-sayc-teal/20">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-heading font-bold text-[#1e3a8a]">Vote Terminé !</h1>
                        <p className="text-muted-foreground">
                            Vous avez accompli votre devoir de membre. Votre voix compte pour l'avenir de la technologie au Tchad.
                        </p>
                    </div>
                    <div className="pt-6">
                        <Link href="/">
                            <Button className="w-full h-14 rounded-2xl bg-[#1e3a8a] text-lg font-bold shadow-xl shadow-blue-900/20">
                                Retour à l'accueil
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <SEOHead title="Espace de Vote - SAYC Tchad" description="Votez pour le futur Comité National du SAYC Tchad." path="/elections/voter" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <Badge variant="outline" className="text-sayc-teal border-sayc-teal uppercase tracking-wider text-[10px] font-bold">
                            Scrutin National 2026
                        </Badge>
                        <h1 className="text-3xl font-heading font-bold text-[#1e3a8a]">Espace de Vote Numérique</h1>
                    </div>
                    {step === "vote" && (
                        <div className="flex gap-2">
                            {roles.map((_, i) => (
                                <div key={i} className={`h-2 w-8 rounded-full transition-all duration-500 ${i <= currentRoleIndex ? 'bg-sayc-teal' : 'bg-slate-200'}`} />
                            ))}
                        </div>
                    )}
                </div>

                {step === "verify" ? (
                    <Card className="border-none shadow-2xl overflow-hidden max-w-xl mx-auto">
                        <div className="h-2 bg-sayc-teal" />
                        <CardHeader className="space-y-4 pb-8">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Vérification du Membre</CardTitle>
                                <CardDescription>Identifiez-vous pour accéder au bulletin de vote.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleVerify} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="membershipId">ID de Membre (SAYC-XXXXXX)</Label>
                                        <Input 
                                            id="membershipId" 
                                            placeholder="SAYC-123456" 
                                            value={voterInfo.membershipId}
                                            onChange={(e) => setVoterInfo(prev => ({ ...prev, membershipId: e.target.value }))}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email d'inscription</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            placeholder="votre@email.com" 
                                            value={voterInfo.email}
                                            onChange={(e) => setVoterInfo(prev => ({ ...prev, email: e.target.value }))}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 bg-[#1e3a8a] hover:bg-[#1e40af] text-lg font-bold rounded-2xl shadow-lg">
                                    Accéder au vote <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                                    <AlertCircle className="w-3 h-3" /> Votre vote est strictement personnel et sécurisé.
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
                        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-sayc-teal text-white rounded-xl flex items-center justify-center font-bold text-xl">
                                    {currentRoleIndex + 1}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1e3a8a]">{currentRole}</h2>
                                    <p className="text-sm text-muted-foreground">Choisissez votre candidat pour ce poste.</p>
                                </div>
                            </div>
                            {currentRoleIndex > 0 && (
                                <Button variant="ghost" onClick={() => setCurrentRoleIndex(prev => prev - 1)} className="text-muted-foreground">
                                    <ChevronLeft className="mr-2 w-4 h-4" /> Poste précédent
                                </Button>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center py-20 gap-4">
                                <Loader2 className="w-12 h-12 text-sayc-teal animate-spin" />
                                <p className="text-muted-foreground animate-pulse">Chargement des candidats...</p>
                            </div>
                        ) : roleCandidates.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-500">Aucun candidat validé</h3>
                                <p className="text-slate-400">Il n'y a pas encore de candidats pour ce poste.</p>
                                <Button variant="outline" className="mt-6" onClick={() => setCurrentRoleIndex(prev => prev + 1)}>
                                    Passer au poste suivant
                                </Button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {roleCandidates.map((candidate) => (
                                    <Card key={candidate.id} className="border hover:border-sayc-teal transition-all group overflow-hidden bg-white hover:shadow-xl rounded-2xl">
                                        <div className="aspect-[4/5] relative overflow-hidden">
                                            <img 
                                                src={candidate.photoUrl} 
                                                alt={`${candidate.firstName} ${candidate.lastName}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20">
                                                <h3 className="text-xl font-bold text-white leading-tight">
                                                    {candidate.firstName} <br />
                                                    {candidate.lastName}
                                                </h3>
                                            </div>
                                        </div>
                                        <CardContent className="pt-6 space-y-6">
                                            <div className="flex flex-col gap-2">
                                                <a 
                                                    href={candidate.programUrl || "#"} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-sayc-teal font-semibold hover:underline"
                                                >
                                                    <ExternalLink className="w-4 h-4" /> Voir le programme d'action
                                                </a>
                                                <a 
                                                    href={candidate.videoUrl || "#"} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline"
                                                >
                                                    <ExternalLink className="w-4 h-4" /> Voir la vidéo de présentation
                                                </a>
                                            </div>

                                            <Button 
                                                className="w-full h-12 bg-sayc-teal hover:bg-sayc-teal/90 text-white font-bold rounded-xl"
                                                onClick={() => handleVote(candidate.id)}
                                                disabled={voteMutation.isPending}
                                            >
                                                {voteMutation.isPending && voteMutation.variables?.candidateId === candidate.id ? (
                                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</>
                                                ) : (
                                                    <><Vote className="mr-2 h-5 w-5" /> Je vote pour ce candidat</>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
