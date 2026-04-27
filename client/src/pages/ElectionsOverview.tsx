import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Calendar, 
    CheckCircle2, 
    Users, 
    Award, 
    Vote, 
    ChevronRight, 
    UserPlus, 
    Globe, 
    ShieldCheck, 
    Target,
    LayoutDashboard,
    Heart
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

const electionPhases = [
    {
        title: "Appel à Candidature",
        status: "Terminé",
        date: "Clôturé",
        description: "La période de réception des dossiers est désormais terminée. Merci à tous les candidats.",
        icon: CheckCircle2,
        color: "text-gray-500",
        bgColor: "bg-gray-100"
    },
    {
        title: "Filtrage & Validation",
        status: "Terminé",
        date: "Clôturé",
        description: "Vérification des critères d'éligibilité et sélection des finalistes par le comité technique.",
        icon: ShieldCheck,
        color: "text-gray-500",
        bgColor: "bg-gray-100"
    },
    {
        title: "Campagne Électorale",
        status: "En cours",
        date: "J-2",
        description: "Présentation des programmes, débats publics et vision des candidats pour le numérique.",
        icon: Globe,
        color: "text-amber-600",
        bgColor: "bg-amber-50"
    },
    {
        title: "Vote des Membres",
        status: "En cours",
        date: "Clôture : 27 Avr. 12h00",
        description: "Scrutin numérique sécurisé sur sayctchad.org ouvert depuis le 20 Avril.",
        icon: Vote,
        color: "text-sayc-teal",
        bgColor: "bg-sayc-teal/10"
    },
    {
        title: "Proclamation des Résultats",
        status: "À venir",
        date: "27 Avril, 15h00",
        description: "Annonce officielle des élus du premier Comité National SAYC Tchad.",
        icon: Award,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
    }
];

const committeeRoles = [
    {
        title: "Leader National Adjoint",
        desc: "Coordination des provinces et création des chapitres régionaux.",
        icon: Users
    },
    {
        title: "Secteur Privé & Innovation",
        desc: "Partenariats avec les hubs tech, startups et écosystème d'innovation.",
        icon: LayoutDashboard
    },
    {
        title: "Représentant Académique",
        desc: "Universités, recherche et formation continue au numérique.",
        icon: Award
    },
    {
        title: "Inclusion & Genre",
        desc: "Inclusion des femmes et des jeunes des régions éloignées.",
        icon: Heart
    }
];

