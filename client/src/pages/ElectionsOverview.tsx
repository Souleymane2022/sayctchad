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
    Globe, 
    ShieldCheck, 
    Target,
    LayoutDashboard,
    Heart,
    Star,
    History
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

const electionPhases = [
    {
        title: "Appel à Candidature",
        status: "Terminé",
        date: "Clôturé",
        description: "La période de réception des dossiers est terminée.",
        icon: CheckCircle2,
        color: "text-gray-400",
        bgColor: "bg-gray-100"
    },
    {
        title: "Filtrage & Validation",
        status: "Terminé",
        date: "Clôturé",
        description: "Vérification des critères d'éligibilité terminée.",
        icon: ShieldCheck,
        color: "text-gray-400",
        bgColor: "bg-gray-100"
    },
    {
        title: "Vote des Membres",
        status: "Terminé",
        date: "Clôturé le 27 Avr. 12h00",
        description: "Scrutin numérique sécurisé clôturé avec 1697 votants.",
        icon: Vote,
        color: "text-emerald-500",
        bgColor: "bg-emerald-50"
    },
    {
        title: "Proclamation des Résultats",
        status: "Effectué",
        date: "27 Avril, 15h00",
        description: "Le Bureau National 2026-2028 est officiellement investi.",
        icon: Award,
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
                title="Résultats Proclamés - Élections SAYC Tchad"
                description="Le Bureau National 2026-2028 du SAYC Tchad a été officiellement proclamé. Consultez les résultats."
                path="/elections"
            />

            {/* Hero Section - Proclamation Edition */}
            <div className="bg-primary text-white py-16 md:py-28 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Award className="w-96 h-96 rotate-12" />
                </div>
                
                <div className="container mx-auto max-w-6xl relative z-10 text-center space-y-10">
                    <div className="flex justify-center">
                        <Badge className="bg-accent text-white border-none px-6 py-2 text-sm font-black animate-bounce shadow-lg shadow-accent/20">
                            RÉSULTATS PROCLAMÉS
                        </Badge>
                    </div>
                    
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                            Une Nouvelle Ère <br /> 
                            <span className="text-sayc-teal">pour le SAYC Tchad</span>
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto font-medium">
                            Le scrutin du 20 au 27 avril 2026 a rendu son verdict. Nous sommes fiers d'annoncer la mise en place officielle du **Bureau National** pour un mandat de 2 ans.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 pt-6">
                        <Link href="/elections/candidats">
                            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 px-10 h-16 rounded-[1.5rem] text-xl font-black shadow-2xl transition-all border-0">
                                <Users className="w-6 h-6 mr-3 text-sayc-teal" /> VOIR LE BUREAU ÉLU
                            </Button>
                        </Link>
                        <Link href="/elections/transparence">
                            <Button size="lg" className="bg-sayc-teal/10 hover:bg-sayc-teal/20 text-white px-10 h-16 rounded-[1.5rem] text-xl font-black transition-all border-2 border-sayc-teal/30">
                                <ShieldCheck className="w-6 h-6 mr-3 text-sayc-teal" /> AUDIT & TRANSPARENCE
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-16 space-y-24">
                
                {/* Statistics Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24 relative z-20">
                    <Card className="bg-white border-none shadow-xl rounded-[2rem] p-8 text-center space-y-2">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-2">
                            <Vote className="w-6 h-6" />
                        </div>
                        <h3 className="text-4xl font-black text-primary">1697</h3>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Votes Exprimés</p>
                    </Card>
                    <Card className="bg-white border-none shadow-xl rounded-[2rem] p-8 text-center space-y-2">
                        <div className="w-12 h-12 bg-sayc-teal/10 rounded-2xl flex items-center justify-center text-sayc-teal mx-auto mb-2">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-4xl font-black text-primary">04</h3>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Départements Clés</p>
                    </Card>
                    <Card className="bg-white border-none shadow-xl rounded-[2rem] p-8 text-center space-y-2">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-2">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-4xl font-black text-primary">100%</h3>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Intégrité Certifiée</p>
                    </Card>
                </section>

                {/* Timeline Section */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <Badge variant="outline" className="border-sayc-teal text-sayc-teal px-4 py-1 rounded-full font-black text-xs">ARCHIVES DU SCRUTIN</Badge>
                        <h2 className="text-3xl md:text-4xl font-black text-primary">Historique du Processus</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {electionPhases.map((phase, i) => (
                            <Card key={i} className="border-none shadow-md bg-white rounded-[2rem] overflow-hidden relative group opacity-90 hover:opacity-100 transition-opacity">
                                <CardHeader className="space-y-4 pb-2">
                                    <div className={`w-12 h-12 rounded-xl ${phase.bgColor} ${phase.color} flex items-center justify-center`}>
                                        <phase.icon className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className={`${phase.color} border-current text-[10px] font-black`}>
                                        {phase.status}
                                    </Badge>
                                    <CardTitle className="text-lg font-black text-primary">{phase.title}</CardTitle>
                                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase">
                                        <History className="mr-1 h-3 w-3" /> {phase.date}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {phase.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Roles & Mandate */}
                <section className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-primary">Le Mandat 2026-2028</h2>
                            <p className="text-lg text-slate-600 font-medium">
                                Le nouveau bureau s'engage pour une durée de 2 ans non renouvelable autour des piliers suivants :
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Développement de l'écosystème numérique dans les 23 provinces.",
                                "Renforcement des capacités technologiques de la jeunesse.",
                                "Inclusion numérique active des femmes et des zones rurales.",
                                "Création de ponts entre le secteur privé et l'innovation locale.",
                                "Garantie d'une gouvernance transparente et participative."
                            ].map((text, i) => (
                                <div key={i} className="flex gap-4 items-start bg-white p-5 rounded-2xl border-l-4 border-sayc-teal shadow-sm">
                                    <Star className="w-5 h-5 text-sayc-teal shrink-0 mt-0.5 fill-sayc-teal/20" />
                                    <span className="text-sm font-bold text-slate-700 leading-relaxed">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="border-none shadow-2xl bg-primary text-white rounded-[3rem] overflow-hidden relative">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10">
                            <Users className="w-64 h-64" />
                        </div>
                        <CardHeader className="p-8 md:p-12 pb-4">
                            <CardTitle className="text-3xl font-black">Architecture du Bureau</CardTitle>
                            <CardDescription className="text-blue-100/70 font-medium">
                                Structure opérationnelle pilotée par le Leader National.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 md:p-12 pt-0 space-y-6">
                            {committeeRoles.map((role, i) => (
                                <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-sayc-teal/20 text-sayc-teal flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <role.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-black text-lg">{role.title}</h4>
                                        <p className="text-sm text-blue-100/60 font-medium leading-tight">{role.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                {/* Final Call to Action */}
                <section className="bg-gradient-to-br from-sayc-teal to-emerald-600 rounded-[3rem] p-8 md:p-16 text-[#0f172a] text-center space-y-8 relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">Le Futur se construit Ensemble.</h2>
                        <p className="text-[#0f172a]/70 max-w-2xl mx-auto text-xl font-bold">
                            Félicitations au nouveau Bureau National et merci à tous les membres pour cette leçon de démocratie numérique.
                        </p>
                        <div className="pt-6 flex justify-center gap-4">
                            <Link href="/elections/candidats">
                                <Button size="lg" className="bg-primary hover:bg-blue-900 text-white px-10 h-16 rounded-[1.5rem] text-xl font-black shadow-xl border-0">
                                    REJOINDRE LA DYNAMIQUE
                                </Button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Abstract Decoration */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
                </section>

            </div>
        </div>
    );
}
