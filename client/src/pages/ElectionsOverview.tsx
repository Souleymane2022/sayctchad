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
        status: "Bientôt",
        date: "7 à 10 jours",
        description: "Lancement officiel et réception des dossiers des candidats sur la plateforme.",
        icon: UserPlus,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
    },
    {
        title: "Lancement Officiel",
        status: "À venir",
        date: "Prochainement",
        description: "Ouverture solennelle du portail de candidature pour tous les membres.",
        icon: Target,
        color: "text-sayc-teal",
        bgColor: "bg-sayc-teal/10"
    },
    {
        title: "Filtrage & Validation",
        status: "À venir",
        date: "Après l'appel",
        description: "Vérification des critères d'éligibilité et sélection des finalistes par un comité technique.",
        icon: ShieldCheck,
        color: "text-amber-600",
        bgColor: "bg-amber-50"
    },
    {
        title: "Campagne Électorale",
        status: "À venir",
        date: "5 jours",
        description: "Présentation des programmes, débats publics et vision des candidats pour le numérique.",
        icon: Globe,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
    },
    {
        title: "Vote des Membres",
        status: "À venir",
        date: "24-48 heures",
        description: "Scrutin numérique sécurisé sur sayctchad.org réservé aux membres inscrits.",
        icon: Vote,
        color: "text-sayc-teal",
        bgColor: "bg-sayc-teal/10"
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

            {/* Hero Section */}
            <div className="bg-[#1e3a8a] text-white py-20 px-4">
                <div className="container mx-auto max-w-5xl text-center space-y-6">
                    <Badge variant="outline" className="text-blue-100 border-blue-100/30 uppercase tracking-widest text-[10px] font-bold">
                        Scrutin National 2026
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold">
                        Bâtissons le Futur Numérique <br /> 
                        <span className="text-sayc-teal">du Tchad Ensemble</span>
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        Le SAYC Tchad lance le processus démocratique pour élire son premier Comité National. 
                        Un moment historique pour la jeunesse technologique tchadienne.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Link href="/elections/postuler">
                            <Button size="lg" className="bg-sayc-teal hover:bg-sayc-teal/90 text-white px-8 h-14 rounded-xl text-lg font-bold shadow-lg shadow-sayc-teal/20">
                                Postuler maintenant
                            </Button>
                        </Link>
                        <Link href="/elections/voter">
                            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white px-8 h-14 rounded-xl text-lg font-bold backdrop-blur-sm">
                                <Vote className="mr-2 h-5 w-5" /> Voter maintenant
                            </Button>
                        </Link>
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

                {/* Call to Action */}
                <section className="bg-gradient-to-br from-[#1e3a8a] to-blue-900 rounded-3xl p-8 md:p-16 text-white text-center space-y-8 relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold">Prêt à porter la voix de la jeunesse numérique ?</h2>
                        <p className="text-blue-100 max-w-xl mx-auto">
                            Le comité national est le moteur du changement. Soumettez votre candidature aujourd'hui et faites partie de l'histoire.
                        </p>
                        <div className="pt-6">
                            <Link href="/elections/postuler">
                                <Button size="lg" className="bg-white text-[#1e3a8a] hover:bg-blue-50 px-10 h-14 rounded-xl text-lg font-bold group">
                                    Candidater <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