export default function ElectionsOverview() {
    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead 
                title="Élections Comité National SAYC Tchad"
                description="Participez à la mise en place du Comité National du Smart Africa Youth Chapter Tchad."
                path="/elections"
            />

            {/* Hero Section with Live Posters */}
            <div className="bg-[#1e3a8a] text-white py-12 md:py-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Vote className="w-64 h-64 rotate-12" />
                </div>
                
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 text-left">
                            <Badge className="bg-red-600 animate-pulse text-white border-none px-4 py-1 text-xs font-black">
                                JOUR DU SCRUTIN • DIRECT
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
                                Le Verdict des Urnes <br /> 
                                <span className="text-sayc-teal">est pour Aujourd'hui</span>
                            </h1>
                            <p className="text-lg text-blue-100 max-w-xl">
                                Les votes se terminent à <span className="font-black text-white underline decoration-sayc-teal underline-offset-4">12H00 précises</span>. 
                                La proclamation solennelle des résultats aura lieu à <span className="font-black text-white underline decoration-orange-500 underline-offset-4">15H00</span>.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/elections/voter">
                                    <Button size="lg" className="bg-sayc-teal hover:bg-sayc-teal/90 text-[#020817] px-10 h-14 rounded-2xl text-lg font-black shadow-2xl transition-all border-0">
                                        VOTER AVANT 12H
                                    </Button>
                                </Link>
                                <Link href="/elections/transparence">
                                    <Button size="lg" variant="outline" className="bg-white/5 border-white/20 text-white px-8 h-14 rounded-2xl text-lg font-bold backdrop-blur-sm">
                                        <ShieldCheck className="mr-2 h-5 w-5" /> Audit Direct
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <img src="/api/proxy-image?path=C:/Users/Hp/.gemini/antigravity/brain/b5d80a73-9f72-4c56-bc99-1fe576e7731e/cloture_elections_sayc_12h_1777275091438.png" alt="Clôture 12h" className="w-full h-auto" />
                                </div>
                                <p className="text-center text-[10px] font-black text-white/40 uppercase tracking-widest">Fin du Scrutin</p>
                            </div>
                            <div className="space-y-4 mt-8">
                                <div className="rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <img src="/api/proxy-image?path=C:/Users/Hp/.gemini/antigravity/brain/b5d80a73-9f72-4c56-bc99-1fe576e7731e/proclamation_resultats_sayc_15h_1777275108203.png" alt="Proclamation 15h" className="w-full h-auto" />
                                </div>
                                <p className="text-center text-[10px] font-black text-white/40 uppercase tracking-widest">Résultats</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-16 space-y-24">
                
                {/* Phases Section */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-heading font-bold text-[#1e3a8a]">Processus Électoral</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Un parcours transparent et rigoureux pour garantir un leadership de qualité.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {electionPhases.map((phase, i) => (
                            <Card key={i} className="border-none shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                                <CardHeader className="space-y-4 pb-2">
                                    <div className={`w-14 h-14 rounded-2xl ${phase.bgColor} ${phase.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <phase.icon className="w-8 h-8" />
                                    </div>
                                    <Badge variant="outline" className={`${phase.color} border-current text-[10px]`}>
                                        {phase.status}
                                    </Badge>
                                    <CardTitle className="text-xl">{phase.title}</CardTitle>
                                    <div className="flex items-center text-xs text-muted-foreground font-medium">
                                        <Calendar className="mr-1 h-3 w-3" /> {phase.date}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {phase.description}
                                    </p>
                                </CardContent>
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-4xl -mr-2 -mt-2">
                                    0{i + 1}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Eligibility & Roles */}
                <section className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-heading font-bold text-[#1e3a8a]">Qui peut postuler ?</h2>
                            <p className="text-muted-foreground">
                                Conformément au cadre de gouvernance de Smart Africa, les candidats doivent répondre aux critères suivants :
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Être âgé de 18 à 35 ans au moment de l'élection.",
                                "Être de nationalité tchadienne ou résident actif dans l'écosystème numérique.",
                                "Être membre inscrit et vérifié du SAYC Tchad.",
                                "Avoir une expérience prouvée dans la technologie, l'innovation ou l'engagement jeunesse.",
                                "Être disponible pour un mandat de 2 ans non renouvelable."
                            ].map((text, i) => (
                                <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-xl border-l-4 border-sayc-teal shadow-sm">
                                    <CheckCircle2 className="w-6 h-6 text-sayc-teal shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium text-slate-700">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="border-none shadow-2xl bg-[#1e3a8a] text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl">Postes à pourvoir</CardTitle>
                            <CardDescription className="text-blue-100/70">
                                4 représentants pour piloter la stratégie nationale (en complément du Leader National).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {committeeRoles.map((role, i) => (
                                <div key={i} className="flex gap-4 items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-sayc-teal/20 text-sayc-teal flex items-center justify-center shrink-0">
                                        <role.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-sm">{role.title}</h4>
                                        <p className="text-xs text-blue-100/60">{role.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                {/* Instructions de Vote */}
                <section className="bg-white rounded-3xl p-8 md:p-12 border shadow-sm space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-heading font-bold text-[#1e3a8a]">Comment voter ? (Prochainement)</h2>
                        <p className="text-muted-foreground">Voici les étapes pour participer au scrutin numérique lorsqu'il sera ouvert :</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                                <UserPlus className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg">1. Devenir Membre</h4>
                            <p className="text-sm text-muted-foreground">Seuls les membres inscrits et vérifiés du SAYC Tchad peuvent voter.</p>
                            <Link href="/rejoindre">
                                <Button variant="ghost" className="text-sayc-teal font-bold p-0">S'inscrire ici</Button>
                            </Link>
                        </div>
                        
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-sayc-teal/10 text-sayc-teal rounded-2xl flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg">2. Identifiants</h4>
                            <p className="text-sm text-muted-foreground">Munissez-vous de votre **ID de Membre (SAYC-XXXXXX)** et de votre adresse email d'inscription.</p>
                        </div>
                        
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                                <Vote className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg">3. Vote Sécurisé</h4>
                            <p className="text-sm text-muted-foreground">Une fois le scrutin ouvert, cliquez sur "Voter" et suivez les instructions pour chaque poste.</p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-br from-[#1e3a8a] to-blue-900 rounded-3xl p-8 md:p-16 text-white text-center space-y-8 relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold">Prêt à porter la voix de la jeunesse numérique ?</h2>
                        <p className="text-blue-100 max-w-xl mx-auto">
                            Le comité national est le moteur du changement. Soumettez votre candidature aujourd'hui et faites partie de l'histoire.
                        </p>
                        <div className="pt-6 flex justify-center gap-4">
                            <Link href="/elections/candidats">
                                <Button size="lg" className="bg-sayc-teal hover:bg-sayc-teal/90 text-[#0f172a] px-10 h-14 rounded-xl text-lg font-bold hover:shadow-lg transition-all border-0">
                                    Découvrir les Candidats
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-sayc-teal/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
                </section>

            </div>
        </div>
    );
}
